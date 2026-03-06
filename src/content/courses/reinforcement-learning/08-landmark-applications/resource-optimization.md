# Resource Optimization

**One-Line Summary**: Data center cooling, chip design, network routing -- RL finding superhuman solutions to combinatorial optimization problems.

**Prerequisites**: `what-is-reinforcement-learning.md`, `deep-q-networks.md`, `proximal-policy-optimization.md`.

## What Is RL for Resource Optimization?

Imagine managing a building's heating and cooling system. You could follow fixed rules ("if temperature exceeds 72F, turn on AC"), but these rules ignore the complex interactions between weather forecasts, occupancy patterns, electricity prices, equipment wear, and thermal inertia. A human expert might do better by intuitively balancing these factors, but the problem has too many interacting variables for any human to optimize globally. RL can discover control strategies that account for all these dynamics simultaneously, often finding solutions no human would consider.

Resource optimization problems share common traits: high-dimensional state spaces, complex dynamics, sequential decisions with delayed consequences, and well-defined objectives. RL excels here because the environment dynamics are difficult to model analytically but easy to simulate, and because optimal solutions often involve counterintuitive strategies that humans would never design manually.

## How It Works

### Google Data Center Cooling

Google's data center cooling optimization (Evans & Gao, 2016) is perhaps the most celebrated industrial RL application:

**Problem**: Data centers consume enormous energy for cooling (~40% of total). The cooling system has hundreds of interacting parameters: chiller set points, cooling tower fans, pump speeds, air handler configurations.

**RL formulation**:
- **State**: 19 features including temperatures, power consumption, pump speeds, weather
- **Actions**: Adjustments to 5 cooling system parameters
- **Reward**: Negative Power Usage Effectiveness (PUE) -- lower energy per unit of computing is better

**Results**: RL achieved a **40% reduction in cooling energy** and a 15% reduction in overall PUE. The system discovered non-obvious strategies like pre-cooling before predicted load spikes and coordinating equipment in ways operators had never considered.

DeepMind later refined this into a fully autonomous system (2018) that directly controls cooling equipment without human oversight, maintaining the 40% savings consistently.

### Chip Design and Placement

Mirhoseini et al. (2021, Nature) applied RL to **chip floorplanning** -- placing functional blocks (macros) on a chip die to minimize wire length, congestion, and timing violations:

**RL formulation**:
- **State**: Current partial placement + chip netlist (graph of connections between blocks)
- **Actions**: Place the next macro at a grid location on the chip canvas
- **Reward**: Negative weighted combination of wire length, congestion, and density violations

**Architecture**: A graph neural network encodes the chip netlist, and a policy network outputs placement probabilities over the grid. The agent learns across many chip designs, developing transferable placement intuitions.

**Results**: RL-generated placements matched or exceeded the quality of human expert placements that took weeks to produce -- in under 6 hours. This was deployed in production for Google's TPU chip design.

### Network Routing and Traffic Optimization

RL optimizes network packet routing to minimize latency, maximize throughput, and balance load:

**Traffic signal control**: Wei et al. (2018) applied deep RL to traffic signal optimization across city intersections. Each intersection is an agent; the system learns green/red timing to minimize average travel time. Results showed 15-25% reduction in average travel time compared to fixed-timing and actuated control baselines.

**Network routing**: Valadarsky et al. (2017) used RL to learn routing policies for software-defined networks (SDN), achieving near-optimal performance while adapting to changing traffic patterns in real time.

### Inventory and Supply Chain Management

RL optimizes inventory decisions across supply chains with uncertain demand:

- **State**: Current inventory levels, pending orders, demand forecasts, supplier lead times
- **Actions**: Order quantities for each product at each location
- **Reward**: Revenue minus holding costs, stockout penalties, and ordering costs

The multi-period, multi-product, multi-location nature makes this problem intractable for traditional optimization but natural for RL. Madeka et al. (2022) at Amazon applied RL to inventory management, reporting significant reductions in stockout rates while maintaining inventory efficiency.

### Combinatorial Optimization

RL has been applied to classical NP-hard combinatorial problems:

