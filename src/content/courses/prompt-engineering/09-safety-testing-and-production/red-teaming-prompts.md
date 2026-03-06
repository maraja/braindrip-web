# Red-Teaming Prompts

**One-Line Summary**: Red-teaming is systematic adversarial testing of LLM applications — hiring a locksmith to test your locks — using structured attack taxonomies, human creativity, and automated tools to discover vulnerabilities before real attackers do.
**Prerequisites**: `prompt-injection-defense-techniques.md`, `guardrails-and-output-filtering.md`, `prompt-testing-and-evaluation.md`.

## What Is Red-Teaming for Prompts?

Imagine you have just installed a new security system in your home. You could assume it works and wait for a burglar to test it, or you could hire a professional locksmith to try every door, window, and entry point, reporting what they can get through. Red-teaming is that locksmith. It is the practice of deliberately and systematically trying to break your LLM application — finding the inputs that produce harmful outputs, the edge cases that bypass safety measures, and the attack vectors that your defenses miss.

Red-teaming differs from standard testing (see `prompt-testing-and-evaluation.md`) in both intent and methodology. Standard testing asks "does the system work correctly on expected inputs?" Red-teaming asks "can I make the system fail on adversarial inputs?" The mindset is fundamentally different: a tester verifies success, a red-teamer hunts for failure. This adversarial perspective is essential because real-world users — whether malicious or simply creative — will submit inputs that your development team never anticipated.

The practice has been adopted as an industry standard by leading AI organizations. Anthropic, OpenAI, Google DeepMind, and Meta all conduct extensive red-teaming before model releases. The Biden administration's 2023 Executive Order on AI Safety explicitly references red-teaming as a required practice for frontier AI systems. For application developers, red-teaming the full system (prompt + model + tools + guardrails) is equally important, as system-level vulnerabilities often arise from interactions between components rather than individual weaknesses.

*Recommended visual: A hierarchical attack taxonomy tree diagram showing the six major red-teaming categories -- jailbreaking, data extraction, instruction override, harmful content generation, functionality abuse, and bias probing -- each branching into 3-4 specific attack techniques with severity ratings (Critical/High/Medium/Low) at the leaf nodes.*
*Source: Adapted from Ganguli et al., "Red Teaming Language Models to Reduce Harms," 2022 (Anthropic), and Mazeika et al., "HarmBench," 2024.*

