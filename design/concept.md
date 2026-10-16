# Hromada Atlas: design concept (chart-only UI)

Status: draft v0.1 · 2026-10-11 · low-fi
Mockup: `mockup.html` (open as is to see all screens; add `#s1`…`#s6` to see one screen) · screenshots in `screens/screen-1..6.png`

> **All numbers, rankings, events and hromada attributes in the mockup and in this doc are made-up EXAMPLE DATA.** Kvasy, Shabo, Koblevo and Berehove appear only as placeholder names for growth-story slots. None of their values are real.

---

## 1. Idea in one paragraph
Hromada Atlas is an explorable atlas of Ukrainian hromadas and villages: population, economy, local budgets and R&D context, plus edited growth stories (e.g. Kvasy, winemaking villages). The UI has **no menus, tabs or forms**. Every way to navigate, filter, compare, drill in or forecast is a direct action on a chart: click a bar, brush a range, drag a band handle. Text only appears as labels, annotations and story captions, and every table is itself an expanded chart segment.

## 2. Principles
1. **Chart = control.** Each visual element has one main action (click). Shift adds an item to a set, drag sets a range or a value, and double-click opens or pins.
2. **One time axis.** Every time-based view on a screen shares the same x-axis, and focus (a year or range) is the same across all of them.
3. **Navigation is a chart too.** The *trail chart* at the top (stepped bars Україна → Область → Громада → Село → Сегмент) is the breadcrumb. Bar height shows depth. Clicking a step goes back to it. Active filters show up as chips on the steps.
4. **Be honest about data.** Missing data gets a dashed outline instead of an interpolated value. When a value only exists at a higher level (e.g. R&D at oblast level), the chart says so. Forecasts are always marked as forecasts and always drawn as bands, never as a single line.
5. **Grayscale first.** Darker means more or better. Color comes later, and only for meaning (e.g. forecast vs. fact), never for decoration.

## 3. Interaction model

### 3.1 Road bars (development path)
- A horizontal **timeline bar** for one hromada or village. Each **segment is a year** (or a quarter where data allows). Segment shade is the value of the chosen metric, or by default a composite growth index (the formula is still to be defined).
- **Phases** (e.g. Decline / Turnaround / Growth) are brackets under the bar. Their boundaries are set by editors or proposed by a change-point algorithm.
- **Pins** above the bar mark story events (forming the hromada, a brand launch, a festival) and link to a source.
- Interactions:
  - Click a row → open *Hromada path* (screen 2).
  - Click a segment → that year becomes the focus, and a segment table opens.
  - Click a phase bracket → select that range of years.
  - Double-click → pin the hromada for Compare.
  - Hover → tooltip with a mini-table.
- In lists (screen 1) road bars are 16 px high, so a sorted list of them works as a "small multiple" of development paths.
- Forecast years show as dashed or hatched segments to the right of the bar.

### 3.2 Segment tables
- **Any segment** (a stacked-bar piece, a road-bar year, a matrix cell, a scatter quadrant) can **expand in place** into a compact table. The table takes the segment's place, and the neighbouring parts of the chart slide aside. It does not open a modal or a new page.
- The table is a chart too: rows have mini-bars and a sparkline, and rows can be clicked to expand one more level (2 levels max).
- There are exactly three in-table actions (chips): **go deeper / compare with oblast / collapse**. Esc or a click outside collapses the table.
- Every table shows its data source (SDMX dataflow + series key) in its footer, so numbers can be traced.

### 3.3 Forecasts (adjustable projection bands)
- The projection is shown as **nested bands** (P10–P90 and P25–P75) plus a dashed median.
- **Direct manipulation:**
  - Drag the handles at the band's end year (P10 / median / P90). The model works backwards to the driver values that would produce that end point.
  - Drag a **driver bar** (net migration, investment, tourist flow, natural growth). The band updates live, and the previous band stays as a ghost.
  - A tornado chart shows sensitivity. Clicking a bar locks that driver.
  - Clicking a historical phase on the road bar runs the "what if that phase's trend continued" scenario.
