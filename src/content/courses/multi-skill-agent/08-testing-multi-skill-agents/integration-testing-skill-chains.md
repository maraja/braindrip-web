# Integration Testing Skill Chains

**One-Line Summary**: How to test that agent skills work correctly together by validating data flow between steps, conditional branching logic, and error propagation across multi-skill chains.

**Prerequisites**: `unit-testing-individual-skills.md`, familiarity with pytest fixtures and recording patterns

## What Is Integration Testing for Skill Chains?

Unit tests verify that each instrument is in tune; integration tests verify that the musicians can play together. A flute might be perfectly in tune and a piano might be perfectly in tune, but if they are playing in different keys, the result is cacophony. Integration testing for skill chains verifies that the output of one skill is correctly consumed by the next skill, that branching decisions based on intermediate results are correct, and that errors in one skill propagate appropriately to the rest of the chain.

In a multi-skill agent, a typical task involves chaining 3–10 skill calls: search the web, extract key facts, query a database, compare results, generate a summary. Each transition between skills is a potential failure point. The search might return results in a format the extraction step does not expect. The database query might return null where the comparison step expects a number. Integration tests catch these interface mismatches that unit tests, by design, cannot see.

Integration tests sit in the middle of the testing pyramid. They are slower than unit tests (1–10 seconds vs milliseconds) but faster and cheaper than full end-to-end evaluations. They typically mock the LLM (to maintain determinism) but use real skill functions with recorded API responses, testing the actual data transformation pipeline.

## How It Works

### Testing Data Flow Between Skills

The most common integration test pattern verifies that the output of skill A can be successfully processed by skill B.

```python
import pytest
import json
from agent.skills.web_search import search_web, SearchResult
from agent.skills.text_extractor import extract_key_facts
from agent.skills.summarizer import generate_summary


@pytest.fixture
def recorded_search_results():
    """Recorded response from a real search API call."""
    return [
        SearchResult(
            title="Climate Change Effects on Agriculture",
            url="https://example.com/climate-agriculture",
            snippet="Rising temperatures are projected to reduce crop yields "
                    "by 10-25% by 2050 in tropical regions.",
        ),
        SearchResult(
            title="Agricultural Adaptation Strategies",
            url="https://example.com/adaptation",
            snippet="Drought-resistant crop varieties and improved irrigation "
                    "can offset 40-60% of projected yield losses.",
        ),
    ]


@pytest.mark.asyncio
async def test_search_to_extraction_data_flow(recorded_search_results):
    """Test that search results flow correctly into the extraction step."""
    # The extractor expects a list of SearchResult objects
    facts = await extract_key_facts(recorded_search_results)

    assert len(facts) > 0
    for fact in facts:
        assert hasattr(fact, "text")
        assert hasattr(fact, "source_url")
        assert fact.source_url in [r.url for r in recorded_search_results]


@pytest.mark.asyncio
async def test_extraction_to_summary_data_flow(recorded_search_results):
    """Test the full chain from extracted facts to summary."""
    facts = await extract_key_facts(recorded_search_results)
    summary = await generate_summary(
        facts=facts,
        task="Summarize the impact of climate change on agriculture",
    )

    assert isinstance(summary, str)
    assert len(summary) > 50
    assert len(summary) < 5000
```

### Testing with Recorded Fixtures

Record real API responses once, then replay them in tests for deterministic, fast integration testing.

