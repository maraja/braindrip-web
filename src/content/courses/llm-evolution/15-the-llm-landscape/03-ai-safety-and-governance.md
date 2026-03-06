# AI Safety and Governance

**One-Line Summary**: The rapid scaling of LLM capabilities from 2023 to 2025 outpaced governance frameworks, producing a patchwork of legislation (EU AI Act), voluntary commitments (Responsible Scaling Policies), and technical safety measures (red-teaming, model evaluations) that reflect deep disagreements about how to balance innovation with risk.

**Prerequisites**: `02-chatgpt.md`, `03-constitutional-ai.md`

## What Is AI Safety and Governance?

Imagine a new technology that can write convincing text, generate realistic images, write functional code, and increasingly act autonomously in the world. It is adopted by hundreds of millions of people in under two years. It is deployed in healthcare, education, finance, law, and defense. It can be used to create misinformation, generate malware, and assist in harmful activities. And no one is entirely sure how it works internally, how capable the next version will be, or what happens when it makes mistakes.

This is not a hypothetical — it is the reality that AI safety and governance frameworks have been racing to address since ChatGPT's launch in November 2022. The challenge is unique in the history of technology regulation: the capability is advancing faster than understanding, the risks span from mundane (bias, errors) to existential (autonomous systems pursuing misaligned goals), and the technology is global while governance is fragmented by national borders.

AI safety and governance encompasses three overlapping domains: technical safety (how to make models behave reliably), corporate responsibility (how companies self-regulate), and government regulation (how states create binding rules). Each domain has its own logic, limitations, and tensions.

## How It Works

