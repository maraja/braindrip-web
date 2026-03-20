# Input Validation and Type Safety

**One-Line Summary**: Validating tool inputs before execution prevents bad data from cascading through tool chains, turning silent failures into clear error messages the LLM can understand and correct.

**Prerequisites**: `designing-effective-tool-schemas.md`, familiarity with Python type hints

## What Is Input Validation for Agent Skills?

Imagine a pharmacist receiving a prescription. Before dispensing medication, they check that the dosage is within safe ranges, the drug name is spelled correctly, and there are no dangerous interactions with the patient's other medications. They do not trust the prescription blindly. Input validation for agent skills works the same way: before executing a tool, you verify that every input is well-formed, falls within acceptable ranges, and is safe to process.

This matters especially in agent systems because the LLM generates tool inputs probabilistically. Unlike a human user filling out a form with autocomplete and dropdown menus, the LLM might produce a string where an integer is expected, a negative value where only positives make sense, or a file path that attempts directory traversal. These are not malicious attacks. They are the natural consequence of a probabilistic system producing structured outputs. Validation catches these issues at the boundary, before they cause cryptic failures deep in your implementation code.

The validation layer sits between the LLM's tool call request and the actual skill execution. It takes the raw JSON input from the LLM, checks it against a defined contract covering types, ranges, formats, and business constraints, and either passes through valid input or returns a clear error message. That error message goes back to the LLM, which can then self-correct and retry with valid inputs. Without validation, a bad input causes an unhandled exception, a raw stack trace gets returned to the LLM, and the agent flails trying to interpret Python internals it was never designed to read.

## How It Works

### Pydantic Models as the Validation Standard

Pydantic is the standard tool for input validation in Python agent systems. It combines type checking, constraint validation, automatic coercion, and human-readable error messages into a single declarative model:

```python
from pydantic import BaseModel, Field, field_validator, ValidationError
from typing import Optional

class WebSearchInput(BaseModel):
    query: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Search query using specific keywords."
    )
    num_results: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of results to return."
    )
    time_range: Optional[str] = Field(
        default="all",
        pattern="^(day|week|month|year|all)$",
        description="Filter results by recency."
    )

    @field_validator("query")
    @classmethod
    def query_must_have_content(cls, v):
        if not v.strip():
            raise ValueError("Query cannot be empty or whitespace-only")
        return v.strip()
```

Using the model inside a skill:

```python
def execute_web_search(raw_input: dict) -> dict:
    try:
        validated = WebSearchInput(**raw_input)
    except ValidationError as e:
        return {
            "status": "error",
            "message": f"Invalid input: {e.errors()[0]['msg']}",
            "hint": "Check parameter types and constraints.",
        }

    # Safe to use validated.query, validated.num_results, etc.
    results = search_api(validated.query, validated.num_results)
    return {"status": "success", "data": results}
```

When the LLM sends `{"query": "", "num_results": -3}`, Pydantic catches both problems and returns a message like `"Query cannot be empty or whitespace-only"` and `"num_results must be >= 1"`. The LLM reads these messages, understands what went wrong, and retries with corrected values.

### Common Validation Patterns

Here are the patterns you will reach for most often when building agent skills:

**Email format**:

```python
from pydantic import BaseModel, EmailStr, Field

class SendEmailInput(BaseModel):
    to: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    body: str = Field(..., min_length=1, max_length=50000)
```

**URL format**:

```python
from pydantic import BaseModel, HttpUrl, Field

class FetchWebpageInput(BaseModel):
    url: HttpUrl
    timeout_seconds: int = Field(default=10, ge=1, le=60)
```

**File path safety** (preventing directory traversal):

```python
from pathlib import Path
from pydantic import BaseModel, field_validator

ALLOWED_BASE = Path("/workspace")

class ReadFileInput(BaseModel):
    path: str

    @field_validator("path")
    @classmethod
    def validate_path_is_safe(cls, v):
        resolved = Path(v).resolve()
        if not resolved.is_relative_to(ALLOWED_BASE):
            raise ValueError(
                f"Path must be within {ALLOWED_BASE}. Got: {resolved}"
            )
        if ".." in v:
            raise ValueError("Directory traversal (..) is not allowed")
        return str(resolved)
```

**Numeric ranges**:

```python
class ResizeImageInput(BaseModel):
    path: str
    width: int = Field(..., ge=1, le=10000, description="Width in pixels")
    height: int = Field(..., ge=1, le=10000, description="Height in pixels")
    quality: int = Field(default=85, ge=1, le=100, description="JPEG quality")
```

**Enum validation** (restricting to known values):

```python
from enum import Enum

class OutputFormat(str, Enum):
    json = "json"
    csv = "csv"
    markdown = "markdown"

class ExportDataInput(BaseModel):
    data_source: str
    format: OutputFormat = OutputFormat.json
    include_headers: bool = True
```

### How Bad Inputs Cascade Through Tool Chains

Without validation, a single bad input can derail an entire multi-step agent run. Consider this scenario where a research agent searches the web and then fetches a page:

```
Step 1: LLM calls search_web(query="latest AI research")
        -> Returns 5 results (success)

Step 2: LLM calls fetch_webpage(url="not-a-valid-url")
        -> No validation: requests.get() throws MissingSchema exception
        -> Raw traceback returned to LLM
        -> LLM confused by Python internals, tries unrelated approach

Step 3: Agent goes off-track, wastes 5+ iterations trying to recover
```

