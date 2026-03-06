# Meta-Reinforcement Learning

**One-Line Summary**: Meta-RL trains agents across a distribution of tasks so they can adapt to new, unseen tasks in just a few episodes -- learning to learn rather than learning to solve one problem.

**Prerequisites**: Policy gradient methods, recurrent neural networks, gradient-based optimization, task distributions, few-shot learning concepts

## What Is Meta-Reinforcement Learning?

Consider a seasoned chess player who picks up a new board game. They do not start from scratch -- they recognize patterns (control the center, develop pieces early, think ahead), adapt their general strategy to the new rules, and play competently within a few games. They have not just learned chess; they have learned how to learn board games.

Meta-RL gives agents this same ability. Instead of training on a single task until convergence, the agent trains across a **distribution of tasks**, each a different MDP. The goal is not to master any one task but to develop internal mechanisms that enable rapid adaptation to any new task drawn from the same distribution. At test time, the agent encounters a novel task and must achieve good performance within a handful of episodes -- few-shot reinforcement learning.

## How It Works

### Problem Formulation

Meta-RL assumes a distribution over tasks $p(\mathcal{T})$, where each task $\mathcal{T}_i$ is an MDP with its own reward function $R_i$ and possibly its own transition dynamics $T_i$. The meta-objective is:

