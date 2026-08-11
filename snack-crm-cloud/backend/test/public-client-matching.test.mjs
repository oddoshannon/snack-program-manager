import assert from "node:assert/strict";
import { test } from "node:test";
import { findPublicClientMatch, normalizedPublicPhone, publicClientMatchReview } from "../routes/public-booking.js";

const existing = [
  {
    client: {
      id: "client-1",
      firstName: "Avery",
      lastName: "Rivera",
      dateOfBirth: "2015-05-14",
      phone: "(503) 555-0101",
      email: "family@example.org"
    }
  }
];

test("public booking matches one existing client using name and birthdate", () => {
  const match = findPublicClientMatch(existing, {
    firstName: " avery ",
    lastName: "RIVERA",
    dateOfBirth: "2015-05-14"
  }, {});
  assert.equal(match?.client.id, "client-1");
});

test("public booking uses caregiver contact only when birthdate is missing", () => {
  assert.equal(findPublicClientMatch(existing, {
    firstName: "Avery",
    lastName: "Rivera"
  }, { phone: "503-555-0101" })?.client.id, "client-1");
  assert.equal(findPublicClientMatch(existing, {
    firstName: "Avery",
    lastName: "Rivera"
  }, { phone: "503-555-9999" }), null);
  assert.equal(normalizedPublicPhone("+1 (503) 555-0101"), "5035550101");
});

test("public booking refuses ambiguous or already-used client matches", () => {
  const duplicate = [{ ...existing[0] }, { client: { ...existing[0].client, id: "client-2" } }];
  assert.equal(findPublicClientMatch(duplicate, existing[0].client, {}), null);
  assert.equal(findPublicClientMatch(existing, existing[0].client, {}, new Set(["client-1"])), null);
});

test("public booking identifies same-name records for visible staff review", () => {
  const review = publicClientMatchReview(existing, {
    firstName: "Avery",
    lastName: "Rivera",
    dateOfBirth: "2016-05-14"
  }, { phone: "503-555-9999" });

  assert.equal(review.match, null);
  assert.equal(review.reviewRequired, true);
  assert.deepEqual(review.possibleMatches.map(({ client }) => client.id), ["client-1"]);
  assert.match(review.reviewReason, /same name/);
});

test("public booking marks a truly new name for confirmation without claiming a duplicate", () => {
  const review = publicClientMatchReview(existing, {
    firstName: "Jordan",
    lastName: "Rivera"
  }, { phone: "503-555-9999" });

  assert.equal(review.match, null);
  assert.equal(review.reviewRequired, true);
  assert.deepEqual(review.possibleMatches, []);
  assert.match(review.reviewReason, /No existing CRM client/);
});
