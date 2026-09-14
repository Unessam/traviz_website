import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (relativePath: string) =>
  readFile(new URL(relativePath, import.meta.url), "utf8");

test("privacy notice v1.4 draft preserves v1.3 and adds the Apollo discovery-pilot wording", async () => {
  const page = await readSource("./PrivacyNotice.tsx");
  const requiredText = [
    "Version 1.4 — draft",
    "Proposed effective date: to be confirmed before publication",
    "Business-contact data obtained from third-party providers",
    "including Apollo.io (ZenLeads, Inc.)",
    "a provider-issued identifier",
    "compare it in memory and delete the person-level result immediately",
    "not used to contact you, make a decision about you, or add provider-supplied contact information to our CRM",
    "Apollo is based in the United States",
    "send a provider-issued identifier back to that provider solely to retrieve the corresponding business-contact record",
    "right to object to processing based on our legitimate interests",
    "Limited supplier-evaluation test",
    "Provider-supplied person-level results are deleted immediately",
    "one limited Apollo company-first discovery pilot",
    "official MCP connection through Devin",
    "Cognition&apos;s Devin service is used only for this organisation-level stage",
    "person-level results are technically unavailable to Devin",
    "exclude sole traders, person-identifying domains and any result containing natural-person information",
    "We verify the organisation, remove existing CRM duplicates, carry out our conflict screen and apply fixed company-ranking rules before requesting personal information",
    "For no more than five selected organisations",
    "an isolated local process may obtain up to ten current professional-role candidates",
    "Person-level Apollo results do not pass through Devin",
    "use those results only to count whether Apollo found a suitable role and verified work email, then discard them",
    "We do not create an Apollo contact, write the information to our CRM, contact the person",
    "delete that Apollo-derived record and downstream copies as soon as reasonably practicable",
    "30 days is the contractual outer limit",
    "Merely suppressing or ceasing active use does not count as deletion",
    "service providers and other recipients",
    "Apollo hybrid-pilot person results",
    "deleted immediately after the in-memory comparison and anonymous aggregate counting",
    "Only anonymous aggregate and sanitized control evidence is retained",
  ];

  for (const text of requiredText) {
    assert.ok(page.includes(text), `Missing reviewed privacy text: ${text}`);
  }

  assert.ok(!page.includes("We do not buy contact lists from data brokers"));
  assert.ok(!page.includes("We do not purchase personal data from data brokers"));
});

test("privacy notice is publicly routed and linked from the footer", async () => {
  const [app, footer] = await Promise.all([
    readSource("../App.tsx"),
    readSource("../components/Footer.tsx"),
  ]);

  assert.ok(app.includes('import PrivacyNotice from "@/pages/PrivacyNotice"'));
  assert.ok(app.includes('<Route path="/privacy" component={PrivacyNotice} />'));
  assert.ok(footer.includes('href="/privacy"'));
  assert.ok(footer.includes("Privacy Notice"));
});
