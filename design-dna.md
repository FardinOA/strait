# Strait Design DNA

The binding visual contract for the Strait marketing site. Strait is an imaginary online money-transfer platform. It sends money abroad at the real mid-market rate and charges one small fee that is shown before you pay. It delivers over each country's own instant payment rails, usually in minutes.

## Brief

The client supplied a reference: a neobank landing page on white, washed with a lime-to-green gradient, with near-black buttons and cards. It has a big semibold grotesk headline set tight, with one word in a lighter lime gradient, and light-weight section heads with a small icon set inline. Its cards are white with soft shadows, plus one black card framed in lime. The client asked us to **keep that theme and typography** without copying the page itself, and to make the hero and every section distinctive and production-grade.

## Territory

Fresh, bright fintech: white surfaces, one high-energy lime and a near-black that carries weight. Depth comes from soft layered shadows and glossy black surfaces, not from texture. Every visual is real product UI (transfer panels, a recipient's banking app, rate charts, a tracking timeline), so the page shows the product working instead of illustrating a metaphor.

Rejected (v1, 2026-10-22): a nautical-chart territory with buff land, chart magenta and serif chart lettering. It ignored the client's theme and typography and read as editorial illustration, not production UI.

## Evidence Binding

| Decision | Source | Mechanism |
|---|---|---|
| Page `#F6F7F2`, paper `#FFFFFF` | Reference: white hero, light grey sections | Sections alternate between white and off-white |
| Lime ramp, primary `#B8E43C` | Reference lime | Lime marks money arriving: received amounts, success, the beam |
| Sage `#5E8F52` | Reference's muted green icon discs | Icon discs and secondary success, never large fills |
| Ink `#0A0B09` | Reference's black button and card | Primary buttons, the send card, the dark security section |
| Inter Tight 600, -0.045em | Reference headline (tight neo-grotesk, semibold) | All display type |
| Inter Tight 400 for section heads | Reference's light "Banking, Reimagined" | Hierarchy from weight contrast, not just size |
| Inter for body, Geist Mono for figures | Product UI reading | Mono only for rates, times and IDs |
| Lime gradient text on the key figure | Reference's gradient "Future" | Used once per view, always on the amount that arrives |

## Category Default Analysis

**Category:** consumer cross-border money transfer and neobank.

| Common strategy | Used here? | Why |
|---|---|---|
| Globe or world map with glowing arcs | No | One specific transfer, drawn between the sender's card and the recipient's app |
| Calculator widget in a card beside the headline | No | The headline itself is the calculator |
| Hand holding a card / lifestyle photo | No | All visuals are working product UI |
| "Zero fees!" banner | No | The markup X-ray shows what others hide, with numbers |
| Icon-and-text bento | Partly | The bento layout is the reference's, but every tile contains a working mini-UI, not an icon |
| Avatar stack with "trusted by" count | Yes | Part of the reference theme. Kept small, under the stage |

## Innovation (what the reference doesn't do)

1. **The headline is the calculator.** "Send £1,000 to Lagos. Amara gets ₦2,018,658." The amount, currency and destination are editable in place, and the payout counts to its new value.
2. **Hero stage:** your black send card on the left and Amara's banking app on the right, joined by a lime beam. The money travels along it, ticking off timed checkpoints, and lands as a live notification.
3. **Markup X-ray:** the same transfer through five kinds of provider, with the hidden spread drawn as a hatched slice of each bar.
4. **Rate anchor:** drag a target onto 30 days of real-shaped data and see how often it would have filled.
5. **Watch:** a lime radar sweep over a live feed, stopping on the one transfer it holds.

## Motion

Headline rise, and a count-up when the payout changes. The hero beam loops while it's on screen and pauses off-screen. Sections reveal on scroll. Everything is static under `prefers-reduced-motion`, and the hero then shows a completed transfer.

## Amendment Log

- 2026-10-22: v1, nautical-chart territory. Rejected by the client.
- 2026-10-22: v2, re-based on the client's reference theme and typography (lime, white and black; Inter Tight). Kept the product ideas.
