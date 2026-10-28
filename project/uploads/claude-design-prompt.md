# Claude Design prompt: place the Mudad figures in the case study

Upload the 10 `.webp` files from this folder into Claude Design first, then paste everything below the line.

---

Update the Mudad (Masdr) case study page so it uses my finished figures. Keep the Ink & Dune look and all existing text, type and colors. Only change how media is placed.

**Media rules**
- Each image already has its own frame, label, figure number and caption baked in. Remove the fake browser frame around case study images, and don't add borders, shadows, rounded corners or overlays on top of them.
- Images sit above the paper grain and blots: keep `position:relative; z-index:301` on every image slot.
- Use `object-fit: contain`, never crop. Hero is 21:9 (4200×1800). All figures are 16:10 (3200×2000).
- Add `loading="lazy"` and `decoding="async"` to everything except the hero.

**Beats take a list of figures**
Change each beat's data from one `slot` to a `figures` list. The first figure is the lead and fills the beat's 7-column media side, as today. Any further figures go in a 2-up grid under the beat, spanning the main column, each 16:10, with a 24px gap. On phones the grid stacks to one column.

**Add a new beat**
Add a beat titled **"Money before payday"** between "Two steps, warnings first" and "Calmer paydays". Use the same layout as the other beats. Leave the body text as a placeholder for me.

**Slot map**

| Slot | Lead | Supporting (2-up grid) |
|---|---|---|
| Hero | hero-auto-payroll.webp | none |
| Beat 1 "Three steps and a bit of hoping" | 09-old-to-new-system.webp | none |
| Beat 2 "Two steps, warnings first" | 02-warn-before-submit.webp | 01-auto-payroll-off-on.webp, 03-one-code-five-months.webp |
| Beat 3 "Money before payday" (new) | 07-financing-offers.webp | 08-financing-onboarding.webp, 05-earned-wage-access.webp, 06-ewa-in-payroll.webp |
| Beat 4 "Calmer paydays" | 04-dashboard-status.webp | none |

Beat 3 has three supporting figures, so the last one sits alone on the left of the second row. That's fine.

**Alt text** (use exactly; in Arabic mode keep these English alts unless I add Arabic ones)
- hero-auto-payroll: "Mudad payroll dashboard showing the auto payroll card, with the verification code dialog in front."
- 01: "Two payroll screens side by side: auto payroll off, and on with a new end-month field."
- 02: "Payroll summary with wage protection warnings on employee rows and the expected compliance rate."
- 03: "Verification dialog confirming auto payroll from January to May 2024 with one code."
- 04: "Payroll dashboard card showing the next transfer, next deduction date and when auto payroll ends."
- 05: "Earned wage access request list with statuses, and a request detail panel."
- 06: "Payroll history with early-pay deductions inside the payroll run, marked as not a wage protection violation."
- 07: "Payroll financing request with offers from five providers compared side by side."
- 08: "Payroll financing onboarding explaining the four steps before the first request."
- 09: "Mudad before and after: the old blue top-navigation dashboard and the new side-navigation design system."

**Don't**
- Don't re-crop, recolor or add filters to the images.
- Don't add a second caption under the images, since captions are already in them. If the template has a caption field, leave it empty.
