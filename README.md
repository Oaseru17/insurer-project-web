# Insurer project web

The Next.js front end for the insurer project's carrier quotes; the first carrier is **Harbor Assurance** (renters). It
renders the carrier's form from the JSON the API serves, pre-fills what the customer's profile already
answers, asks only for what's missing, and shows clearly why a carrier can't quote someone.

**The full write-up** — field mapping, eligibility, assumptions, architecture, the 50-carrier design and
what I'd do with more time — is in the
[insurer-project-backend-service README](https://github.com/Oaseru17/insurer-project-backend-service#readme).

## Run it

The web needs the API, so run both repos side by side. Requires **Node 22+** (`.nvmrc` pins 24).

```bash
# 1. The API — http://localhost:4000
git clone https://github.com/Oaseru17/insurer-project-backend-service.git
cd insurer-project-backend-service
npm install
npm run dev

# 2. The web (in a second terminal) — http://localhost:3000
git clone https://github.com/Oaseru17/insurer-project-web.git
cd insurer-project-web
npm install
npm run dev
```

Open http://localhost:3000. Each repo has `npm run check` (lint + Prettier + types + Jest).

Settings (`.env.example`):

| Variable                                   | Default                 | What it does                                                     |
| ------------------------------------------ | ----------------------- | ---------------------------------------------------------------- |
| `BACKEND_URL`                              | `http://localhost:4000` | Where `/api/*` is forwarded (the browser only talks to this app) |
| `NEXT_PUBLIC_LOADING_STEP_MIN_DURATION_MS` | `1000`                  | Minimum time the "Checking eligibility…" screen stays up         |

## The journey

1. **What would you like to insure?** — products come from the carriers the API returns (Renters today).
2. **Checking eligibility…** — runs before any questions. Sam Lee (sample profile B) stops here with both reasons.
3. **One step per section** of the carrier's form (About you → Your home → Coverage → Pets → Claims history): answers
   from the profile are shown read-only with **Change**; only missing questions are asked.
4. **Review** → **Get quote** → **Quote request made**, with a _dev only_ box showing the exact JSON the carrier would receive.

Use the menu at the top right to **log in as** either sample customer (demo only — the cookie holds just
the customer id).

## How it's built

- **No business logic here.** Mapping, eligibility and validation live in the API; the web renders the form
  definition and field results it receives and shows the API's errors and reasons.
- **Schema-driven form:** one component per field type, so any carrier's form renders without new code.
  Amounts show as tiles, dates as a calendar (stored in the carrier's own format, e.g. `MM/DD/YYYY`),
  lists (state, breed) as dropdowns, multi-choice (pets) as a multi-select dropdown
  where "None" can't be combined with a pet.
- **Typed client:** `npm run gen:api` regenerates `src/lib/api-types.ts` from the API's `/openapi.json`, so a
  changed API shows up as a type error here.
- **Accessible:** real labels and fieldsets, errors linked to their fields, focus moved to each new step's
  heading and to error summaries, keyboard-friendly dropdowns, status messages announced to screen readers.
- **Responsive:** works from 375px phones up; no horizontal scrolling.

## Feature flags

Override in the URL with `?ff=`, e.g. `?ff=-eligibilityLoadingStep`.

| Flag                       | Default | Effect                                                              |
| -------------------------- | ------- | ------------------------------------------------------------------- |
| `eligibilityLoadingStep`   | on      | Show the "Checking eligibility…" screen                             |
| `showIneligibilityReasons` | on      | List every reason; off shows a generic message                      |
| `showCarrierRequest`       | on      | Show the _dev only_ box with the carrier's request after submitting |

## Tests

Jest + React Testing Library, in `tests/` (mirroring `src/`), written before each feature: the stepped
quote, eligibility screens, form fields (dropdowns, "None", calendar date picker), product picker, customer menu
and flags. API calls are passed in as stubs, so tests never hit the network.
