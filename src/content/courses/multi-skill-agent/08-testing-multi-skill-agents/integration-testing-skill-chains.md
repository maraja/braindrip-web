# Integration Testing Skill Chains

**One-Line Summary**: How to test that agent skills work correctly together by validating data flow between steps, conditional branching logic, and error propagation across multi-skill chains.

**Prerequisites**: `unit-testing-individual-skills.md`, familiarity with pytest fixtures and recording patterns

## What Is Integration Testing for Skill Chains?

Unit tests verify that each instrument is in tune; integration tests verify that the musicians can play together. A flute might be perfectly in tune and a piano might be perfectly in tune, but if they are playing in different keys, the result is cacophony. Integration testing for skill chains verifies that the output of one skill is correctly consumed by the next, that branching decisions based on intermediate results are correct, and that errors in one skill propagate appropriately to the rest of the chain.

In a multi-skill agent, a typical task involves chaining 3-10 skill calls: search the web, extract key facts, query a database, compare results, generate a summary. Each transition between skills is a potential failure point. The search might return results in a format the extraction step does not expect. The database query might return null where the comparison step expects a number.

Integration tests sit in the middle of the testing pyramid. They are slower than unit tests (1-10 seconds vs milliseconds) but faster and cheaper than full end-to-end evaluations. They typically mock the LLM for determinism but use real skill functions with recorded API responses.

## How It Works

### Testing Data Flow Between Skills

The most common integration test pattern verifies that the output of skill A can be successfully processed by skill B.

```python
import pytest
from agent.skills.web_search import SearchResult
from agent.skills.text_extractor import extract_key_facts
from agent.skills.summarizer import generate_summary

@pytest.fixture
def recorded_search_results():
    return [
        SearchResult(title="Climate Change Effects on Agriculture",
                     url="https://example.com/climate",
                     snippet="Yields projected to drop 10-25% by 2050."),
        SearchResult(title="Agricultural Adaptation Strategies",
                     url="https://example.com/adaptation",
                     snippet="Drought-resistant crops offset 40-60% of losses."),
    ]

@pytest.mark.asyncio
async def test_search_to_extraction(recorded_search_results):
    facts = await extract_key_facts(recorded_search_results)
    assert len(facts) > 0
    for fact in facts:
        assert hasattr(fact, "text")
        assert fact.source_url in [r.url for r in recorded_search_results]

@pytest.mark.asyncio
async def test_extraction_to_summary(recorded_search_results):
    facts = await extract_key_facts(recorded_search_results)
    summary = await generate_summary(facts=facts, task="Summarize climate impact")
    assert isinstance(summary, str)
    assert 50 < len(summary) < 5000
```

### Testing a 3-Step Chain with Recorded Fixtures

Record real API responses once, then replay them for deterministic, fast integration testing.

```python
import json
from pathlib import Path
from unittest.mock import patch, MagicMock

FIXTURES_DIR = Path(__file__).parent / "fixtures"

class FixtureReplayClient:
    """HTTP client that replays recorded responses in order."""
    def __init__(self, fixture_set: str):
        with open(FIXTURES_DIR / f"{fixture_set}.json") as f:
            self.fixtures = json.load(f)
        self._call_index = 0

    async def get(self, url: str, **kwargs) -> MagicMock:
        key = f"call_{self._call_index}"
        self._call_index += 1
        recorded = self.fixtures[key]
        response = MagicMock()
        response.status_code = recorded["status_code"]
        response.json.return_value = recorded["body"]
        return response

@pytest.mark.asyncio
async def test_three_step_chain_with_fixtures():
    client = FixtureReplayClient("research_chain_fixtures")
    with patch("agent.skills.web_search.httpx.AsyncClient", return_value=client):
        search_results = await search_web("climate change agriculture")
        assert len(search_results) >= 2
        facts = await extract_key_facts(search_results)
        assert len(facts) >= 3
        assert all(hasattr(f, "text") for f in facts)
```

### Testing Conditional Branching Logic

Agents often choose different skill sequences based on intermediate results. Test each branch.