**AI Safety and Governance -- The Three Domains:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Safety & Governance                        │
├─────────────────────┬──────────────────┬────────────────────────┤
│  Technical Safety   │ Corporate Self-  │ Government             │
│                     │ Regulation       │ Regulation             │
│  ┌───────────────┐  │  ┌────────────┐  │  ┌────────────────┐   │
│  │ Red-Teaming   │  │  │ Anthropic  │  │  │ EU AI Act      │   │
│  │ (adversarial  │  │  │ ASL Levels │  │  │ (risk-based    │   │
│  │  testing)     │  │  │ ASL-1 to 4+│  │  │  classification│   │
│  ├───────────────┤  │  ├────────────┤  │  ├────────────────┤   │
│  │ Model Evals   │  │  │ OpenAI     │  │  │ US Exec Order  │   │
│  │ (CBRN, cyber, │  │  │Preparedness│  │  │ (compute       │   │
│  │  autonomy)    │  │  │ Framework  │  │  │  thresholds)   │   │
│  ├───────────────┤  │  ├────────────┤  │  ├────────────────┤   │
│  │ Constitutional│  │  │ Frontier   │  │  │ China Interim  │   │
│  │ AI / RLAIF    │  │  │ Model Forum│  │  │ Measures       │   │
│  ├───────────────┤  │  │ (industry  │  │  │ (content +     │   │
│  │ Watermarking  │  │  │  coord.)   │  │  │  state control)│   │
│  │ & Provenance  │  │  └────────────┘  │  └────────────────┘   │
│  └───────────────┘  │                  │                        │
├─────────────────────┴──────────────────┴────────────────────────┤
│  Core Tension: Technology advances faster than governance       │
│  GPT-3 ──▶ GPT-4 ──▶ Reasoning ──▶ Agents  (3 years)          │
│  EU AI Act negotiation alone                    (3 years)       │
└─────────────────────────────────────────────────────────────────┘
```

### Government Regulation

**The EU AI Act (2024)** was the world's first comprehensive AI legislation. It classifies AI systems by risk level: unacceptable (banned outright: social scoring, real-time facial recognition in public spaces), high-risk (subject to conformity assessments: healthcare, education, employment), and limited/minimal risk (transparency requirements only). General-purpose AI models — including LLMs — face additional obligations including technical documentation, copyright compliance, and energy consumption reporting. Models posing "systemic risk" (roughly, frontier models) face the most stringent requirements.

The Act is taking effect in a phased timeline. **Prohibited AI practices and AI literacy obligations** became effective on **February 2, 2025** — this was the first binding deadline, banning uses like social scoring and manipulative AI techniques. **General-purpose AI (GPAI) model obligations** — including transparency, documentation, and copyright compliance requirements — became effective on **August 2, 2025**. In July 2025, the European Commission published GPAI guidelines and a Code of Practice as a voluntary compliance tool to help providers meet these obligations. The **European AI Office** was established to oversee GPAI compliance and coordinate enforcement across member states. **Full application of all AI Act provisions**, including high-risk AI system requirements and conformity assessments, is scheduled for **August 2, 2026**.

Implementation has not been seamless. The CEN/CENELEC harmonized standards work — essential for defining how providers demonstrate compliance with the Act's requirements — was delayed and not completed by the August 2025 deadline, creating uncertainty for providers attempting to comply. In November 2025, the Commission published a **Digital Omnibus proposal** to adjust the high-risk AI system timeline, acknowledging that the standards infrastructure needed more time to mature before full enforcement could be practical.

**The US Executive Order on AI Safety (October 2023)** took a different approach: executive authority rather than legislation. It required companies training models above certain compute thresholds to report results of safety testing to the government. It directed NIST to develop AI safety standards and tasked agencies with assessing AI risks in their domains. However, as an executive order rather than law, its durability depends on political will.

**China's Interim Measures for Generative AI (2023)** required generative AI services to register with authorities, undergo security assessments, and ensure outputs align with "socialist core values." China's approach emphasizes content control and state oversight, contrasting with the EU's rights-based framework and the US's industry-led approach.

### Corporate Self-Regulation

**Responsible Scaling Policies (RSPs)**: Anthropic introduced ASL (AI Safety Level) classifications, analogous to biosafety levels. ASL-1 is no meaningful risk. ASL-2 (current models) requires standard safety measures. ASL-3 and above would trigger progressively stricter security, evaluation, and deployment requirements as capabilities cross defined thresholds. The framework commits to not deploying models above a given ASL without corresponding safety measures.

**OpenAI's Preparedness Framework** similarly defines capability thresholds for dangerous capabilities (cybersecurity, biological threats, persuasion, model autonomy) and commits to evaluation before deployment. Models are scored on risk levels from Low to Critical, with Critical-level capabilities triggering deployment restrictions.

**The Frontier Model Forum** (formed 2023), comprising OpenAI, Google DeepMind, Anthropic, and Microsoft, established industry coordination on safety research, best practices, and information sharing about dangerous capabilities. Its effectiveness is debated — critics argue it is more public relations than binding commitment.

### Technical Safety Measures

**Red-teaming** involves systematic adversarial testing of models before deployment. Teams of researchers (and sometimes external domain experts) attempt to elicit harmful outputs, bypass safety filters, and find failure modes. Red-teaming has become standard practice at all major labs, though the depth and rigor vary significantly.

**Model evaluations** for dangerous capabilities test whether models can assist with biological weapons design, cyberattack development, chemical/biological/radiological/nuclear (CBRN) threats, or autonomous self-replication. These evaluations are typically conducted before release and reported in model cards or system cards. The challenge is that evaluations must anticipate risks from capabilities that may emerge unpredictably as models scale.

**Jailbreaking** represents the ongoing cat-and-mouse game between adversarial users and safety measures. Techniques like prompt injection, role-playing scenarios, and multi-turn manipulation can bypass safety filters. Defenses include constitutional AI training, input/output classifiers, and adversarial training. The arms race continues with no permanent resolution in sight.

**Watermarking and provenance**: As AI-generated content becomes indistinguishable from human-written content, techniques for identifying AI-generated text have become an active area of research. Statistical watermarking (embedding detectable patterns in generated text) and content provenance standards (C2PA) aim to provide transparency about whether content was AI-generated. The effectiveness and deployability of these techniques remain debated.

### The AI Safety Summit Process

The UK-hosted AI Safety Summit at Bletchley Park (November 2023) convened governments and industry leaders to discuss frontier AI risks. It produced the Bletchley Declaration, signed by 28 countries, acknowledging risks from frontier AI. The follow-up Seoul Summit (May 2024) produced voluntary commitments from frontier labs. The process represents nascent international coordination but remains non-binding, and the gap between declarations and enforceable governance is substantial.

### The NIST AI Risk Management Framework

NIST published the AI RMF in 2023 as a voluntary US framework for managing AI risks. It organizes risk management around four functions: Govern (establish policies), Map (identify risks), Measure (assess risks), and Manage (mitigate risks). While non-binding, it has influenced corporate AI governance programs and procurement requirements, particularly in the US federal government.

## Why It Matters

### The Pace Problem

The fundamental challenge of AI governance is that the technology moves faster than regulation. The EU AI Act took three years to negotiate (2021-2024); in that time, the field went from GPT-3 to GPT-4 to reasoning models to agentic systems. Even after passage, implementation has lagged: the CEN/CENELEC standards work missed its August 2025 deadline, and the November 2025 Digital Omnibus proposal effectively pushed back the high-risk compliance timeline. By the time regulations fully take effect in August 2026, the capabilities they address may already be outdated. This creates a persistent lag between risk and response.

### The Alignment Tax Debate

Safety features can reduce model capabilities — a phenomenon sometimes called the "alignment tax." A model trained to refuse harmful requests may also refuse legitimate ones. A model with content filters may be less creative. This creates tension between safety and usefulness that has no clean resolution, only trade-offs. Anthropic's constitutional AI approach and the January 2026 reason-based alignment update attempt to minimize this tax by making safety more nuanced.

### The Open-Source Safety Debate

Should powerful model weights be publicly released? Open advocates argue that transparency enables independent safety auditing, prevents monopoly control, and democratizes the technology. Safety advocates argue that open weights make safety measures optional — anyone can fine-tune away safety training — and that some capabilities should not be universally accessible. DeepSeek R1 and LLaMA 4's open releases intensified this debate, as both demonstrated capabilities that, with modification, could assist harmful activities.

### International Coordination

AI governance is a global problem with no global authority. US, EU, China, UK, and others pursue divergent approaches reflecting different values and priorities. Models trained in one jurisdiction operate globally. A model released as open weights is immediately available everywhere, regardless of any single country's regulations. The AI Safety Summit process (Bletchley Park 2023, Seoul 2024) represents nascent international coordination, but binding international agreements remain distant.

## Key Technical Details

- EU AI Act (2024): risk-based classification, conformity assessments for high-risk AI. Phased: prohibited practices (Feb 2025), GPAI obligations (Aug 2025), full application (Aug 2026)
- European AI Office: established for GPAI oversight and cross-member-state coordination
- GPAI Code of Practice (Jul 2025): voluntary compliance tool published alongside Commission guidelines
- CEN/CENELEC standards: delayed past Aug 2025 deadline, creating compliance uncertainty
- Digital Omnibus proposal (Nov 2025): adjusts high-risk AI timeline due to standards delays
- US Executive Order (Oct 2023): reporting requirements for models above compute thresholds
- Anthropic ASL: safety levels from 1 (minimal risk) to 4+ (requiring stringent measures)
- OpenAI Preparedness Framework: capability evaluations across four risk domains
- Frontier Model Forum (2023): industry safety coordination (OpenAI, Google, Anthropic, Microsoft)
- NIST AI RMF (2023): voluntary US risk management framework (Govern, Map, Measure, Manage)
- China Interim Measures (2023): registration, security assessment, content alignment requirements
- Red-teaming: standard pre-deployment adversarial testing at all major labs

## Common Misconceptions

- **"AI safety is about preventing science fiction scenarios."** While existential risk is part of the discourse, most AI safety work focuses on near-term, practical issues: bias, misinformation, privacy, reliability, and misuse. The frontier of concern has shifted from hypothetical to operational as models are deployed at scale.

- **"Regulation will stifle innovation."** The EU AI Act exempts research and most AI applications. The heaviest obligations apply only to high-risk and frontier systems. Most AI innovation operates well below the regulatory threshold. The greater risk may be under-regulation of rapidly advancing capabilities.

- **"Safety and capability are opposed."** Models like Claude 4 demonstrate that strong safety properties can coexist with frontier capability. Reason-based alignment actually makes models more useful by enabling nuanced engagement with sensitive topics rather than blanket refusal. The alignment tax is real but not insurmountable.

- **"Open-source models are inherently dangerous."** Open models enable transparent safety research, independent auditing, and community-driven safety improvements. The safety trade-off of open release is genuine but not one-sided — closed models require trusting a single organization's safety commitments without external verification.

## Connections to Other Concepts

The technical foundations of alignment connect to `01-instructgpt-and-rlhf.md` and `03-constitutional-ai.md`. The agent safety challenges are explored in `06-agent-native-models.md`. The open-source safety debate connects to `07-open-vs-closed-the-narrowing-gap.md` and `04-the-open-source-ecosystem.md`. The reasoning capabilities that intensify safety concerns are covered in `05-the-reasoning-paradigm-shift.md`. The future trajectory of these challenges is discussed in `05-where-llms-are-heading.md`.

## Further Reading

- European Parliament, "Regulation (EU) 2024/1689: The AI Act" (2024) — the full legislative text.
- European Commission, "General-Purpose AI Code of Practice" (2025) — voluntary GPAI compliance guidance.
- Anthropic, "Anthropic's Responsible Scaling Policy" (2023) — the ASL framework.
- OpenAI, "Preparedness Framework" (2023) — capability evaluation and deployment thresholds.
- NIST, "Artificial Intelligence Risk Management Framework" (2023) — the US voluntary framework.
- Shevlane et al., "Model Evaluation for Extreme Risks" (2023) — framework for dangerous capability evaluation.
- Bai et al., "Constitutional AI: Harmlessness from AI Feedback" (2022) — technical safety training approach.