$$\max_\theta \; \mathbb{E}_{\mathcal{T}_i \sim p(\mathcal{T})} \left[ J_{\mathcal{T}_i}(\pi_{\theta_i'})\right]$$

where $\theta$ are the meta-parameters and $\theta_i'$ are the task-specific adapted parameters. The critical distinction from multi-task RL is the **adaptation mechanism**: the agent explicitly adapts to each task using limited experience, and the meta-parameters are optimized to make this adaptation as effective as possible.

### MAML for RL: Gradient-Based Meta-Learning

Model-Agnostic Meta-Learning (MAML; Finn, Chelsea, Abbeel, and Levine, 2017) meta-learns an initialization $\theta$ of the policy network such that a few gradient steps on a new task produce a good policy. For each training task $\mathcal{T}_i$:

1. **Inner loop (adaptation)**: Collect trajectories using $\pi_\theta$, compute the policy gradient, and take one (or a few) gradient steps:

$$\theta_i' = \theta + \alpha \nabla_\theta J_{\mathcal{T}_i}(\pi_\theta)$$

2. **Outer loop (meta-update)**: Evaluate the adapted policy $\pi_{\theta_i'}$ on new trajectories from $\mathcal{T}_i$ and update $\theta$:

$$\theta \leftarrow \theta + \beta \sum_{\mathcal{T}_i} \nabla_\theta J_{\mathcal{T}_i}(\pi_{\theta_i'})$$

The outer loop gradient requires differentiating **through** the inner loop update, producing second-order derivatives. This is the computational cost of MAML: computing the gradient of a gradient. In practice, the first-order approximation (FOMAML, which drops second-order terms) performs comparably with significantly reduced computation.

The meta-learned initialization $\theta$ sits at a point in parameter space that is close (in gradient-step distance) to good solutions for all tasks. One gradient step from $\theta$ reaches a good policy for task $A$; one step in a different direction reaches a good policy for task $B$.

### RL-Squared: Context-Based Meta-RL

$\text{RL}^2$ (Duan et al., 2016) takes a fundamentally different approach: it encodes the adaptation mechanism directly into the agent's recurrent architecture. The agent's policy is a recurrent network (LSTM or GRU) that receives the full interaction history -- states, actions, and rewards -- as input:

$$a_t = \pi_\theta(s_t, a_{t-1}, r_{t-1}, h_{t-1})$$

where $h_{t-1}$ is the recurrent hidden state. The hidden state acts as a **task context** that is updated with each new observation. Over multiple episodes on the same task, the hidden state accumulates information about the task's dynamics and reward structure, effectively implementing a learned Bayesian inference procedure.

Training uses standard RL across episodes of the same task as a single extended "meta-episode." The policy is trained with LSTM hidden state preserved across episode boundaries within a task trial. The recurrent network learns to:

1. Explore strategically in early episodes to identify the task
2. Exploit the inferred task structure in later episodes

### Context-Based Meta-RL and Task Inference

More recent context-based methods explicitly separate task inference from policy execution. PEARL (Rakelly et al., 2019) maintains a probabilistic context encoder:

$$z \sim q_\phi(z \mid c), \quad \text{where } c = \{(s_t, a_t, r_t, s_{t+1})\}_{t=1}^K$$

The context variable $z$ is inferred from a small set of transitions and conditions the policy $\pi_\theta(a \mid s, z)$ and value function $Q_\theta(s, a, z)$. This decomposition enables off-policy meta-learning: past experience from any task can be reused for training the context encoder.

The context encoder is trained to maximize the mutual information between the context variable and the task identity:

$$\max_\phi \; I(z; \mathcal{T}) = H(z) - H(z \mid \mathcal{T})$$

### Task Distributions

The design of the task distribution $p(\mathcal{T})$ is critical and often underappreciated:

- **Reward variation**: same dynamics, different reward functions (e.g., navigate to different goals)
- **Dynamics variation**: same reward, different physics (e.g., different friction, mass, gravity)
- **Combined variation**: both reward and dynamics change across tasks

The task distribution must be broad enough to require adaptation but structured enough that tasks share transferable structure. If tasks are too similar, single-task RL suffices. If tasks are too different, no shared structure exists to meta-learn.

### In-Context RL

Recent work frames meta-RL as **in-context learning** using transformers. Algorithm Distillation (Laskin et al., 2022) trains a transformer on sequences of learning histories -- entire training runs of RL agents on different tasks. The transformer learns to predict good actions given the context of past attempts, effectively distilling an RL algorithm into the transformer's forward pass.

The transformer input is a sequence of episodes:

$$\text{context} = [\tau_1^{(1)}, \tau_2^{(1)}, \dots, \tau_1^{(2)}, \tau_2^{(2)}, \dots, \tau_1^{(K)}, s_t^{(K)}]$$

where superscripts denote episodes and the model predicts the next action. The transformer implicitly implements exploration, task identification, and exploitation, all within a single forward pass. This connects meta-RL to the in-context learning capabilities observed in large language models.

## Why It Matters

Real-world deployment requires agents that can handle novel situations without retraining from scratch. A household robot encounters new objects, a recommendation system faces new users, and an autonomous vehicle meets novel road configurations. Meta-RL provides the framework for building agents that adapt on the fly. It also offers a computational lens on biological learning -- animals, including humans, exhibit clear meta-learning capabilities, adapting to new environments far faster than tabula rasa learning would predict.

## Key Technical Details

- MAML typically uses 1-5 inner loop gradient steps with inner learning rate $\alpha \approx 0.1$ and outer learning rate $\beta \approx 10^{-3}$
- $\text{RL}^2$ uses trials of 2-10 episodes per task, with LSTM hidden state carrying information across episode boundaries
- PEARL uses a context of 5-20 transitions for task inference, enabling adaptation from very limited data
- Meta-training requires 10,000-100,000 tasks (or task variations) for robust generalization
- FOMAML (first-order MAML) drops the Hessian computation, reducing per-step cost from $O(p^2)$ to $O(p)$ where $p$ is the number of parameters
- Task distribution design is the most underrated design choice -- too narrow and meta-learning is unnecessary, too broad and it is impossible
- In-context RL with transformers uses context lengths of 300-1000 transitions and requires significant compute for pretraining

## Common Misconceptions

- **"Meta-RL is the same as multi-task RL"**: Multi-task RL optimizes a single policy across all tasks simultaneously. Meta-RL explicitly trains the adaptation mechanism -- the ability to specialize quickly to a new task. A multi-task agent averages; a meta-RL agent adapts.
- **"MAML finds a universal initialization"**: MAML does not find parameters that work for all tasks. It finds parameters from which a few gradient steps reach task-specific good solutions. The initialization itself may perform poorly on any individual task.
- **"More adaptation steps are always better"**: With too many inner-loop steps, MAML overfits to individual tasks and the meta-learning signal degrades. The sweet spot is typically 1-3 steps.
- **"Meta-RL solves transfer learning"**: Meta-RL transfers within the training task distribution. Generalization to fundamentally different task families (out-of-distribution tasks) remains an open challenge.

## Connections to Other Concepts

- Meta-learned exploration strategies can replace hand-designed curiosity from `curiosity-driven-exploration.md`
- `hierarchical-reinforcement-learning.md` provides reusable skills that complement meta-learned adaptation
- `imitation-learning.md` can provide demonstration data for bootstrapping meta-training
- `offline-reinforcement-learning.md` provides the offline datasets from which in-context RL methods learn
- Task distributions in meta-RL can encode the multi-agent structure from `multi-agent-reinforcement-learning.md`

## Further Reading

- **Finn, Abbeel, and Levine, "Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks" (MAML, 2017)**: Introduces gradient-based meta-learning with the inner/outer loop structure. The foundational paper for optimization-based meta-RL.
- **Duan et al., "RL-Squared: Fast Reinforcement Learning via Slow Reinforcement Learning" (2016)**: Demonstrates that recurrent policies trained across tasks implicitly learn RL algorithms within their hidden states.
- **Rakelly et al., "Efficient Off-Policy Meta-Reinforcement Learning via Probabilistic Context Variables" (PEARL, 2019)**: Probabilistic task inference enabling off-policy meta-learning with dramatically improved sample efficiency.
- **Laskin et al., "In-Context Reinforcement Learning with Algorithm Distillation" (2022)**: Trains transformers on RL learning histories, achieving in-context RL that mirrors in-context learning in language models.
- **Beck et al., "A Survey of Meta-Reinforcement Learning" (2023)**: Comprehensive survey covering gradient-based, context-based, and task-inference approaches to meta-RL.