With validation the same scenario resolves in one extra call:

```
Step 2: LLM calls fetch_webpage(url="not-a-valid-url")
        -> Validation catches it immediately
        -> Returns: "Invalid URL: must start with http:// or https://"
        -> LLM retries: fetch_webpage(url="https://arxiv.org/abs/2401.1234")
        -> Success, agent continues on track
```

The validated version costs one extra iteration. The unvalidated version costs five or more iterations and might not recover at all. Multiply this across every tool call in a complex agent run, and validation pays for itself many times over.

### JSON Schema Validation as a Lightweight Alternative

If Pydantic feels heavy or you want minimal dependencies, you can validate against JSON Schema directly using the `jsonschema` library:

```python
import jsonschema

SEARCH_SCHEMA = {
    "type": "object",
    "properties": {
        "query": {"type": "string", "minLength": 1, "maxLength": 500},
        "num_results": {"type": "integer", "minimum": 1, "maximum": 20},
    },
    "required": ["query"],
}

def validate_input(raw_input: dict, schema: dict) -> tuple[bool, str]:
    try:
        jsonschema.validate(raw_input, schema)
        return True, ""
    except jsonschema.ValidationError as e:
        return False, e.message
```

This gives you type checking and basic constraint validation without Pydantic. It lacks custom validators and automatic coercion, but it works well for simpler skills.

### Runtime Type Checking with a Validation Decorator

For cleaner code across many skills, wrap validation into a reusable decorator:

```python
from functools import wraps
from pydantic import BaseModel, ValidationError

def validate_input(input_model: type[BaseModel]):
    """Decorator that validates tool inputs against a Pydantic model."""
    def decorator(func):
        @wraps(func)
        def wrapper(raw_input: dict) -> dict:
            try:
                validated = input_model(**raw_input)
            except ValidationError as e:
                errors = "; ".join(
                    f"{err['loc'][0]}: {err['msg']}"
                    for err in e.errors()
                )
                return {
                    "status": "error",
                    "message": f"Invalid input: {errors}",
                }
            return func(validated)
        return wrapper
    return decorator

# Usage — validation is now a single line
@validate_input(WebSearchInput)
def web_search(params: WebSearchInput) -> dict:
    results = search_api(params.query, params.num_results)
    return {"status": "success", "data": results}
```

Now every skill gets consistent validation, consistent error formatting, and a clean separation between validation logic and business logic.

## Why It Matters

### LLMs Are Probabilistic, Not Precise

LLMs generate tool inputs token by token. They usually get types and formats right, but "usually" is not "always." A field that should be an integer might arrive as the string `"5"`. A URL might be missing its scheme. An enum value might have wrong capitalization. A required field might be omitted entirely. Validation bridges the gap between "usually correct" and "always correct," handling the 5-10% of calls where the LLM produces slightly malformed inputs.

### Clear Errors Enable Self-Correction

The single most important benefit of validation is that it gives the LLM actionable feedback. A validation error that says `"num_results must be between 1 and 20, got -1"` is immediately actionable. A Python traceback from deep inside a search library is not. When the LLM receives a clear error message, it self-corrects on the next attempt in the vast majority of cases. When it receives a stack trace, it often guesses wrong about what happened and makes the situation worse.

## Key Technical Details

- Pydantic v2 validation runs in approximately 0.1ms for typical tool inputs, negligible compared to LLM latency of 500-2000ms
- Always return error messages in natural language, never raw exception objects or tracebacks
- Validate at the skill boundary, not deep inside the implementation, to maintain separation of concerns
- Coerce compatible types when safe (string `"5"` to integer `5`) rather than rejecting valid intent
- File path validation must always resolve symlinks and check against an allowed base directory
- Set reasonable maximum lengths on all string inputs to prevent context window abuse
- Validation errors should suggest the correct format: `"Expected ISO date (YYYY-MM-DD), got '03/15/2025'"`

## Common Misconceptions

**"The JSON Schema in the tool definition is enough validation"**: The JSON Schema sent to the LLM is advisory. It tells the LLM what to generate but does not enforce anything at runtime. The LLM can still produce inputs that violate the schema. Runtime validation using Pydantic or jsonschema is the actual enforcement layer. You need both: the schema for guidance, and runtime validation for enforcement.

**"Validation errors mean the agent is broken"**: Validation errors are a normal, expected part of agent operation. They are the mechanism by which the agent self-corrects. A well-designed agent encounters validation errors on roughly 5-10% of tool calls and recovers gracefully from nearly all of them. If you never see validation errors, your constraints might be too loose.

## Connections to Other Concepts

- `designing-effective-tool-schemas.md` — Schemas guide the LLM on what to generate; validation enforces correctness at runtime
- `output-contracts.md` — The output side of the validation story, ensuring consistent return formats
- `the-skill-abstraction.md` — Validation is part of the skill's interface contract
- `building-action-skills.md` — Action skills need especially strict validation because they cause side effects

## Further Reading

- Pydantic Documentation, "Validators" (2024) — Complete guide to Pydantic field and model validators
- JSON Schema Specification, "Validation Keywords" (2024) — The underlying validation standard used by tool schemas
- Anthropic, "Handling Tool Errors" (2024) — Best practices for returning errors that Claude can recover from
- Postel's Law, "Be conservative in what you send, liberal in what you accept" (1980) — The robustness principle that underlies good input validation design