**Traveling Salesman Problem (TSP)**: Bello et al. (2017) trained a pointer network with REINFORCE to solve TSP, producing near-optimal tours without hand-designed heuristics. For 50-node problems, the RL solution was within 1-2% of the optimal.

**Job scheduling**: RL learns to schedule jobs across machines to minimize makespan or maximize throughput. The agent observes job characteristics and machine states, learning scheduling heuristics that outperform traditional dispatching rules.

**Bin packing**: RL learns to pack items into bins efficiently, achieving near-optimal solutions for 2D and 3D packing problems.

## Why It Matters

Resource optimization represents some of the highest-value applications of RL in industry. Google's data center cooling savings alone translate to millions of dollars per year and significant carbon emission reductions. Chip design acceleration reduces time-to-market by weeks. Traffic optimization improves quality of life for millions of commuters.

These applications share a pattern: the problem has a clear, measurable objective; simulation or historical data is available; the state space is too complex for manual optimization; and even small improvements have large economic impact. RL's ability to discover non-obvious strategies in these domains consistently surprises domain experts.

## Key Technical Details

- **Data center cooling**: The system operates with a 5-minute control loop, making ~288 decisions per day. Safety constraints ensure the RL agent cannot push parameters outside physical safety limits.
- **Chip placement**: The RL agent places ~100-1000 macros sequentially. Training takes ~48 hours on 100 TPUs for a single chip design. Transfer learning across chip families significantly reduces training time for new designs.
- **Traffic optimization**: Multi-agent RL coordinates dozens to hundreds of intersections. Communication between intersection agents (centralized training, decentralized execution) significantly outperforms independent learning.
- **Simulation fidelity**: Most resource optimization RL is trained in simulation. The sim-to-real gap is generally smaller than in robotics because physics is better understood and more predictable (thermodynamics, network protocols, supply chain mechanics).
- **Safety constraints**: Production systems enforce hard constraints on RL actions. The agent operates within a safe envelope defined by domain experts, preventing dangerous states even during exploration.

## Common Misconceptions

- **"RL replaces existing optimization methods."** In practice, RL often augments rather than replaces traditional methods. Hybrid approaches (RL for high-level strategy, conventional optimization for low-level execution) are common.
- **"You need millions of samples for resource optimization RL."** Unlike game environments, many resource optimization problems have relatively low-dimensional states and actions, allowing good policies to be learned from thousands to tens of thousands of episodes.
- **"RL always finds the globally optimal solution."** RL finds good solutions but has no optimality guarantees. For problems where optimal solutions can be computed (small TSP instances), RL typically reaches within 1-5% of optimal.
- **"The chip placement result means RL will design entire chips."** RL handles placement (macro floorplanning), which is one step of the chip design process. Routing, logic synthesis, and verification still use traditional EDA tools.

## Connections to Other Concepts

- `deep-q-networks.md` -- DQN and variants are commonly used for discrete resource optimization.
- `proximal-policy-optimization.md` -- PPO is the most common algorithm for continuous control in resource optimization.
- `multi-agent-reinforcement-learning.md` -- Traffic optimization and supply chains often involve multi-agent coordination.
- `reward-shaping.md` -- Designing reward functions that capture complex operational objectives.
- `rl-in-production.md` -- Deploying resource optimization RL with safety constraints and monitoring.

## Further Reading

1. **Evans & Gao (2016)** -- "DeepMind AI Reduces Google Data Centre Cooling Bill by 40%." *DeepMind Blog*. The landmark industrial RL application.
2. **Mirhoseini et al. (2021)** -- "A graph placement methodology for fast chip design." *Nature*, 594. RL for chip floorplanning deployed at Google.
3. **Bello et al. (2017)** -- "Neural Combinatorial Optimization with Reinforcement Learning." *ICLR Workshop*. RL for TSP and combinatorial optimization.
4. **Wei et al. (2018)** -- "IntelliLight: A Reinforcement Learning Approach for Intelligent Traffic Light Control." *KDD*. Deep RL for traffic signal optimization.
5. **Mazyavkina et al. (2021)** -- "Reinforcement Learning for Combinatorial Optimization: A Survey." *Computers & Operations Research*. Comprehensive survey of RL for optimization problems.
