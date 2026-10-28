# # Portfolio Homepage Design Brief

Before I design and build this, I need clarification on a few things to nail the vision:

**About the designer:**

_Started 2026-10-25 13:48 UTC_

---

## User

You're a principal product designer and award-winning creative developer. Design and build a modern, Awwwards-worthy portfolio homepage for a fictional product designer with exceptional art direction, typography, motion, and interaction design. Use GSAP, shaders, and Three.js where they enhance the experience, and deliver a polished, production-ready website that is responsive, performant, and worthy of Awwwards Site of the Day.

Use the attached moodboard as the primary visual direction - pay attention to the yellow sticky-note annotations.


I want a cinematic aesthetic with modern, editorial layout and strong typographic treatments.

Include a work section featuring 3- 4 projects, a "past teams" section showing a carousel of company logos, an about section covering how they operate and experience history: company, role, and date range for each, reverse chronological, a design capabilities section, and a what colleagues say section that includes reviews from previous teammates

Copy rules for the entire page: keep the voice conversational and relaxed, like the designer is talking to you rather than presenting to a review board. Contractions are fine. It should still be specific and confident, just not stiff. Avoid "passionate about," "pixel perfect," "wearing many hats," "bridging the gap," and "user-centric" as filler. Every claim should be specific enough that it couldn't be copy-pasted onto another designer's site.

If needed, ask any clarifying questions before starting so you have 99.9% confidence completing this design assignment. Don't make assumptions.

## Assistant



## Assistant

The moodboard didn't come through — the project is empty. Please re-upload it, plus a few quick calls so I don't guess.

_[tool: ask_user]_

_[tool: ask_user]_

I'm waiting on your answers, and the moodboard most of all. It never made it into the project, and I need its sticky-note annotations to set the visual direction. If you upload the logo files there too, I'll use them in the past teams carousel.

## User

<artifact-content-authored-by-others/>
Answered — Asked for follow-up questions; moodboard: Moodboard.pdf; designer: Salman Binmandeel, Riyadh, Senior product designer; seniority: Senior; projects: Pick prominent projects from my chat with you before. and i want projects that showcases strong points either strategically, planning, visual or business thinking.; companies: Real companies, I'll upload logo files; experience_count: 4; reviews: 3; webgl: Throughout: hero, image hover distortion on work, transitions; hero: Let the moodboard decide; work_click: Inline case study overlay; +2 more

## Assistant



## Assistant

_[tool: ask_user]_

_[tool: ask_user]_

I'm waiting on three things: the logo files, your project details, and your four roles with date ranges. I can't see our earlier chats, so the projects need to come from you.

## User

<artifact-content-authored-by-others/>
Answered — Asked for follow-up questions; logos: جاهز_-_Jahez.svg, masdr-logo.svg; projects_detail: 1) Mudad Payroll (Masdr): Autopayroll, proactive pre-submission alerts, salary financing; CSAT 79→82%, NPS 43→50.9, payroll 3→2 steps. 2) Mudad subscriptions (self-initiated): fair auto-renewal, pror…; experience_detail: One To X, Co-Founder & Product Designer, 11/2025–Present
Masdr, Senior Product Designer, 05/2025–11/2025
Masdr (formerly GOSI Business Development), Product Designer / UX Analyst, 10/2023–05/2025
Jah…

## Assistant



## Assistant

_[tool: ask_user]_

I need the last few details before I start: what to do about the reviews, your contact links, whether to include Arabic, and what to use for the project covers.

## User

<artifact-content-authored-by-others/>
Answered — Asked for follow-up questions; arabic: Bilingual toggle; imagery: Image slots you'll fill with real screenshots; user_q2: 1. for images of my works i need you to help polish them into satifying mockups and animations.

## Assistant



## Assistant

_[tool: ask_user]_

I'm waiting on your project screenshots, your mockup style, and whether placeholder reviews and contact links are fine for now. I can't generate images, but I can put your screenshots into animated device mockups.

## User

<artifact-content-authored-by-others/>
Answered — Asked for follow-up questions; mockup_style: Mixed per project; reviews_src2: Write placeholders; contact2: I'll add later

## Assistant



## Assistant

_[tool: ask_user]_

Two quick picks left: which frame goes on each project, and the Arabic typeface. Submit the form when you're ready and I'll start building.

## User

<artifact-content-authored-by-others/>
Answered — arabic_font: Editorial (Noto Naskh / Amiri); start: Start building now

## Assistant

_[tool: read_skill_prompt]_

_[tool: read_file]_

_[tool: image_metadata]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: run_script]_

_[tool: copy_starter_component]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: write_file]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: eval_js_user_view]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

My preview seems not loaded; I'll load it.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: dc_html_str_replace]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

I've built the portfolio as one page, **Salman Portfolio**, with both directions behind the A / B switch in the top-right corner. A background check is still running. I ran one quick pass myself: direction A's hero with the live water shader, the work section, about, and a case study overlay looked right. I saw direction B's hero only before the shader was showing up in my captures, and I haven't seen it in Arabic yet.

- **A · Ink & Paper:** light paper background. Your name runs across the top in red with a hanko-stamp ink texture, above a framed water-lily painting rendered live in WebGL. Clicking the water makes it ripple.
- **B · Pond Light:** dark by default. A full-screen underwater scene with light rays, lily pads and drifting particles stays behind the page, and the hero is a centred poster title in an editorial serif.

**On both directions:**
- **Navigation:** a frosted floating nav bar with dark/light, English/Arabic and sound toggles. Language and theme switch with a circular reveal, and Arabic flips the whole layout right to left using Amiri and Noto Naskh.
- **Loading and scrolling:** a red-stamp preloader, smooth scrolling, and reveals as you scroll.
- **Work:** the four projects sit in a carousel you can drag, each in its own mockup (browser frames, floating screens or phones). Mockups tilt with the cursor, ripple on hover, and slowly pan through the screenshot.
- **Case studies:** clicking a project opens it over the page, with a section menu on the left and a scroll preview of the page on the right.
- **Past teams:** a logo strip with your Jahez and Masdr logos. GOSI and One To X are text wordmarks, since you didn't upload logos for those two.

**What you need to fill in:**
- **Screenshots:** every mockup and the about portrait are empty drop zones. Drag your screenshots onto them, and full-page captures look best because they pan. I can't generate images.
- **Colleague quotes:** the three reviews are placeholders I wrote, and they're labelled as placeholders on the page. Swap in real quotes and names.
- **Contact links:** Email, LinkedIn, Read.cv and Dribbble all point nowhere for now.
- **Facts to check:** the about and case study copy sticks to the facts you gave me, but the wording is mine. Please read the Arabic especially.
- **Sound:** off by default. It's a soft water-and-tone ambience made in the browser, with small clicks on hover.

