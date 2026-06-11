{
  "identity": {
    "type": "tsl.identity.v1",
    "id": "did:tsl:test:alice",
    "controller": "did:tsl:test:alice",
    "created_at": "2026-05-25T00:00:00Z",
    "verification_methods": [
      {
        "id": "#test-key-1",
        "type": "ed25519",
        "public_key": "03a107bff3ce10be1d70dd18e74bc09967e4d6309ba50d5f1ddc8664125531b8",
        "status": "active",
        "created_at": "2026-05-25T00:00:00Z"
      }
    ]
  },
  "identities": [
    {
      "type": "tsl.identity.v1",
      "id": "did:tsl:relay:test",
      "controller": "did:tsl:relay:test",
      "created_at": "2026-05-25T00:00:00Z",
      "verification_methods": [
        {
          "id": "#relay-key-1",
          "type": "ed25519",
          "public_key": "29acbae141bccaf0b22e1a94d34d0bc7361e526d0bfe12c89794bc9322966dd7",
          "status": "active",
          "created_at": "2026-05-25T00:00:00Z"
        }
      ]
    }
  ],
  "envelope": {
    "type": "tsl.event_commitment.v1",
    "event_class": "message",
    "sender": "did:tsl:test:alice",
    "signing_key_id": "#test-key-1",
    "content_commitment": "0x50f62d6063e0d92d02fd4fdafb4b10c38bf271ebb5e14afd037d35b0b35f6b95",
    "timestamp": "2026-05-25T00:01:00Z",
    "nonce": "0x2222222222222222222222222222222222222222222222222222222222222222",
    "disclosure_policy": "commitment_only",
    "signature": "0xd3187ac9861b87a3b5f871c9ae9a6426ce0c1e49cee1978c767bf99eff6c94467b6955cd9821c2a7e3bfcf945b576e49d81deccb4e7c8b0624917fd794f1ff08"
  },
  "proof": {
    "type": "tsl.inclusion_proof.v1",
    "tree_kind": "event",
    "commitment": "0xcc680d3c19dbbb9785640355a4756a498fb887c643dc04ef304689955381251d",
    "leaf_index": 0,
    "leaf_hash": "0x2af3150c9d8e62aac337ef020e3f5d07a7529116e59eba6b152ffb3570e611d7",
    "root": "0x2af3150c9d8e62aac337ef020e3f5d07a7529116e59eba6b152ffb3570e611d7",
    "epoch_start_ms": 1779667200000,
    "epoch_duration_ms": 300000,
    "shard": "00af",
    "path": [],
    "checkpoint_hash": "0xa0c469bf369835c003888226faf94ac9f397916ca9bf02bad0162aa82541d524"
  },
  "checkpoint": {
    "type": "tsl.batch_checkpoint.v1",
    "epoch_start_ms": 1779667200000,
    "epoch_duration_ms": 300000,
    "shard": "00af",
    "event_root": "0x2af3150c9d8e62aac337ef020e3f5d07a7529116e59eba6b152ffb3570e611d7",
    "receipt_root": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "attestation_root": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "revocation_root": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "event_count": 1,
    "receipt_count": 0,
    "previous_checkpoint": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "relay_id": "did:tsl:relay:test",
    "relay_signature": "0x4f041ca3bd232a51f73addbfd2fee746f4ddca54a4d45a7a882d0de22592e5c9095fccc3a8ff74c112b4d131a0e34d0b9c60fcd6172e29613ede18972c1b170a"
  },
  "redaction_manifest": {
    "raw_content_included": false,
    "content_salt_included": false,
    "exact_counterparties_included": false,
    "metadata_fields_redacted": [
      "content_salt",
      "exact_counterparties",
      "private_graph",
      "private_metadata",
      "raw_content",
      "restricted_attestations"
    ]
  },
  "vector": {
    "public_key_hex": "03a107bff3ce10be1d70dd18e74bc09967e4d6309ba50d5f1ddc8664125531b8",
    "content_commitment_hex": "0x50f62d6063e0d92d02fd4fdafb4b10c38bf271ebb5e14afd037d35b0b35f6b95",
    "canonical_unsigned_event": "{\"content_commitment\":\"0x50f62d6063e0d92d02fd4fdafb4b10c38bf271ebb5e14afd037d35b0b35f6b95\",\"disclosure_policy\":\"commitment_only\",\"event_class\":\"message\",\"nonce\":\"0x2222222222222222222222222222222222222222222222222222222222222222\",\"sender\":\"did:tsl:test:alice\",\"signing_key_id\":\"#test-key-1\",\"timestamp\":\"2026-05-25T00:01:00Z\",\"type\":\"tsl.event_commitment.v1\"}",
    "event_hash_hex": "0xcf5cb36e4596ed4c446f2d24504407369a1fc4862928e86c340ec5270fcc3267",
    "signature_hex": "0xd3187ac9861b87a3b5f871c9ae9a6426ce0c1e49cee1978c767bf99eff6c94467b6955cd9821c2a7e3bfcf945b576e49d81deccb4e7c8b0624917fd794f1ff08",
    "commitment_hash_hex": "0xcc680d3c19dbbb9785640355a4756a498fb887c643dc04ef304689955381251d",
    "single_leaf_merkle_root_hex": "0x2af3150c9d8e62aac337ef020e3f5d07a7529116e59eba6b152ffb3570e611d7"
  }
}