- A saved scenario becomes a road bar with dashed segments and can be pinned into Compare.
- Model (to be chosen): a cohort-component model for population, plus simple elasticities for budget metrics. The concept treats the model as a swappable service.

### 3.4 Filtering and comparison by clicking
| Gesture | Effect |
|---|---|
| Click a bar or category | Filter to it (replaces the current filter) |
| Shift+click | Add to / remove from the selection set |
| Brush (drag across an axis or histogram) | Range filter |
| Lasso (scatter) | Select a set of points |
| Double-click an item | Pin to Compare (max 5, oblast median always shown as reference) |
| Click a legend bar | Focus or remove the series |
| Click a trail-chart step | Go up a level / clear the filters of that level |

Filters live in the trail chart and in the URL, so every state can be shared as a link.

## 4. Key screens
| # | Screen | Purpose | Main charts | Key interactions |
|---|---|---|---|---|
| 1 | **Atlas** | Entry point and overview: where are hromadas growing or shrinking | Oblast lens bars; ranked road-bar list; distribution histogram; revenue-structure bars | Click oblast = filter; brush histogram; click revenue segment = re-sort + go to 3; click road bar → 2 |
| 2 | **Hromada path** | Understand one hromada's development path | Large road bar with phases and pins; linked small multiples (population, own revenue per capita, businesses, capex); segment table | Click year/phase = focus; drag on axis = range; click pin = story card; double-click = pin to Compare |
| 3 | **Segment tables (budget)** | Read detailed numbers without leaving the chart | Stacked revenue bars by year; inline expanded table with mini-bars and sparkline | Click a segment → inline table; legend isolates a source; 3 chips (deeper / compare / collapse) |
| 4 | **Compare** | Put 2–5 hromadas side by side against the oblast median | Indexed lines (2015 = 100); legend bars with mini road bars; slope chart; rank matrix | Click line = focus; click slope point = change base year; matrix cell → segment table; dashed cell = no data |
| 5 | **Forecast** | Explore scenarios to 2030 | Fan band with draggable handles; driver bars; tornado chart | Drag handles / driver bars; lock a driver; save as dashed road bar |
| 6 | **Growth stories** | Find and read success stories (Kvasy, winemaking clusters) | Scatter (population change vs revenue growth) with story clusters; cluster road bars; tag bars | Lasso or click a cluster; tag bars filter (Shift = intersection); quadrant hover = table |

Mobile: same model, stacked vertically. Tap replaces click and long-press replaces Shift/double-click; brushing works with two-finger drag. *Still to be designed.*

## 5. Data notes and assumptions (to verify)
- **Derzhstat SDMX** (State Statistics Service of Ukraine SDMX API): population, economy, R&D. *To check:* which dataflows go down to hromada/settlement level (many go only to oblast or raion), and how often they update. Many series stopped or became partial after 2022, especially for occupied or frontline areas. The UI marks these with "*" and dashed outlines.
- **Budgets:** hromada-level revenue and spending most likely has to come from Open Budget / Treasury data rather than Derzhstat. Needs confirming.
- **R&D:** probably oblast level only. Show it as context in Compare and do not pretend it is hromada data.
- **Territorial units:** the post-2020 hromada borders (KATOTTH codes) need a mapping to older KOATUU codes for pre-2020 history. Path data before 2020 is reconstructed and should be labelled that way.
- **Stories:** written by editors, with sources. Tags (winemaking, tourism, mineral water, agro-processing, relocated businesses) are assigned by editors, not inferred by an algorithm.

## 6. Open questions
1. What goes into the composite "growth index" that shades road bars by default (or should there be no default, with the user picking a metric)?
2. Is there a village level below hromada in the data, or is that story-only?
3. Who owns the forecast model, and what uncertainty method should the bands use?
4. Should "chart-only" be strict for onboarding, i.e. is a first-run annotated walkthrough drawn over the charts allowed?
5. Accessibility: keyboard and screen-reader paths through charts (aria-live summaries for segments) are needed, so a strict "chart-only" UI must still have a text equivalent.
