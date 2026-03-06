# Robotics and Control

**One-Line Summary**: Sim-to-real transfer, dexterous manipulation, and locomotion -- bridging the gap between simulation and physical robots.

**Prerequisites**: `proximal-policy-optimization.md`, `model-based-vs-model-free.md`, `reward-shaping.md`, `imitation-learning.md`

## What Is RL for Robotics?

Imagine learning to ride a bicycle by reading a physics textbook. You understand the equations of balance, torque, and friction -- but the first time you sit on a real bike, you fall over. The gap between theoretical knowledge and physical execution is enormous. Robotics RL faces the same challenge: policies trained in simulation must survive the messy, unpredictable physics of the real world. This is the *sim-to-real gap*, and closing it is the central problem of RL for robotics.

RL for robotics applies sequential decision-making to physical embodied agents: robotic arms manipulating objects, legged robots walking over terrain, drones navigating obstacles, and autonomous vehicles making split-second decisions. Unlike Atari or Go, a failed action here can break hardware worth hundreds of thousands of dollars. Every sample costs real time, real energy, and real risk.

## How It Works

### Why Simulation First?

Training RL policies requires millions of environment interactions. DQN needed 50 million frames for Atari (`atari-and-arcade-games.md`); a physical robot operating at 10 Hz would need ~58 days of continuous operation for the equivalent, with no resets, no parallelism, and no room for destructive exploration. Simulation solves this:

- **Parallelism**: Thousands of simulated robots train simultaneously. NVIDIA Isaac Gym runs 16,384 parallel environments on a single GPU.
- **Speed**: Simulation runs 1,000--100,000x faster than real time.
- **Safety**: The robot can fall, collide, and break millions of times at zero cost.
- **Resets**: Episodes restart instantly; no human intervention needed.

Popular physics simulators include MuJoCo (Multi-Joint dynamics with Contact), PyBullet, NVIDIA Isaac Gym, and Drake. Each makes different fidelity-speed trade-offs.

### The Sim-to-Real Gap

Simulations are approximations. They differ from reality in:

- **Physics fidelity**: Contact dynamics, friction coefficients, deformable objects, and fluid interactions are hard to model accurately.
- **Sensor noise**: Real cameras have noise, blur, and variable lighting; simulated sensors are perfect by default.
- **Actuator dynamics**: Real motors have latency, backlash, and nonlinear torque curves.
- **Unmodeled effects**: Wear, temperature, cable tension, and table surface texture.

A policy that exploits simulation artifacts -- learning to "cheat" the physics engine -- will fail on the real robot. The gap is not merely quantitative; it can be qualitatively different.

### Domain Randomization

The most widely used sim-to-real technique is **domain randomization**: during training, simulator parameters are randomly varied across a wide distribution so the policy cannot overfit to any single configuration. If the policy works across thousands of randomized simulations, it is more likely to work in the one "simulation" that happens to be reality.

Parameters typically randomized include:
- Object mass, friction, and damping coefficients ($\pm 30\text{--}50\%$)
- Visual properties: lighting direction, textures, camera position
- Actuator gains, delays, and noise levels
- Initial conditions and object positions

OpenAI's Rubik's Cube project (2019) used **Automatic Domain Randomization (ADR)**, which progressively widened the randomization ranges as the policy improved. The Dactyl hand solved a Rubik's Cube in the real world after training entirely in simulation with over 13,000 randomized environment parameters.

### System Identification and Adaptation

An alternative to randomization is **system identification**: fitting simulator parameters to match real-world data. Given real-robot trajectories, the simulator's physics parameters are optimized to minimize the trajectory prediction error. Hybrid approaches combine domain randomization for robustness with system identification for accuracy.

**Sim-to-real adaptation** methods (e.g., RCAN, RetinaGAN) learn to translate between simulated and real observations using domain adaptation techniques, so the policy sees similar inputs regardless of the source.

### Landmark Results

**Dexterous manipulation (OpenAI, 2019)**: A Shadow Dexterous Hand with 24 degrees of freedom learned to reorient a Rubik's Cube using RL (PPO with LSTM policy, see `proximal-policy-optimization.md`). Trained across 64,000 CPU cores and 920 NVIDIA V100 GPUs. Domain randomization was so aggressive that the policy transferred zero-shot to the real hand.

**Legged locomotion (Lee et al., 2020; Miki et al., 2022)**: Quadruped robots (ANYmal) learned to walk, run, and recover from pushes over rough terrain using teacher-student training. A privileged teacher policy trains in simulation with access to ground-truth terrain information; a student policy learns to replicate the teacher using only onboard sensors (proprioception + limited exteroception).

**Agile flight (Kaufmann et al., 2023)**: An RL-trained drone racing policy defeated three world-champion drone pilots in physical time-trial races, achieving lap times unreachable by human reaction speeds.

## Why It Matters

