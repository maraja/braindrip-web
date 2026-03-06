# Error Recovery Evaluation

**One-Line Summary**: A framework for measuring how effectively agents detect, diagnose, and recover from failures encountered during task execution.

**Prerequisites**: `trajectory-quality-metrics.md`, `process-reward-models.md`

## What Is Error Recovery Evaluation?

Consider two junior developers who both encounter a database connection error during deployment. Developer A stares at the screen, re-runs the same command five times, then gives up. Developer B reads the error message, checks the connection string, discovers a typo, fixes it, and completes the deployment with a three-minute delay. Both encountered the same failure, but their recovery capabilities are vastly different. Error recovery evaluation measures this difference in AI agents.

Error recovery evaluation is a specialized assessment framework that measures an agent's ability to handle failures, unexpected states, and errors that arise during task execution. It decomposes the recovery process into four measurable phases: detection (noticing the error), diagnosis (identifying the cause), strategy selection (choosing a fix), and execution (implementing the fix and resuming progress).

This matters because real-world environments are messy. APIs return unexpected errors, files are missing, permissions are wrong, tools produce malformed output, and assumptions prove incorrect. An agent that can only succeed on the happy path is fragile. Robust agents must handle failures gracefully, and we need metrics to evaluate whether they do.

## How It Works

### Error Detection Rate (EDR)

Error Detection Rate measures how often the agent recognizes that something has gone wrong:

```
EDR = errors_detected / total_errors_occurred
```

Not all errors are obvious. An API might return a 200 status code with an empty body instead of a proper error code. A tool might silently truncate output. A file write might succeed but with incorrect permissions. Strong agents detect both explicit errors (exception messages, non-zero exit codes) and implicit errors (unexpected output format, missing expected data, logical inconsistencies in results).

Typical EDR values: explicit errors 90-98%, implicit errors 40-65%. The gap represents a major vulnerability: agents that only catch obvious failures miss nearly half of all problems.

### Diagnosis Quality (DQ)

Once an error is detected, Diagnosis Quality evaluates whether the agent correctly identifies the root cause. This is scored on a rubric:

- **Score 3 (Correct)**: Agent identifies the actual root cause. Example: "The API returned a 403 because the authentication token expired."
- **Score 2 (Partial)**: Agent identifies the general area but not the specific cause. Example: "There's an authentication issue" without identifying the expired token.
- **Score 1 (Incorrect)**: Agent misidentifies the cause. Example: "The API endpoint URL is wrong" when the URL is correct but the token expired.
- **Score 0 (No diagnosis)**: Agent does not attempt to diagnose, simply retries or moves on.

```
DQ = Σ diagnosis_scores / (3 × total_diagnosed_errors)
```

Normalized to [0, 1], where 1.0 indicates perfect diagnosis across all errors.

### Recovery Strategy Appropriateness (RSA)

Recovery Strategy Appropriateness measures whether the agent's chosen recovery action matches the diagnosed problem:

- **Appropriate**: The strategy directly addresses the root cause (refreshing an expired token for a 403 error)
- **Partially appropriate**: The strategy may work but is suboptimal (retrying with exponential backoff for a permanent configuration error)
- **Inappropriate**: The strategy does not address the problem (clearing cache for an authentication error)

```
RSA = (appropriate × 1.0 + partial × 0.5) / total_recovery_attempts
```

### Recovery Time (RT)

Recovery Time measures the additional steps required to return to productive progress after an error:

```
RT = steps_from_error_to_resumed_progress
```

"Resumed progress" means the agent is again making forward advancement toward the goal, not merely past the error. Lower RT is better. Agents with good diagnosis (DQ > 0.8) typically recover in 2-4 steps, while poor diagnosers may take 8-15 steps or never fully recover.

### Deliberate Error Injection

The most rigorous approach to error recovery evaluation is deliberate error injection, where the evaluator programmatically introduces failures at controlled points:

**Environmental injection**: Modify the task environment to trigger errors. Examples: revoke API permissions mid-task, corrupt a file the agent needs, introduce a network timeout, change a database schema after the agent has read it.

**Tool-level injection**: Modify tool responses to return errors. Examples: make a search tool return empty results for valid queries, have a code execution tool report a syntax error for correct code, return rate-limit errors after N calls.

**State corruption**: Alter the environment state in ways the agent's model doesn't expect. Examples: delete a file the agent just created, modify a variable's value between agent steps, change the working directory.

A standard error injection protocol includes 5-10 error types injected at early, middle, and late trajectory positions, with each combination tested across 10+ tasks. This yields 150-300+ evaluation scenarios per error injection campaign.

