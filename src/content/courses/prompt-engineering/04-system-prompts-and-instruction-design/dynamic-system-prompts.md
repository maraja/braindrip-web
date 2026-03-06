# Dynamic System Prompts

**One-Line Summary**: Dynamic system prompts are assembled at runtime from modular components -- including user roles, feature flags, time-sensitive context, and personalization slots -- enabling applications to customize LLM behavior for each user and situation.
**Prerequisites**: `04-system-prompts-and-instruction-design/system-prompt-anatomy.md`, `04-system-prompts-and-instruction-design/behavioral-constraints-and-rules.md`

## What Is a Dynamic System Prompt?

Think of a modern smart TV that adjusts its settings based on who is watching. When a child logs in, parental controls activate, the interface simplifies, and educational content is prioritized. When an adult logs in, the full content library unlocks, advanced settings appear, and recommendations shift. The TV uses the same hardware and software -- it just configures itself differently based on context. Dynamic system prompts work the same way: instead of using a single static system prompt for every user and situation, the prompt is assembled at runtime from modular components that are selected, configured, and combined based on the current user, their permissions, the time of day, active feature flags, and other contextual signals.

Static system prompts treat every user and situation identically. This works for simple applications but fails at scale. A customer service application needs different instructions for free-tier users versus enterprise customers. A coding assistant needs different constraints for junior developers versus senior architects. A content generation tool needs different tone and style for different brands. Dynamic system prompts solve this by making the system prompt a function of context rather than a fixed string.

The transition from static to dynamic system prompts is a maturity milestone for LLM applications. It enables personalization, access control, gradual feature rollouts, and A/B testing -- capabilities that are standard in traditional software engineering but surprisingly rare in LLM applications.

*Recommended visual: An architecture diagram showing a central "Template Engine" box with multiple input streams (User Role DB, Feature Flag Service, Time/Context Service, Personalization Store) feeding into modular prompt blocks (ROLE_BLOCK, CONTEXT_BLOCK, PERMISSIONS_BLOCK, FEATURE_FLAGS_BLOCK) that are assembled into a final system prompt output.*
*Source: Adapted from Khattab et al., "DSPy" (2023) and Shanahan et al., "Role Play with Large Language Models" (2023)*

*Recommended visual: A side-by-side comparison showing a static system prompt (identical for all users, single block of text) versus a dynamic system prompt (color-coded modular blocks selected per user type: admin vs. regular user vs. free-tier), with arrows showing which blocks are included or excluded based on runtime conditions.*
*Source: Adapted from Anthropic, "Prompt Caching with Claude" (2024)*

## How It Works

### Template-Based Assembly

The most common architecture uses a template with placeholder slots that are filled at runtime. A template might look like:

```
[ROLE_BLOCK]
[CONTEXT_BLOCK]
[PERMISSIONS_BLOCK]
[FEATURE_FLAGS_BLOCK]
[PERSONALIZATION_BLOCK]
[OUTPUT_FORMAT_BLOCK]
```

Each block is a self-contained module maintained independently. At runtime, the application selects the appropriate version of each block based on context and assembles them into a complete system prompt. This modular approach means that changing the role definition for enterprise users does not require touching the output format block, and vice versa.

### User Role-Based Instructions

Different users may have different permissions, different interfaces, and different needs. A dynamic system prompt injects role-specific blocks based on the authenticated user.

An admin might receive: "You can help with system configuration, user management, and data exports." A regular user might receive: "You can help with searching, viewing, and basic editing. For admin tasks, suggest the user contact their administrator."

This ensures the LLM's capabilities match the user's authorization level, preventing the model from offering actions the user cannot actually perform.

### Feature Flags and A/B Testing

Dynamic system prompts integrate naturally with feature flag systems. A new prompt strategy can be deployed behind a feature flag, activated for a small percentage of users, and measured against the existing prompt. For example, a new constraint phrasing can be tested with 5% of traffic while the original serves 95%. Metrics (user satisfaction, task completion, constraint violations) are compared, and the better prompt is gradually rolled out. This is standard A/B testing methodology applied to prompt engineering.

### Time-Sensitive and Contextual Injection

Some system prompt content needs to change based on external context: the current date (for recency-aware responses), active promotions (for sales chatbots), system status (for support bots during outages), or regulatory updates (for compliance-sensitive applications). Dynamic injection allows these ephemeral contexts to be included in the system prompt without manual prompt editing. A support bot during an outage might receive: "ALERT: Our payment processing system is currently experiencing intermittent failures. If users report payment issues, acknowledge the known issue and provide estimated resolution time of 2 hours."

## Why It Matters

### Personalization at Scale

Static prompts create a one-size-fits-all experience. Dynamic prompts enable per-user customization without maintaining separate prompt files for each user type. A single template with role-based blocks can serve hundreds of user segments, each receiving a tailored experience.

### Safe Feature Rollouts

