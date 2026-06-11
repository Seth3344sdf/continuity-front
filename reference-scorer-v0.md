/* ====================================================================
   TSL lexicon — translate every backend enum/code to plain English.
   Sources: TrustAssessmentV2.label (12), VerificationResult.risk_label,
   VerificationChecks keys, reason_codes / risk_codes, settlement_status.
   Never show a raw enum to the user. Unknowns are humanized, not dropped.
   ==================================================================== */
(function (T) {
  'use strict';

  /* score band thresholds (mirror packages/core-ts/src/scoring.ts) */
  T.bandForScoreBps = function (bps) {
    var s = Math.max(0, Math.min(10000, bps)) / 100;
    if (s >= 90) return 'trusted'; if (s >= 75) return 'likely_trusted'; if (s >= 55) return 'medium_trust';
    if (s >= 35) return 'unknown_caution'; if (s >= 15) return 'suspicious'; return 'high_risk';
  };

  /* every TrustAssessmentV2.label + risk_label → headline, band, tone */
  T.LABELS = {
    trusted:               { tone: 'trust',   headline: 'Real and consistent — a long, genuine history.' },
    likely_trusted:        { tone: 'trust',   headline: 'Real and consistent over time.' },
    medium_trust:          { tone: 'medium',  headline: 'Some real history, still building trust.' },
    unknown_caution:       { tone: 'caution', headline: 'Too little history to trust yet.' },
    insufficient_evidence: { tone: 'caution', headline: 'Not enough evidence to judge — nothing to trust yet.' },
    suspicious:            { tone: 'risk',    headline: 'Looks manufactured — almost no real history.' },
    high_risk:             { tone: 'risk',    headline: 'Almost certainly fake or hostile.' },
    cryptographic_failure: { tone: 'risk',    headline: 'The cryptography did not check out — this proof is not genuine.' },
    revoked_or_compromised:{ tone: 'risk',    headline: 'This identity’s key was cancelled — do not trust anything signed with it.' },
    settlement_missing:    { tone: 'caution', headline: 'Not yet anchored on-chain — settlement unconfirmed.' },
    unsettled_or_unproven: { tone: 'caution', headline: 'Not yet anchored or proven — treat as unconfirmed.' },
    delegation_missing:    { tone: 'caution', headline: 'An agent acted without valid delegated authority.' },
    not_assessed:          { tone: 'medium',  headline: 'Verified, but no trust score was issued.' }
  };
  T.TONE_BAND = { trust: 'trusted', medium: 'medium_trust', caution: 'unknown_caution', risk: 'high_risk' };
  T.labelInfo = function (label) { return T.LABELS[label] || { tone: 'medium', headline: T.humanize(label) }; };

  /* VerificationChecks keys → plain pass / fail text */
  T.CHECKS = {
    schema_valid:            ['Proof is well-formed', 'Proof is malformed'],
    signature_valid:         ['Signature is genuine', 'Signature is forged or altered'],
    key_found:               ['Signing key is known', 'Signing key is unknown'],
    key_active:              ['Key was active when this was signed', 'Key was not active when signed'],
    not_revoked:             ['Key has not been cancelled', 'Key has been cancelled (revoked)'],
    content_commitment_matches: ['Content matches its commitment', 'Content does not match its commitment'],
    included_in_log:         ['Recorded in the public log', 'Not found in the public log'],
    checkpoint_valid:        ['Anchored to a valid checkpoint', 'Checkpoint is invalid'],
    checkpoint_matches_proof:['Checkpoint matches the proof', 'Checkpoint does not match the proof'],
    checkpoint_settled:      ['Settled on-chain', 'Not settled on-chain'],
    checkpoint_signature_valid: ['Checkpoint is signed by the log', 'Checkpoint signature invalid'],
    settlement_evidence_valid:['Settlement evidence checks out', 'Settlement evidence is invalid'],
    receipt_valid:           ['Two-way receipts are genuine', 'Receipts are invalid'],
    receipt_included:        ['Receipts are in the log', 'Receipts not in the log'],
    attestation_valid:       ['Endorsements are genuine', 'Endorsements are invalid'],
    attestation_included:    ['Endorsements are in the log', 'Endorsements not in the log'],
    revocation_state_valid:  ['Revocation state is consistent', 'Revocation state is inconsistent'],
    revocation_included:     ['Revocation is recorded', 'Revocation not recorded'],
    assessment_valid:        ['Trust assessment is signed and valid', 'Trust assessment failed to verify'],
    trust_assessment_v2_valid:['Trust score is signed and valid', 'Trust score failed to verify'],
    provider_active:         ['Scoring provider is active', 'Scoring provider is not active'],
    model_registered:        ['Scoring model is registered', 'Scoring model is not registered'],
    chain_revocation_checked:['On-chain revocation checked', 'On-chain revocation not checked'],
    zk_valid:                ['Zero-knowledge proofs check out', 'Zero-knowledge proof is invalid'],
    agent_scope_valid:       ['Agent acted within its delegated scope', 'Agent acted outside its delegated scope'],
    delegated_action_valid:  ['Delegated action is authorized', 'Delegated action is not authorized'],
    audit_consistency_valid: ['Audit log is consistent', 'Audit log is inconsistent'],
    consistency_proof_valid: ['Log consistency proof checks out', 'Log consistency proof invalid'],
    non_membership_proof_valid:['Non-membership proof checks out', 'Non-membership proof invalid'],
    scoring_profile_valid:   ['Scoring profile is valid', 'Scoring profile is invalid'],
    domain_policy_valid:     ['Domain policy is satisfied', 'Domain policy is not satisfied'],
    evidence_coverage_valid: ['Evidence coverage is valid', 'Evidence coverage is invalid'],
    redaction_manifest_valid:['Redaction manifest is valid', 'Redaction manifest is invalid'],
    disclosure_consent_valid:['Disclosure consent is valid', 'Disclosure consent is invalid'],
    metadata_fingerprint_valid:['Metadata fingerprints check out', 'Metadata fingerprints invalid'],
    sybil_assessment_valid:  ['Sybil assessment is valid', 'Sybil assessment is invalid'],
    drift_report_valid:      ['Behaviour-drift report is valid', 'Behaviour-drift report is invalid']
  };
  T.checkText = function (key, pass) { var c = T.CHECKS[key]; if (c) return pass ? c[0] : c[1]; return T.humanize(key); };

  /* reason_codes / risk_codes → one plain sentence */
  T.CODES = {
    reciprocal_receipt_count_low: 'Almost no real two-way history',
    reciprocal_receipt_count_high: 'Strong two-way history with others',
    unique_counterparty_count_low: 'Connected to very few distinct people',
    unique_counterparty_count_high: 'Connected to many distinct people',
    identity_age_low: 'Created very recently',
    identity_age_high: 'Long-lived identity',
    trusted_neighbor_ratio_low: 'Few trusted accounts vouch for it',
    trusted_neighbor_ratio_high: 'Sits inside the trusted core',
    cluster_concentration_high: 'Vouches come from a tight, inbred cluster',
    sybil_risk_high: 'Looks like a coordinated fake-account cluster',
    dormant_reactivation: 'Dormant account that suddenly reactivated',
    outbound_burst: 'Sudden burst of outbound activity',
    revocation_present: 'A key was revoked',
    revoked_or_compromised: 'A signing key was cancelled or compromised',
    attestation_quality_low: 'Endorsements are weak or unproven',
    attestation_quality_high: 'Endorsed by high-quality issuers',
    temporal_consistency_low: 'Activity pattern is erratic',
    insufficient_evidence: 'Not enough evidence to assess',
    settlement_missing: 'Not anchored on-chain yet',
    delegation_missing: 'No valid delegation for this action',
    coverage_insufficient: 'Evidence coverage is insufficient',
    drift_detected: 'Behaviour drifted from its established pattern'
  };
  T.codeText = function (code) {
    if (T.CODES[code]) return T.CODES[code];
    if (/^TSL_/.test(String(code))) return T.errorText(code); // canonical error codes used as reason codes
    return T.humanize(code);
  };

  /* settlement_status */
  T.SETTLEMENT = {
    not_required: 'Settlement not required', pending: 'Settlement pending',
    settled: 'Settled on-chain', unavailable: 'Settlement layer unavailable', mismatch: 'Settlement mismatch'
  };
  T.settlementText = function (s) { return T.SETTLEMENT[s] || T.humanize(s || ''); };

  /* canonical TSL_* error-code registry (spec §49.6) → plain meaning + retryability */
  T.ERRORS = {
    TSL_SCHEMA_INVALID:               { t: 'The proof object is malformed or unsupported.', retry: false },
    TSL_CANONICALIZATION_FAILED:      { t: 'The object cannot be serialized deterministically.', retry: false },
    TSL_UNSUPPORTED_OBJECT_VERSION:   { t: 'This verifier does not support the object version.', retry: false },
    TSL_UNKNOWN_REQUIRED_FIELD:       { t: 'A required field is unknown or outside an extension namespace.', retry: false },
    TSL_SIGNATURE_INVALID:            { t: 'The signature does not match the claimed key.', retry: false },
    TSL_KEY_NOT_FOUND:                { t: 'The signing key is not registered for this identity.', retry: true },
    TSL_KEY_EXPIRED:                  { t: 'The signing key had expired at the relevant time.', retry: false },
    TSL_KEY_REVOKED:                  { t: 'The key was revoked before the relevant event time.', retry: false },
    TSL_REVOCATION_STATE_STALE:       { t: 'Revocation state is too old for the verifier policy.', retry: true },
    TSL_NONCE_REPLAY:                 { t: 'This sender/key/nonce was already accepted (possible replay).', retry: false },
    TSL_TIMESTAMP_OUT_OF_WINDOW:      { t: 'The timestamp is outside relay acceptance policy.', retry: true },
    TSL_INCLUSION_INVALID:            { t: 'The Merkle proof does not match the checkpoint root.', retry: false },
    TSL_CHECKPOINT_INVALID:           { t: 'The checkpoint signature or hash is invalid.', retry: false },
    TSL_CHECKPOINT_CONFLICT:          { t: 'Conflicting roots exist for the same epoch and shard.', retry: false },
    TSL_SETTLEMENT_MISSING:           { t: 'Settlement is missing but required by policy.', retry: true },
    TSL_PROOF_BUNDLE_REDACTED:        { t: 'Some private fields were intentionally redacted.', retry: false },
    TSL_DISCLOSURE_CONSENT_REQUIRED:  { t: 'More disclosure requires explicit consent.', retry: false },
    TSL_INSUFFICIENT_EVIDENCE:        { t: 'The scorer abstained because evidence coverage is too low.', retry: true },
    TSL_PROVIDER_INACTIVE:            { t: 'The scoring provider is not active under verifier policy.', retry: true },
    TSL_MODEL_NOT_REGISTERED:         { t: 'The referenced model version is not registered.', retry: true },
    TSL_MODEL_EXPIRED:                { t: 'The assessment expired and should be refreshed.', retry: true },
    TSL_ASSESSMENT_SIGNATURE_INVALID: { t: 'The assessment signature is invalid.', retry: false },
    TSL_NEGATIVE_CLAIM_APPEALED:      { t: 'A negative claim exists but has active appeal context.', retry: false },
    TSL_DELEGATION_MISSING:           { t: 'No valid principal authorization was provided.', retry: true },
    TSL_DELEGATION_EXPIRED:           { t: 'The action occurred outside the delegated time window.', retry: false },
    TSL_DELEGATION_REVOKED:           { t: 'The principal revoked the delegation before the action.', retry: false },
    TSL_DELEGATION_SCOPE_VIOLATION:   { t: 'The action is outside the delegated scope.', retry: false },
    TSL_DELEGATION_CONSTRAINT_VIOLATION: { t: 'Amount, tool, counterparty, rate, or approval constraints failed.', retry: false },
    TSL_PROOF_BUNDLE_INVALID:         { t: 'The proof bundle failed schema validation.', retry: false },
    TSL_REDACTION_MANIFEST_INVALID:   { t: 'The redaction manifest is missing or malformed.', retry: false },
    TSL_CHECKPOINT_SIGNATURE_INVALID: { t: 'The checkpoint is not signed by a known relay.', retry: false },
    TSL_UNSAFE_FIXTURE_POLICY_ENABLED:{ t: 'Unsafe test-fixture flags are enabled on a mainnet profile.', retry: false },
    /* implementation codes the reference verifier also emits */
    TSL_KEY_INACTIVE:                 { t: 'The key was not active at the relevant time.', retry: false },
    TSL_REVOCATION_SIGNATURE_INVALID: { t: 'A revocation record carries an invalid signature.', retry: false },
    TSL_CONTENT_COMMITMENT_MISMATCH:  { t: 'The disclosed content does not match its commitment.', retry: false },
    TSL_CHECKPOINT_MISSING:           { t: 'No checkpoint was provided but one is required.', retry: true },
    TSL_CHECKPOINT_CHAIN_BROKEN:      { t: 'The checkpoint chain does not link to its predecessor.', retry: false },
    TSL_AGENT_SCOPE_INVALID:          { t: 'The agent action is outside its delegated scope.', retry: false },
    TSL_AGENT_ACTION_SIGNATURE_INVALID:{ t: 'The agent action signature is invalid.', retry: false },
    TSL_DELEGATION_VALUE_LIMIT_EXCEEDED:{ t: 'The action exceeds the delegated value limit.', retry: false },
    TSL_HUMAN_APPROVAL_REQUIRED:      { t: 'This action requires explicit human approval.', retry: true },
    TSL_ATTESTATION_INVALID:          { t: 'An endorsement failed to verify.', retry: false },
    TSL_RECEIPT_INVALID:              { t: 'A two-way receipt failed to verify.', retry: false },
    TSL_EVIDENCE_COVERAGE_INVALID:    { t: 'The evidence coverage object failed to verify.', retry: false },
    TSL_PROOF_BUNDLE_IDENTITY_MISMATCH:{ t: 'The bundle identity does not match the envelope sender.', retry: false }
  };
  T.errorText = function (code) {
    var e = T.ERRORS[String(code)];
    if (e) return e.t;
    // unknown TSL_* code → readable sentence case, never shouting caps
    if (/^TSL_/.test(String(code))) {
      var s = String(code).replace(/^TSL_/, '').toLowerCase().replace(/_/g, ' ');
      return s.charAt(0).toUpperCase() + s.slice(1) + '.';
    }
    // schema validator lines like "/ must have required property 'type'" pass through
    return String(code);
  };
  T.errorRetryable = function (code) { var e = T.ERRORS[String(code)]; return e ? e.retry : false; };

  /* evidence coverage → plain rows */
  T.coverageLabel = { insufficient: 'insufficient', low: 'low', medium: 'medium', high: 'high' };

  T.humanize = function (code) {
    if (!code) return '';
    return String(code).replace(/_/g, ' ').replace(/\bbps\b/g, '').replace(/^./, function (c) { return c.toUpperCase(); }).trim();
  };

})(window.TSL);
