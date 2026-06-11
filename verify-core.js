# TSL Web Verifier (reference frontend)

A vanilla-JS reference client for the Trust Signature Layer. Every checkmark
it renders comes from the real `verifyTSL` engine, compiled to run in the
browser (`verifier.bundle.js`). **No verification result is ever faked.**

> DEV PREVIEW — not production, not audited.

## Run it

From the repository root:

```sh
npm run web-verifier        # builds verifier.bundle.js, serves on :8090
```

or, with no build step (serves the prebuilt bundle):

```sh
node _wv_serve.cjs 8090
```

Open http://localhost:8090. Routes: `#/verify`, `#/network`, `#/passport`,
`#/agents`, and the proof viewer `#/p/<payload>` (also reachable as
`/p/<payload>` server-side).

## DEMO vs LIVE

The app always performs **real cryptographic verification in the browser**.
The badge in the top bar shows which data mode it is in:

- **DEMO FIXTURES** — no backend detected. Verification runs against bundled
  fixtures (`public/fixtures/`), which are real outputs of the reference CLI
  (`npm run demo`); the revoked fixture genuinely fails.
- **LIVE** — backend services reachable. Every verification is additionally
  cross-checked against the hosted verifier API with the *same* policy, and
  the verdict card shows **backend agrees / disagrees**.

To go LIVE, start (in separate terminals, repo root):

```sh
npm run verifier            # verifier-api    on :8083  (POST /v1/verify)
npm run resolver            # resolver-node   on :8082  (GET /v1/identity/:id, /v1/revocation/:id)
```

and, for the "Request a trust score" flow, the scoring provider in dev mode —
it requires all three env vars:

```powershell
$env:TSL_SCORING_PROVIDER_SEED_HEX = '<any 64 hex chars>'   # signs assessments
$env:TSL_SCORING_PERSISTENCE      = 'memory'                # no Postgres needed
$env:TSL_DEV_SCORING_INPUTS       = 'true'                  # bypass production governance gates
npm run scoring-provider                                    # :8084
```

Service URLs live in `public/js/config.js`.

## Proof links

Two forms, handled transparently by the proof viewer:

- **Short (preferred):** `/p/<bundle_id>` — the bundle is stored via
  `POST /v1/proof-bundles` (spec §49.2) and fetched back by ID. Both bundled
  servers implement the store (`data/proof-bundles/`, gitignored).
- **Inline (fallback):** `/p/<base64url-bundle>` — self-contained, works with
  no backend at all (e.g. file://), but multi-KB URLs may be truncated by
  some chat apps.

`tsl://proof/<payload>` and raw pasted JSON are also accepted on `#/verify`.

## What is real vs illustrative

Real cryptography (the same code paths the backend runs):

- **All verification** — schema, signature, key state, revocation, Merkle
  inclusion, checkpoint signature, receipts + receipt inclusion, disclosure
  consent, content commitment. Tamper with one byte and it genuinely fails.
- **Passport** — real Ed25519 seed, real identity document, real signed
  envelopes / relay-signed checkpoints / inclusion proofs, real signed
  `tsl.revocation.v1` (with honest semantics: pre-revocation proofs stay
  valid, post-revocation signatures fail), real signed disclosure consents.
- **Co-signed receipts** — friend personas hold real keys and sign real
  `tsl.receipt_commitment.v1` objects, anchored in the checkpoint's receipt
  tree with per-receipt inclusion proofs.
- **Trust assessments (LIVE)** — real signed `TrustAssessmentV2` from the
  scoring provider; an abstention (`insufficient_evidence`) is a real,
  signed result. Bundles are re-sealed before being sent to the provider.
- **Fixtures** — actual CLI outputs; the demo-fixture disclosure uses the
  public compliance-vector seed to sign a real consent in the browser.

Illustrative (clearly labelled in the UI):

- The Network view's base topology (alice, bank, carol, …) is demo data —
  though counterparties from your passport's **real receipts** are added as
  real edges.
- The Agents view's delegation scopes/actions are sample data; the
  authorization logic and failure codes mirror the verifier exactly.

The passport persists in `localStorage` (`tsl.passport.v1`) so continuity
survives refreshes. Dev preview only: the seed is stored unencrypted —
production clients use encrypted storage / passkeys (spec §12).

## Tests

```sh
npx vitest run clients/web-verifier/src/browser-entry.test.ts
```

Pins the in-browser proof creator to the CLI compliance vector
(byte-identical envelope/checkpoint), and asserts verify-green,
revoked-red, and receipt-anchoring-with-consent behavior.
