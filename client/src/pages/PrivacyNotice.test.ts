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
    "one limited Apollo MCP company-first discovery pilot",
    "We check the organisation&apos;s identity and carry out our conflict screen before requesting personal information",
    "For no more than five selected organisations",
    "save an accepted record in Apollo and our internal CRM",
    "The pilot does not authorise us to contact that person",
    "reviewed within 12 months",
    "Removal Requests list at least every 30 days",
    "service providers and other recipients",
    "Apollo discovery-pilot contacts",
    "Cognition AI, Inc. (Devin)",
    "AI-assisted processing during the attended Apollo discovery pilot",
    "Exact model-provider retention and international-transfer safeguards must be confirmed",
    "This draft will not be approved or published until the exact Cognition/model-provider retention and transfer wording has received qualified review",
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