```python
import json
import hashlib
from pathlib import Path
from unittest.mock import patch, MagicMock, AsyncMock

FIXTURES_DIR = Path(__file__).parent / "fixtures"


def load_fixture(name: str) -> dict:
    """Load a recorded API response fixture."""
    fixture_path = FIXTURES_DIR / f"{name}.json"
    with open(fixture_path) as f:
        return json.load(f)


def save_fixture(name: str, data: dict):
    """Save an API response as a fixture for future tests."""
    FIXTURES_DIR.mkdir(exist_ok=True)
    fixture_path = FIXTURES_DIR / f"{name}.json"
    with open(fixture_path, "w") as f:
        json.dump(data, f, indent=2)


class FixtureReplayClient:
    """An HTTP client that replays recorded responses."""

    def __init__(self, fixture_set: str):
        self.fixtures = load_fixture(fixture_set)
        self._call_index = 0

    async def get(self, url: str, **kwargs) -> MagicMock:
        key = f"call_{self._call_index}"
        self._call_index += 1

        if key not in self.fixtures:
            raise ValueError(f"No recorded fixture for call index {self._call_index - 1}")

        recorded = self.fixtures[key]
        response = MagicMock()
        response.status_code = recorded["status_code"]
        response.json.return_value = recorded["body"]
        response.headers = recorded.get("headers", {})
        response.raise_for_status = MagicMock()

        if recorded["status_code"] >= 400:
            import httpx
            response.raise_for_status.side_effect = httpx.HTTPStatusError(
                "Error", request=MagicMock(), response=response
            )

        return response

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        pass


@pytest.mark.asyncio
async def test_three_step_chain_with_fixtures():
    """Test a complete 3-step skill chain using recorded fixtures."""
    client = FixtureReplayClient("research_chain_fixtures")

    with patch("agent.skills.web_search.httpx.AsyncClient", return_value=client):
        with patch("agent.skills.database.get_connection") as mock_db:
            mock_db.return_value = load_fixture("db_results_climate")

            # Step 1: Search
            search_results = await search_web("climate change agriculture impact")
            assert len(search_results) >= 2

            # Step 2: Extract facts
            facts = await extract_key_facts(search_results)
            assert len(facts) >= 3

            # Step 3: Enrich with database data
            from agent.skills.database import query_dataset
            db_results = await query_dataset(
                "crop_yields",
                filters={"year_range": [2020, 2025]},
            )

            # Verify the chain produced compatible data at each step
            assert all(hasattr(f, "text") for f in facts)
            assert "data" in db_results
            assert len(db_results["data"]) > 0
```

### Testing Conditional Branching Logic

Agents often choose different skill sequences based on intermediate results. Test each branch.

```python
from agent.planner import choose_next_skill


@pytest.mark.asyncio
async def test_branching_on_search_result_count():
    """Agent should use different strategies based on search result volume."""
    # Many results: proceed to filtering
    many_results = [SearchResult(title=f"Result {i}", url=f"https://example.com/{i}",
                                  snippet=f"Content {i}") for i in range(20)]
    next_skill = await choose_next_skill("research", many_results)
    assert next_skill == "filter_and_rank"

    # Few results: broaden the search
    few_results = [SearchResult(title="Only result", url="https://example.com/1",
                                 snippet="Sparse content")]
    next_skill = await choose_next_skill("research", few_results)
    assert next_skill == "broaden_search"

    # No results: fall back to LLM knowledge
    no_results = []
    next_skill = await choose_next_skill("research", no_results)
    assert next_skill == "llm_knowledge_fallback"


@pytest.mark.asyncio
async def test_branching_on_data_type():
    """Agent should route to appropriate processing skill based on data type."""
    from agent.planner import route_data_processing

    csv_data = {"format": "csv", "rows": 1000, "columns": ["date", "value"]}
    assert await route_data_processing(csv_data) == "pandas_analyzer"

    image_data = {"format": "png", "width": 800, "height": 600}
    assert await route_data_processing(image_data) == "image_analyzer"

    text_data = {"format": "text", "length": 5000}
    assert await route_data_processing(text_data) == "text_extractor"
```

### Testing Error Propagation

Verify that errors in one skill are correctly handled by the chain — not swallowed, not causing crashes, and triggering the right recovery behavior.

```python
@pytest.mark.asyncio
async def test_error_propagation_in_chain():
    """Errors in step 2 should propagate correctly to the chain handler."""
    from agent.chain import SkillChain
    from agent.errors import ToolExecutionError, ChainError

    chain = SkillChain(steps=["search", "extract", "summarize"])

    # Make the extract step fail
    with patch("agent.skills.text_extractor.extract_key_facts") as mock_extract:
        mock_extract.side_effect = ToolExecutionError(
            tool_name="extract_key_facts",
            status_code=500,
            message="Extraction service unavailable",
            retryable=True,
        )

        with pytest.raises(ChainError) as exc_info:
            await chain.execute({"query": "test"})

        assert exc_info.value.failed_step == "extract"
        assert exc_info.value.completed_steps == ["search"]
        assert exc_info.value.remaining_steps == ["summarize"]


@pytest.mark.asyncio
async def test_partial_results_on_chain_failure():
    """Chain should preserve partial results when a later step fails."""
    from agent.chain import SkillChain

    chain = SkillChain(steps=["search", "extract", "summarize"])

    with patch("agent.skills.summarizer.generate_summary") as mock_summary:
        mock_summary.side_effect = ToolExecutionError(
            tool_name="generate_summary",
            status_code=503,
            message="Summarizer unavailable",
            retryable=True,
        )

        result = await chain.execute_with_partial_results({"query": "test"})

        assert result.completed_steps == ["search", "extract"]
        assert "search" in result.partial_data
        assert "extract" in result.partial_data
        assert result.completeness == pytest.approx(2 / 3, abs=0.01)
```

