# Side Effect Evaluation

**One-Line Summary**: Measuring the unintended consequences of agent actions -- environmental modifications, resource consumption, information leakage, and collateral changes beyond the scope of the requested task.

**Prerequisites**: `alignment-measurement.md`, `harmful-action-detection-metrics.md`, `../03-automated-evaluation-methods/environment-state-evaluation.md`

## What Is Side Effect Evaluation?

Think of hiring a plumber to fix a leaking faucet. The faucet gets fixed, but in the process the plumber scratches your countertop, leaves muddy footprints on the floor, and accidentally knocks a picture off the wall. The primary task succeeded, but the side effects may cost more to remediate than the original repair. Side effect evaluation for agents applies this same scrutiny: what changed that should not have changed?

Every agent action has potential ripple effects beyond its intended purpose. A coding agent fixing a bug might inadvertently break a passing test. A data analysis agent querying a database might trigger expensive index rebuilds. An email agent drafting a reply might include context from a different conversation thread. These side effects range from negligible to catastrophic, and they are often invisible unless you specifically look for them.

Side effect evaluation formalizes the process of looking. It establishes what the environment looked like before the agent acted, what it looks like after, and whether the differences are limited to what was intended. This is one of the most technically challenging aspects of agent evaluation because it requires defining and measuring "everything that changed" against "everything that should have changed."

## How It Works

### Side Effect Categories

**Environmental side effects** are unintended modifications to the agent's operating environment. For a coding agent: files created, modified, or deleted that were not part of the task. Configuration files changed. Git state altered (unintended commits, branch switches, stash operations). Package dependencies added or removed. For a system administration agent: services started or stopped, user permissions changed, firewall rules modified. These are the most directly measurable side effects because they leave concrete traces in the environment.

**Resource consumption beyond expectations** covers excessive use of compute, storage, network bandwidth, API calls, or financial resources. An agent that makes 500 API calls to complete a task that should require 10 has created a resource side effect. An agent that spawns multiple background processes and does not clean them up leaves resource leakage. An agent that uses a $0.50 frontier model API call when a $0.01 model would suffice has created a cost side effect. The challenge is defining "expected" consumption for each task type.

**Information leakage** occurs when the agent exposes data to unintended recipients. This includes: including sensitive information in log messages, sending context from one user's session in a response to another user, making API calls that transmit private data to third-party services, and writing sensitive data to temporary files that persist after the task completes. Information leakage is particularly dangerous because it is often invisible to the user and may violate privacy regulations.

**Dependency on fragile assumptions** is a subtler category. The agent's solution may work now but depend on conditions that are likely to change -- specific file paths, particular API response formats, time-dependent data, or undocumented behavior. These are not immediate side effects but create future fragility. Evaluating them requires understanding not just what changed but what implicit assumptions the agent's changes rely upon.

### Evaluation Methodology: Comprehensive State Diffing

The gold standard for side effect evaluation is comprehensive state diffing: capturing the complete environment state before and after agent execution, then analyzing the differences.

**Pre-execution snapshot** captures the relevant environment state. For a coding agent, this includes: filesystem contents (file list, sizes, permissions, content hashes), git status and log, running processes, environment variables, network connections, and resource utilization baselines. The snapshot must be comprehensive enough to detect unexpected changes without being so expensive that it dominates evaluation cost.

**Post-execution snapshot** captures the same state dimensions after the agent completes its task. The two snapshots are differenced to produce a complete change set.

**Change classification** categorizes each difference as intended (directly required by the task), expected (reasonable and necessary to accomplish the task, such as creating temporary files), or unexpected (not required by or related to the task). The ratio of unexpected changes to total changes is the side effect rate.

**Recursive analysis** examines second-order effects. A file modification might trigger a CI pipeline. An API call might cause a webhook notification. A database change might invalidate cached data elsewhere. Recursive analysis follows these causal chains to identify downstream side effects that the initial diff might miss.

### The Minimal Footprint Principle

The minimal footprint principle states that an agent should achieve its goals with the smallest possible set of environmental changes. This is the agent equivalent of the least privilege principle applied to actions rather than permissions.

Measuring minimal footprint requires establishing a baseline: what is the minimum set of changes required to accomplish the task? This can be estimated by expert annotation, by observing multiple agents on the same task and identifying the common minimal change set, or by using a reference solution.

The **footprint ratio** compares the agent's actual changes to the minimal required changes. A ratio of 1.0 means perfect minimal footprint. A ratio of 2.0 means the agent made twice as many changes as necessary. Research on coding agents shows typical footprint ratios of 1.3-2.5, meaning agents routinely make 30-150% more changes than necessary.

### Defining Expected vs Unexpected Changes

The fundamental challenge in side effect evaluation is distinguishing expected from unexpected changes. This requires a specification of intended behavior, which is often incomplete or implicit.

**Task-derived expectations** come from the explicit task description. "Fix the login bug" implies changes to authentication-related code and tests. Changes to the payment processing module are unexpected.

**Convention-derived expectations** come from established norms. Creating temporary files is expected if they are cleaned up. Modifying the git history is generally unexpected unless explicitly requested. Installing new dependencies is a gray area that depends on whether the task plausibly requires them.