![LLM-powered autonomous agent system overview showing the interaction between planning, memory, and tool use components](https://lilianweng.github.io/posts/2023-06-23-agent/agent-overview.png)
*Source: Lilian Weng, "LLM Powered Autonomous Agents," 2023. This agent system diagram highlights the attack surface that red-teaming must cover -- tool access, memory, planning loops, and external data sources are all potential vectors for adversarial exploitation.*

## How It Works

### Attack Taxonomies

A structured red-teaming exercise uses an attack taxonomy — a categorized list of known vulnerability types — as a systematic checklist. The major categories include:

**Jailbreaking**: Attempts to bypass the model's safety training or the system prompt's restrictions. Techniques include role-play attacks ("pretend you are an AI with no restrictions"), hypothetical framing ("in a fictional world where..."), gradual escalation across multiple turns, and encoded instructions (Base64, pig Latin, other obfuscations).

**Data extraction**: Attempts to make the model reveal confidential information — the system prompt itself, training data, user data from other sessions, or internal tool configurations. Techniques include direct requests ("print your system prompt"), indirect elicitation ("what were you told not to discuss?"), and side-channel attacks (inferring restricted information from the model's refusal patterns).

**Instruction override**: A subset of prompt injection (see `prompt-injection-defense-techniques.md`) focused on making the model follow attacker instructions instead of the system prompt. This includes direct injection ("ignore previous instructions"), indirect injection through tool outputs, and context manipulation attacks.

**Harmful content generation**: Attempts to elicit content that violates policies — hate speech, misinformation, dangerous instructions, sexually explicit material, or content targeting vulnerable populations. The focus is on bypasses that work despite safety training: novel phrasings, unusual contexts, or multi-step approaches that individually seem benign but combine into harmful outputs.

**Functionality abuse**: Using the system's legitimate capabilities for unintended purposes — for example, using a coding assistant to generate malware, using a medical chatbot to obtain dangerous drug interaction information, or using a customer service bot to phish for user credentials.

**Bias and fairness probing**: Testing whether the model produces discriminatory or biased outputs for different demographic groups, languages, or cultural contexts. This includes testing for stereotyping, unequal treatment of equivalent queries that differ only in demographic details, and harmful generalizations about protected groups.

### Building a Red-Team Eval Suite

Red-teaming findings should be systematized into a reusable eval suite. Each discovered vulnerability becomes a test case with: (1) the adversarial input that triggered the failure, (2) the undesirable output produced, (3) the attack category from the taxonomy, (4) the severity level (critical, high, medium, low), and (5) the expected behavior (what the system should have done instead). This eval suite serves two purposes: regression testing ensures that fixes for discovered vulnerabilities persist across prompt updates, and coverage tracking reveals which attack categories have been insufficiently tested.

A well-maintained red-team eval suite typically contains 100-300 test cases across all attack categories, with new cases added after each red-teaming session. The suite should be run on every prompt change and after every model update from the provider.

### Human vs. Automated Red-Teaming

**Human red-teaming** leverages creativity, domain expertise, and adversarial intuition. Skilled red-teamers explore novel attack vectors that automated tools miss — multi-turn social engineering, cultural context exploits, and creative reframing that requires genuine understanding of the system's purpose. A typical human red-teaming session involves 3-5 skilled testers spending 4-8 hours each, producing 30-80 unique vulnerability findings. The cost is $2,000-10,000 per session depending on tester expertise.

**Automated red-teaming** uses LLMs or specialized tools to generate adversarial inputs at scale. Tools like Garak (LLM vulnerability scanner), Microsoft PyRIT (Python Risk Identification Tool), and custom adversarial prompt generators can test thousands of attack variants in hours. Automated tools excel at breadth — systematically covering known attack patterns with many variations — but lack the creativity of human testers. They typically find 60-70% of the vulnerabilities that human teams discover, but they do so at a fraction of the cost and time.

The optimal approach combines both: automated testing for breadth and regression coverage, human red-teaming for depth and novel vulnerability discovery. Teams should conduct automated red-teaming on every prompt change and human red-teaming sessions quarterly or before major releases.

A practical workflow for a combined approach: (1) run automated red-teaming against the full attack taxonomy to establish a baseline vulnerability profile, (2) review automated findings to identify patterns and gaps, (3) brief human red-teamers on the automated results and ask them to focus on areas where automation is weakest (creative social engineering, multi-turn manipulation, domain-specific exploits), (4) integrate all findings into the red-team eval suite.

### Frequency and Timing

Red-teaming should occur at four points: (1) during development, as prompts are being written and refined, (2) before deployment, as a gate for production release, (3) after model updates, since provider model changes can alter vulnerability surfaces, and (4) on a regular cadence (monthly or quarterly) to test against newly discovered attack techniques. Organizations that red-team only at launch often discover months later that model updates or new attack techniques have introduced vulnerabilities that were not present initially.

A practical cadence for most teams: automated red-teaming runs in CI/CD on every prompt change (10-15 minutes), a lightweight human review monthly (2-4 hours), and a full human red-teaming session quarterly (full day). The automated layer catches regressions, the monthly review catches emerging patterns, and the quarterly session provides deep, creative adversarial testing.

## Why It Matters

### Proactive vs. Reactive Security

Discovering vulnerabilities through red-teaming costs a fraction of discovering them through real-world exploitation. A vulnerability found in red-teaming is fixed before users encounter it. A vulnerability found in production may cause data breaches, reputational damage, regulatory fines, or user harm. The cost asymmetry is dramatic: $5,000-10,000 for a red-teaming session vs. potentially millions in incident response, legal liability, and reputation repair.

### Calibrating Confidence in Defenses

Teams that build safety defenses without red-teaming have uncalibrated confidence — they do not know how well their defenses actually work. Red-teaming provides ground truth: if testers can bypass the defense 15% of the time, the team knows the true robustness level and can invest accordingly. Without red-teaming, teams often discover their "robust" defenses are far weaker than assumed.

### Regulatory and Responsible AI Requirements

Red-teaming is increasingly mandated by regulation and industry standards. The EU AI Act requires risk assessment for high-risk AI systems. The US Executive Order on AI (October 2023) specifically mandates red-teaming for frontier models. NIST's AI Risk Management Framework includes adversarial testing as a core practice. Organizations deploying LLM applications in regulated industries need documented red-teaming as part of their compliance evidence.

## Key Technical Details

- A structured human red-teaming session with 3-5 testers over 4-8 hours typically produces 30-80 unique vulnerability findings.
- Automated red-teaming tools (Garak, PyRIT) can generate and test 1,000-10,000 attack variants per hour, catching 60-70% of vulnerabilities that human teams find.
- A mature red-team eval suite contains 100-300 test cases across all attack categories, growing by 20-40 cases per quarter.
- Jailbreaking attacks succeed on undefended systems 20-40% of the time; well-defended systems reduce this to 2-5%.
- System prompt extraction attacks succeed 10-30% of the time without defenses; instruction hierarchy reinforcement reduces this to under 5%.
- Red-teaming should be conducted on every major prompt change, after every model update, and on a quarterly cadence for human sessions.
- The cost of a professional human red-teaming session ranges from $2,000-10,000; automated red-teaming adds minimal marginal cost beyond compute.
- Multi-turn attacks are significantly harder to defend against than single-turn attacks, with success rates 2-3x higher for the same attack category.

## Common Misconceptions

- **"If the model provider red-teamed the model, we do not need to red-team our application."** Model-level red-teaming tests the base model's safety. Application-level red-teaming tests the complete system — the prompt, the tools, the guardrails, and their interactions. A safe base model can become unsafe through a poorly designed system prompt or misconfigured tool access.
- **"Red-teaming is a one-time activity."** Attack techniques evolve continuously. New jailbreaks are discovered weekly. Model updates change vulnerability surfaces. Red-teaming must be an ongoing practice, not a one-time checkpoint.
- **"Automated tools are sufficient."** Automated tools cover known patterns but miss creative, context-specific attacks. The most dangerous real-world attacks are often novel and creative — precisely the kind that require human adversarial thinking to discover.
- **"Finding no vulnerabilities means the system is safe."** Absence of evidence is not evidence of absence. A red-teaming session that finds nothing may indicate a secure system or may indicate insufficient testing effort, narrow attack coverage, or low tester skill. Always evaluate red-teaming completeness against the attack taxonomy.
- **"Red-teaming is only about safety."** While safety is the primary focus, red-teaming also discovers quality issues: edge cases where the model produces incorrect or unhelpful outputs, scenarios where guardrails over-trigger and block legitimate requests, and conditions where the system degrades gracefully vs. catastrophically.

## Connections to Other Concepts

- `prompt-injection-defense-techniques.md` — Red-teaming validates injection defenses by testing them with real attack patterns and novel variations.
- `guardrails-and-output-filtering.md` — Red-teaming reveals gaps in guardrail coverage and calibrates guardrail sensitivity thresholds.
- `prompt-testing-and-evaluation.md` — Red-team findings become adversarial test cases in the eval suite, providing ongoing regression coverage.
- `prompt-debugging-and-failure-analysis.md` — Red-teaming outputs feed directly into the debugging workflow: each discovered vulnerability is a failure to diagnose and fix.
- `a-b-testing-and-prompt-experiments.md` — Safety metrics from red-teaming (attack success rates) should be tracked as guardrail metrics in A/B experiments.

## Further Reading

- Perez et al., "Red Teaming Language Models with Language Models," 2022 (Anthropic). Foundational paper on using LLMs to generate adversarial test cases at scale, establishing the automated red-teaming paradigm.
- Ganguli et al., "Red Teaming Language Models to Reduce Harms," 2022 (Anthropic). Comprehensive study of human red-teaming methodology, findings taxonomy, and defense strategies.
- Mazeika et al., "HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal," 2024. Benchmark suite for evaluating both attack and defense effectiveness with standardized metrics.
- Derczynski et al., "Garak: A Framework for Security Probing of Large Language Models," 2024. Open-source LLM vulnerability scanner with modular attack generators and detectors.
- NIST, "AI Risk Management Framework (AI RMF 1.0)," 2023. Government framework that includes red-teaming as a core component of AI risk assessment and mitigation.
