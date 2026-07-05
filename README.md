# 🌌 The Stellar Nursery: An Astrophysical Physics Engine

An interactive, real-time 2D physics simulation built with **p5.js** that models the chaotic birth of a solar system within a volatile star cluster. Moving beyond hardcoded animations, this project implements a live ecosystem driven entirely by standard numerical physics integration, showing how order naturally emerges from cosmic chaos.

👉 **[CLICK HERE TO RUN THE LIVE SIMULATION](PASTE_YOUR_P5JS_PRESENT_LINK_HERE)**

---

## 🔭 The Science Lens: Astrophysical Dynamics

This engine relies on three core interconnected physical frameworks to dictate particle trajectories, life cycles, and systemic decay:

### 1. Newton’s Law of Universal Gravitation ($F = G \frac{m_1 m_2}{r^2}$)
Every spawned body contains mass and exerts a mutual gravitational pull on every other object. Massive **Proto-Stars** act as heavy gravitational anchors, while light **Asteroids** act as dynamic, agile actors. As objects approach a star, the force increases exponentially, generating realistic orbital arcs and high-speed slingshots.

### 2. Fluid Dynamics & Linear Drag ($F_{\text{drag}} = -k \cdot v$)
While deep space is a vacuum, stellar nurseries are dense with thick, primordial gas and interstellar dust. The simulation features a centralized **Gaseous Nebula** zone that acts as an environmental friction barrier. Passing bodies experience a resistive force directly opposing their velocity vector, draining excess kinetic energy and allowing fast-moving space debris to be captured into stable, permanent circular orbits.

### 3. Planetesimal Accretion (Conservation of Linear Momentum)
Collisions in a nebula do not result in perfect elastic rebounds. Instead, matter fuses together. When two bodies overlap, a permanent merge event occurs:
* **Mass Accumulation:** The dominant mass absorbs the smaller mass ($m_{\text{new}} = m_1 + m_2$), dynamically expanding its physical radius and its gravitational reach.
* **Momentum Conservation:** The new velocity vector is calculated using $m_1 v_1 + m_2 v_2 = (m_1 + m_2) v_{\text{new}}$, ensuring post-collision trajectories are physically grounded and smooth.

---

## 🛠️ Technical Highlights & Implementation Details

* **Object-Oriented Architecture:** Designed entirely using modular JavaScript classes (`Body` and `Nebula`) to ensure uniform physical interactions and code scannability.
* **Euler Numerical Integration:** Employs semi-implicit Euler integration to update vectors (`position += velocity`, `velocity += acceleration`) each frame.
* **Singularity Mitigation (Force Softening):** To prevent computational infinity bugs when the distance between objects ($r \to 0$) spikes gravitational force to infinity, a dynamic force-softening threshold based on the combined radiuses of the bodies is implemented.
* **Deterministic Environment Seeding:** Uses p5.js pseudo-random number generation seeds to allow users to reproduce identical planetary layouts or roll entirely new universes.

---

## 🎮 User Controls & Interactivity

The simulation serves as an interactive sandbox allowing real-time manipulation of fundamental physical constants:

* **Mouse Click:** Spawns a drifting asteroid particle with random initial velocities at the cursor.
* **SHIFT + Mouse Click:** Spawns a massive, stationary Proto-Star to fundamentally disrupt existing orbital grids.
* **[M] Toggle Mode:** Shifts the engine smoothly between **CALM** (stable, low-gravity, dense gas) and **CHAOTIC** (wild hyper-gravity, thin gas cloud) states.
* **[T] Toggle Force:** Inverts the universal gravitational constant, switching the system from global **Attraction** to global **Repulsion**.
* **[R] Reset Seed:** Re-initializes the simulation using the exact same configuration layout to watch the same system's evolution play out again.
* **[N] New Universe:** Cycles the random seed generator to construct an entirely new star cluster arrangement.
* **[O] UI Overlay:** Toggles the diagnostic telemetry interface and real-time velocity vector lines.