### Deterministic vs Non-Deterministic Testing

When the LLM is part of the chain, tests become non-deterministic. Handle this with two strategies.

```python
# Strategy 1: Mock the LLM for deterministic integration tests
@pytest.fixture
def deterministic_llm():
    """A mock LLM that returns predetermined responses."""
    responses = {
        "plan": "Step 1: Search. Step 2: Extract. Step 3: Summarize.",
        "extract": '{"facts": ["Fact 1", "Fact 2"]}',
        "summarize": "This is a summary of the key findings.",
    }

    async def mock_generate(prompt: str, **kwargs) -> str:
        for key, response in responses.items():
            if key in prompt.lower():
                return response
        return "Default mock response"

    return mock_generate


# Strategy 2: Statistical testing for non-deterministic chains
@pytest.mark.slow
@pytest.mark.asyncio
async def test_chain_success_rate_with_real_llm():
    """Statistical test: chain should succeed >= 80% of the time."""
    successes = 0
    n_trials = 20

    for _ in range(n_trials):
        try:
            result = await chain.execute({"query": "What is photosynthesis?"})
            if result.status == "success":
                successes += 1
        except Exception:
            pass

    success_rate = successes / n_trials
    assert success_rate >= 0.80, f"Success rate {success_rate:.0%} below 80% threshold"
```

## Why It Matters

### Catching Interface Mismatches

The most common integration bugs are at the boundaries between skills: a skill returns a list where the next skill expects a dict, a skill returns raw text where the next expects parsed JSON, or a skill returns null where the next assumes non-null. These bugs are invisible to unit tests because each skill works correctly in isolation. Integration tests expose them.

### Validating Recovery Paths

Error recovery paths (retries, fallbacks, partial results) involve multiple components working together. A unit test can verify that a skill throws the right exception; only an integration test can verify that the chain catches it, triggers a fallback, and still produces a useful result.

## Key Technical Details

- Integration tests should make up 20–30% of the agent's test suite
- Use recorded fixtures instead of live API calls for determinism and speed
- Test each branch in conditional logic with separate test cases
- Error propagation tests should verify: which step failed, which steps completed, and what partial data is available
- Mock the LLM for deterministic tests; use statistical assertions for non-deterministic tests
- Keep integration tests under 10 seconds each; a full integration suite under 2 minutes
- Record new fixtures when API contracts change; automate this with a `--record` pytest flag

## Common Misconceptions

**"Integration tests are just bigger unit tests"**: Unit tests and integration tests serve fundamentally different purposes. Unit tests verify that each component implements its contract correctly. Integration tests verify that the contracts between components are compatible. A skill can pass all its unit tests and still fail in integration if its output format does not match the next skill's input expectations.

**"You need to test every possible chain combination"**: Combinatorial explosion makes exhaustive chain testing impractical. Instead, test the most common paths (80% of traffic), the most error-prone paths (those involving conditional logic), and the critical error recovery paths. Prioritize based on production usage patterns and historical failure data.

## Connections to Other Concepts

- `unit-testing-individual-skills.md` — The foundation that integration tests build upon
- `evaluation-with-test-suites.md` — End-to-end evaluation that sits above integration tests
- `regression-testing-for-agents.md` — Running integration tests in CI/CD to catch regressions
- `graceful-degradation.md` — Integration tests verify that degradation paths work correctly
- `error-categories-in-agent-systems.md` — Error types that integration tests should exercise

## Further Reading

- Freeman and Pryce, "Growing Object-Oriented Software, Guided by Tests" (2009) — Foundational work on integration testing and test doubles
- Fowler, "IntegrationTest" (2011) — Distinction between narrow and broad integration tests
- Bernstein et al., "Benchmarking and Evaluating Language Model Agents" (2024) — Modern approaches to evaluating agent pipelines