### Failure Spirals vs. Graceful Degradation

A critical qualitative distinction is between agents that **fail gracefully** and those that **spiral**:

- **Graceful failure**: Agent detects error, attempts reasonable recovery, and if recovery fails, clearly communicates what went wrong and what partial progress was achieved
- **Failure spiral**: Agent's recovery attempt creates new errors, which trigger further recovery attempts, each compounding the problem. Spirals are identified by exponentially increasing error rates: more than 3 consecutive errors with no intervening progress

Spiral rate (fraction of error encounters that lead to spirals) is one of the most important safety-relevant metrics for deployed agents.

## Why It Matters

1. **Real-world reliability**: Production environments have 5-15% error rates on external API calls alone. An agent that cannot recover from common failures will fail on a significant fraction of real tasks regardless of its reasoning quality.
2. **Cost containment**: Poor error recovery leads to wasted computation. An agent that spirals for 30 steps on a recoverable error consumes 3-10x the resources of one that recovers in 3 steps.
3. **Safety-critical behavior**: In high-stakes domains, how an agent fails matters as much as how it succeeds. Graceful degradation with clear communication is essential for maintaining human trust and oversight.
4. **Differentiation of capable agents**: On standard benchmarks, top agents often have similar success rates on clean tasks. Error recovery capabilities differentiate agents that appear similar on happy-path evaluations.

## Key Technical Details

- Error injection should cover at least 5 error categories: network/API errors, permission/auth errors, data format errors, resource exhaustion, and logical/state errors
- Inject errors at 3+ trajectory positions (early: steps 1-3, mid: steps 4-7, late: steps 8+) as recovery difficulty varies by position
- Baseline error detection rate for GPT-4-class agents on explicit errors: 92-97%; on implicit errors: 45-62%
- Diagnosis quality correlates strongly with recovery success: agents with DQ > 0.7 successfully recover 75%+ of the time; agents with DQ < 0.4 recover less than 30%
- Spiral rate across current frontier agents: 8-15% of error encounters on complex tasks
- Recovery time distribution is typically bimodal: agents either recover quickly (2-4 steps) or not at all (>15 steps leading to spiral or abandonment)
- Error injection evaluation requires environment instrumentation; budget 2-4 engineering days for a new domain setup

## Common Misconceptions

**"Agents that never encounter errors don't need error recovery."** Every agent eventually encounters errors in production. Evaluating only on clean tasks gives a misleadingly optimistic view of real-world performance. Error recovery evaluation should be mandatory for any agent intended for deployment.

**"Retry logic is sufficient error recovery."** Simple retries handle transient failures (network blips, rate limits) but are counterproductive for persistent errors (wrong credentials, missing files, logical errors). Agents need diagnostic capability to distinguish transient from persistent failures.

**"Error recovery and task success are the same thing."** An agent can succeed on a task despite poor error recovery (if errors are minor) or fail despite excellent recovery (if the task is impossible). Error recovery metrics are orthogonal to outcome metrics and capture a distinct capability.

**"More error handling code means better error recovery."** Programmatic error handlers (try-catch blocks, fallback routes) are static and cover only anticipated failure modes. True error recovery in agents requires dynamic reasoning about unexpected failures, which is a fundamentally different capability.

## Connections to Other Concepts

- `trajectory-quality-metrics.md` provides the Backtrack Rate metric, which partially captures recovery behavior but misses the detection and diagnosis phases
- `process-reward-models.md` can be trained to score recovery steps, learning to distinguish effective recovery actions from flailing
- `planning-quality-assessment.md` evaluates Plan Robustness, which is the pre-execution counterpart to runtime error recovery
- `tool-use-correctness.md` covers tool-level error handling as a subset of the broader error recovery framework
- `specification-gaming-detection.md` addresses cases where agents "recover" from errors through unintended shortcuts

## Further Reading

- "On the Resilience of AI Agents: Evaluating Error Recovery in Autonomous Systems" -- Chen et al., 2024
- "ToolEmu: Identifying the Risks of LM Agents with an LM-Emulated Sandbox" -- Ruan et al., 2024
- "Reflexion: Language Agents with Verbal Reinforcement Learning" -- Shinn et al., 2023
- "Can LLMs Learn from Previous Mistakes? Investigating LLMs' Errors to Boost for Reasoning" -- Tong et al., 2024
- "Agent Hospital: A Simulacrum of Hospital with Evolvable Medical Agents" -- Li et al., 2024