**Context-derived expectations** come from the broader situation. If the agent is operating in a CI/CD pipeline, modifications to the pipeline configuration are more unexpected than if the agent is specifically tasked with pipeline maintenance.

In practice, evaluation systems use a tiered approach: a narrow set of strictly expected changes (high confidence), a broader set of plausibly expected changes (medium confidence), and everything else classified as unexpected pending review.

### Connection to AI Safety Impact Measures

Side effect evaluation connects directly to the AI safety research on impact measures -- formal methods for quantifying how much an agent changes the world relative to some baseline. The key insight from this research is that measuring side effects requires a counterfactual: what would the world look like if the agent had done nothing? Changes relative to this inaction baseline are the agent's total impact, and the subset of those changes not attributable to the intended task constitutes the side effects.

Attainable utility preservation, one formal framework from the safety literature, measures whether the agent's actions reduce the ability of future agents (or humans) to achieve their goals. An agent that clutters a filesystem with temporary files has reduced the attainability of a clean filesystem. An agent that consumes a rate-limited API quota has reduced the attainability of future API access. This framework provides a principled way to weight different side effects by their impact on future optionality.

## Why It Matters

1. **Side effects accumulate.** A single agent execution with minor side effects is tolerable. Hundreds of executions per day with minor side effects create significant environmental drift, technical debt, and data integrity issues.
2. **Side effects erode trust.** Users who discover that an agent made changes they did not expect lose confidence in delegating tasks, even if the primary task was completed successfully.
3. **Side effects have compliance implications.** Information leakage and unintended data modifications can violate privacy regulations, data retention policies, and audit requirements.
4. **Side effects are the primary cost of over-helpfulness.** As discussed in `alignment-measurement.md`, agents that do more than asked create side effects proportional to their excess activity.
5. **Side effects reveal alignment quality.** An agent with a low side effect rate is demonstrating alignment in action -- it understands the task boundaries and respects them.

## Key Technical Details

- Comprehensive filesystem state diffing for a typical coding agent workspace (10,000 files) takes 2-5 seconds and adds approximately 50MB of snapshot storage per evaluation
- Coding agents produce a footprint ratio of 1.3-2.5x on average, meaning 30-150% more file changes than the minimum required
- Information leakage detection requires monitoring all outbound network traffic and log output, which adds 5-10% overhead to agent execution
- Resource consumption monitoring should track: API calls (count and cost), compute time, memory peak usage, disk I/O, and network bytes transferred
- Side effect rates correlate strongly with task ambiguity -- well-specified tasks produce 40-60% fewer side effects than open-ended ones
- Automated side effect classification achieves approximately 75-85% agreement with human expert classification on the expected/unexpected distinction
- The most common side effects for coding agents are: unintended file modifications (35%), leftover temporary files (25%), unnecessary dependency changes (20%), and git state pollution (15%)

## Common Misconceptions

**"If the task succeeds, side effects do not matter."** Task success is necessary but not sufficient for a good agent execution. An agent that fixes a bug but also introduces a security vulnerability in an unrelated file has succeeded at the task while causing potentially greater harm through side effects.

**"Side effects are always negative."** Some unintended changes are beneficial -- an agent might fix a typo it noticed while working on the main task, or clean up an import it encountered. The evaluation framework should distinguish between harmful, neutral, and beneficial side effects rather than treating all unintended changes as negative.

**"Comprehensive state diffing is too expensive for routine evaluation."** Full state diffing is expensive, but targeted diffing focused on the highest-risk dimensions (filesystem changes, network activity, resource consumption) captures the majority of significant side effects at a fraction of the cost. The diffing strategy should be proportional to the risk level of the deployment.

**"Agents will naturally learn to minimize side effects through RLHF."** RLHF reward models typically evaluate task completion quality, not side effect minimization. Unless the reward explicitly penalizes side effects, agents have no training signal to minimize them. In fact, RLHF often trains agents to be maximally helpful, which directly encourages over-stepping and side effects.

## Connections to Other Concepts

- `alignment-measurement.md` -- over-helpfulness and goal drift are the primary drivers of side effects
- `harmful-action-detection-metrics.md` -- harmful side effects are a category that detection systems must catch
- `sandboxing-effectiveness-evaluation.md` -- sandboxes limit the scope of possible side effects by constraining the agent's environment
- `permission-boundary-testing.md` -- permission boundaries prevent side effects in unauthorized areas
- `../03-automated-evaluation-methods/environment-state-evaluation.md` -- the technical infrastructure for state diffing and change detection
- `../04-trajectory-and-process-analysis/trajectory-quality-metrics.md` -- side effect rates contribute to trajectory quality scores

## Further Reading

- "Penalizing Side Effects in Reinforcement Learning" -- Krakovna et al., 2019
- "Conservative Agency via Attainable Utility Preservation" -- Turner et al., 2020
- "Avoiding Side Effects in Complex Environments" -- Turner et al., 2020
- "Measuring and Mitigating Unintended Agent Behaviors" -- Anthropic Technical Report, 2024
- "Low Impact Artificial Intelligences" -- Armstrong et al., 2017
- "Impact Measures and Side Effects in Agent Evaluation" -- METR, 2025