```python
@pytest.mark.asyncio
async def test_branching_on_result_count():
    many_results = [SearchResult(title=f"R{i}", url=f"https://ex.com/{i}",
                                  snippet=f"Content {i}") for i in range(20)]
    assert await choose_next_skill("research", many_results) == "filter_and_rank"

    no_results = []
    assert await choose_next_skill("research", no_results) == "llm_knowledge_fallback"

@pytest.mark.asyncio
async def test_branching_on_data_type():
    csv_data = {"format": "csv", "rows": 1000}
    assert await route_data_processing(csv_data) == "pandas_analyzer"
    text_data = {"format": "text", "length": 5000}
    assert await route_data_processing(text_data) == "text_extractor"
```

### Testing Error Propagation

Verify that errors in one skill are correctly handled -- not swallowed, not causing crashes.

```python
@pytest.mark.asyncio
async def test_error_propagation_in_chain():
    from agent.chain import SkillChain
    from agent.errors import ToolExecutionError, ChainError

    chain = SkillChain(steps=["search", "extract", "summarize"])
    with patch("agent.skills.text_extractor.extract_key_facts") as mock:
        mock.side_effect = ToolExecutionError(
            tool_name="extract_key_facts", status_code=500,
            message="Service unavailable", retryable=True)

        with pytest.raises(ChainError) as exc_info:
            await chain.execute({"query": "test"})
        assert exc_info.value.failed_step == "extract"
        assert exc_info.value.completed_steps == ["search"]
```

### Deterministic vs Non-Deterministic Testing

```python
# Strategy 1: Mock the LLM for deterministic tests
@pytest.fixture
def deterministic_llm():
    responses = {"extract": '{"facts": ["Fact 1"]}', "summarize": "A summary."}
    async def mock_generate(prompt: str, **kwargs) -> str:
        for key, resp in responses.items():
            if key in prompt.lower():
                return resp
        return "Default response"
    return mock_generate

# Strategy 2: Statistical testing for non-deterministic chains
@pytest.mark.slow
@pytest.mark.asyncio
async def test_chain_success_rate():
    successes = sum(1 for _ in range(20)
                    if (await chain.execute({"query": "What is photosynthesis?"})).status == "success")
    assert successes / 20 >= 0.80
```

## Why It Matters

### Catching Interface Mismatches

The most common integration bugs are at boundaries between skills: a skill returns a list where the next expects a dict, or returns raw text where parsed JSON is expected. These bugs are invisible to unit tests because each skill works correctly in isolation.

### Validating Recovery Paths

Error recovery paths (retries, fallbacks, partial results) involve multiple components. Only an integration test can verify that the chain catches an exception, triggers a fallback, and still produces a useful result.

## Key Technical Details

- Integration tests should make up 20-30% of the agent's test suite
- Use recorded fixtures instead of live API calls for determinism and speed
- Test each branch in conditional logic with separate test cases
- Error propagation tests should verify: which step failed, which completed, what partial data exists
- Mock the LLM for deterministic tests; use statistical assertions for non-deterministic tests
- Keep integration tests under 10 seconds each; full suite under 2 minutes

## Common Misconceptions

**"Integration tests are just bigger unit tests"**: Unit tests verify that each component implements its contract. Integration tests verify that contracts between components are compatible. A skill can pass all unit tests and still fail in integration if its output format does not match the next skill's input expectations.

**"You need to test every possible chain combination"**: Combinatorial explosion makes exhaustive testing impractical. Test the most common paths, the most error-prone paths, and critical recovery paths. Prioritize based on production usage patterns.

## Connections to Other Concepts

- `unit-testing-individual-skills.md` -- The foundation that integration tests build upon
- `evaluation-with-test-suites.md` -- End-to-end evaluation that sits above integration tests
- `regression-testing-for-agents.md` -- Running integration tests in CI/CD to catch regressions

## Further Reading

- Freeman and Pryce, "Growing Object-Oriented Software, Guided by Tests" (2009) -- Foundational work on integration testing and test doubles
- Fowler, "IntegrationTest" (2011) -- Distinction between narrow and broad integration tests
- Bernstein et al., "Benchmarking and Evaluating Language Model Agents" (2024) -- Modern approaches to evaluating agent pipelines
