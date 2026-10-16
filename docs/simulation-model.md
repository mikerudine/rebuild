# Simulation model

**Mostly NOT defined yet.** No game code exists. What `design/concept.md` defines:

- **Composite growth index** shades the road bars — *formula not defined* (open question).
- **Phases** (Decline / Turnaround / Growth) — set by editors or a change-point algorithm (not chosen).
- **Forecasts**: nested bands P10–P90, P25–P75 + dashed median. Drivers: net migration, investment, tourist flow, natural growth. User drags drivers or end-point handles (inverse solve). Tornado sensitivity chart. "Continue this phase's trend" scenario.
- **Model candidate**: cohort-component for population + simple elasticities for budget metrics; treated as a swappable service. Uncertainty method undecided.
- Premium "time rewind" and "merge villages into hromadas" mechanics (see monetization.md) — not designed.

## Undefined (to decide)
Game loop, resources/actions the player takes, how real data seeds a place's starting state, win conditions, tick length, village-level data (no hromada-level population data exists in our sources).