Robotics is where RL meets physical reality. Success here validates that RL algorithms can handle continuous state and action spaces, partial observability, noisy sensors, and safety constraints -- all simultaneously. Every advance in sim-to-real transfer brings us closer to general-purpose robots that learn new tasks from experience rather than requiring hand-programmed motion primitives.

The practical implications span manufacturing (flexible assembly lines), healthcare (surgical robots), agriculture (harvesting), logistics (warehouse automation), and disaster response (search and rescue in collapsed structures).

## Key Technical Details

- **Action spaces**: Typically continuous joint torques or velocities, $\mathcal{A} \subset \mathbb{R}^d$ with $d = 6\text{--}30$ for manipulators and quadrupeds.
- **Observation spaces**: Joint positions/velocities (proprioception), force/torque sensors, cameras (RGB or depth), and sometimes privileged simulation state during training.
- **Control frequency**: Policies typically run at 20--100 Hz for manipulation, 50--200 Hz for locomotion. Latency above ~50 ms degrades performance significantly.
- **Sample efficiency**: PPO with domain randomization typically requires $10^8$--$10^{10}$ simulation steps. Real-world fine-tuning (when used) requires only $10^3$--$10^5$ steps.
- **Reward design**: A persistent challenge. Locomotion rewards often combine forward velocity, energy penalty, smoothness, and stability terms. Even small reward imbalances produce pathological gaits (see `reward-shaping.md`).
- **Safety constraints**: Constrained optimization (CPO, LAMBDA) or reward penalties enforce joint limits, contact force bounds, and self-collision avoidance. See `rl-in-production.md` for deployment safety.
- **Curriculum learning**: Tasks are often staged from simple to complex. A walking policy first learns to stand, then walk slowly, then walk on flat terrain, then on rough terrain.

## Common Misconceptions

**"Sim-to-real is solved."** Domain randomization works well for locomotion and some manipulation tasks, but deformable object manipulation (folding clothes, tying knots), tasks requiring precise force control (inserting a USB cable), and long-horizon contact-rich tasks remain extremely challenging to transfer.

**"More realistic simulation always helps."** Paradoxically, highly realistic but slightly *wrong* simulation can be worse than coarser but more *varied* simulation. Domain randomization succeeds partly because it avoids overfitting to any single physics model, no matter how detailed.

**"RL will replace classical control."** For well-characterized systems (industrial arms performing repetitive tasks), classical control (PID, model predictive control) remains more reliable, interpretable, and certifiable. RL excels when the task is complex, the environment is unstructured, or the dynamics are hard to model analytically. The best deployed systems often combine learned policies with classical safety layers.

**"Robots need to learn from scratch like AlphaZero."** Unlike board games, robotics benefits enormously from human demonstrations (`imitation-learning.md`), pre-trained perception models, and structured priors. Learning from scratch with RL in robotics is possible but wildly sample-inefficient compared to demonstration-bootstrapped approaches.

## Connections to Other Concepts

- `proximal-policy-optimization.md` -- PPO is the dominant algorithm for robotic locomotion and manipulation due to its stability and ease of tuning.
- `model-based-vs-model-free.md` -- Model-based RL (e.g., MBPO, Dreamer) promises better sample efficiency for robotics but currently trades off asymptotic performance.
- `imitation-learning.md` -- Behavioral cloning and DAgger provide warm-start policies from human demonstrations, drastically reducing RL training time.
- `reward-shaping.md` -- Reward engineering is critical and error-prone in robotics; shaped rewards can accelerate learning but risk unintended behaviors.
- `hierarchical-reinforcement-learning.md` -- Long-horizon manipulation tasks (e.g., cooking, assembly) benefit from hierarchical decomposition into subtask sequences.
- `rl-in-production.md` -- Deploying RL policies on physical robots introduces safety, monitoring, and maintenance challenges beyond simulation.
- `resource-optimization.md` -- Similar RL techniques apply to continuous control problems in industrial settings.

## Further Reading

- **OpenAI et al. (2019), "Solving Rubik's Cube with a Robot Hand"** -- Demonstrates dexterous manipulation via massive-scale domain randomization and Automatic Domain Randomization (ADR).
- **Tobin et al. (2017), "Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World"** -- The foundational paper on visual domain randomization for sim-to-real transfer.
- **Lee et al. (2020), "Learning Quadrupedal Locomotion over Challenging Terrain," *Science Robotics*** -- Teacher-student training for robust legged locomotion, deployed on the ANYmal robot over diverse terrains.
- **Kaufmann et al. (2023), "Champion-level drone racing using deep reinforcement learning," *Nature*, 620** -- RL-trained drone racing policy defeating human world champions in physical races.
- **Zhao et al. (2020), "Sim-to-Real Transfer in Deep Reinforcement Learning for Robotics: A Survey"** -- Comprehensive survey of sim-to-real methods: domain randomization, system identification, transfer learning, and meta-learning.
- **Akkaya et al. (2019), "Solving Rubik's Cube with a Robot Hand," arXiv:1910.07113** -- Technical details of the ADR system and training infrastructure for the Dactyl hand.