Prompt changes in production can have unexpected consequences. Dynamic prompts with feature flags allow gradual rollouts with real-time monitoring. If a new prompt version increases error rates, it can be rolled back instantly by toggling the flag -- without a code deployment, without downtime, and without affecting users not in the test group.

### Operational Agility

When a crisis occurs (system outage, security incident, regulatory change), dynamic prompts allow immediate injection of new instructions without code changes. The operations team updates a configuration, and the next user interaction receives the updated instructions. This agility is critical for applications that must respond quickly to changing conditions.

### Progressive Capability Rollout

Dynamic prompts enable progressive rollout of new capabilities. A new tool instruction can be added for 5% of users, monitored for issues, expanded to 25%, and eventually deployed to all users -- all through configuration changes rather than code deployments. This reduces the blast radius of prompt-related issues and enables data-driven decisions about new features.

## Key Technical Details

- **Template slot count**: Most production dynamic prompts use 4-8 modular slots. More than 10 slots increases assembly complexity without proportional benefit.
- **Assembly latency**: Template assembly adds 1-5ms to request processing, negligible compared to LLM inference time.
- **Token budget management**: Dynamic assembly must track total token count to ensure the assembled prompt stays within budget (10-20% of context window). Blocks should have maximum token limits.
- **Cache invalidation**: Dynamic prompts may reduce API-level prompt caching effectiveness since different users receive different prompts. Providers with prefix caching (Anthropic) benefit when the static portion of the template is at the beginning.
- **A/B testing sample size**: Reliable prompt A/B tests require at least 500-1,000 conversations per variant to achieve statistical significance on most metrics.
- **Rollback time**: Feature-flag-based rollback is effectively instant (the next request uses the old prompt), while code-deployed prompt changes require a full deployment cycle (minutes to hours).
- **Version tracking**: Each assembled prompt should log its component versions for debugging and analysis. A prompt ID like "role_v3_context_v7_features_v2" enables tracing behavior to specific component versions.

## Common Misconceptions

- **"Dynamic prompts are just string concatenation."** While the assembly is technically string concatenation, the design requires careful attention to component ordering, token budgets, cross-component consistency, and interaction effects. Two blocks that work well independently can conflict when combined.

- **"You need a complex framework for dynamic prompts."** A basic implementation can be as simple as a dictionary of prompt blocks and a function that selects and concatenates them. Start simple and add complexity (caching, A/B testing, monitoring) as needed.

- **"Dynamic prompts eliminate the need for prompt versioning."** Dynamic assembly adds a new dimension to versioning: you now need to version both individual components and the assembly logic. A prompt that works with role_v2 + context_v3 might fail with role_v2 + context_v4 due to interaction effects.

- **"More personalization is always better."** Over-personalization can lead to excessive prompt complexity, harder debugging, and inconsistent behavior across user segments. Personalize where it matters (permissions, critical context) and standardize where it does not (output format, base constraints).

- **"Feature flags make prompt testing easy."** Feature flags enable A/B testing, but the testing itself requires careful metric design, sufficient sample sizes (500-1,000+ conversations per variant), and attention to confounding variables (user mix, time of day, conversation complexity).

## Connections to Other Concepts

- `04-system-prompts-and-instruction-design/system-prompt-anatomy.md` -- Dynamic prompts are modular implementations of the six-component anatomy, with each component becoming an independently selectable block.
- `04-system-prompts-and-instruction-design/multi-turn-instruction-persistence.md` -- Dynamic prompts can implement persistence by re-assembling and re-injecting key instructions at intervals during long conversations.
- `04-system-prompts-and-instruction-design/prompt-versioning-and-management.md` -- Dynamic prompts add complexity to versioning since both components and assembly logic must be tracked.
- `04-system-prompts-and-instruction-design/instruction-hierarchy-design.md` -- Dynamic assembly must maintain hierarchy integrity; user-role-specific blocks should not override core safety constraints.
- `04-system-prompts-and-instruction-design/behavioral-constraints-and-rules.md` -- Some constraint blocks are static (applied to all users) while others are dynamic (role-specific permissions and boundaries).

## Further Reading

- Anthropic. (2024). "Prompt Caching with Claude." Anthropic Documentation. Explains how prompt caching interacts with dynamic prompts and strategies for maximizing cache hit rates with variable prompt components.
- Shanahan, M., McDonell, K., & Reynolds, L. (2023). "Role Play with Large Language Models." Nature. Explores how role-based prompt variation affects model behavior, providing theoretical grounding for role-based dynamic prompts.
- Madaan, A., Tandon, N., Gupta, P., et al. (2023). "Self-Refine: Iterative Refinement with Self-Feedback." While focused on refinement, demonstrates modular prompt composition patterns applicable to dynamic assembly.
- Khattab, O., Santhanam, K., Li, X. D., et al. (2023). "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines." Introduces programmatic prompt construction, relevant to the engineering of dynamic prompt assembly systems.
