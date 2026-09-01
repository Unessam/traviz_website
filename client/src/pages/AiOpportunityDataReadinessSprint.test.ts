import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const route = "/services/ai-opportunity-data-readiness-sprint";

const readSource = (relativePath: string) =>
  readFile(new URL(relativePath, import.meta.url), "utf8");

test("the sprint page contains the approved public terms and boundaries", async () => {
  const page = await readSource("./AiOpportunityDataReadinessSprint.tsx");

  const approvedTerms = [
    "£4,500 excluding VAT",
    "Ten business days over two calendar weeks",
    "Remote",
    "50% on booking; 50% on delivery",
    "The full sprint fee is credited against a fixed-scope implementation if it is signed within 30 days of sprint delivery.",
    "The credit is applied against the later implementation price. It is not a cash refund. There is no approved extension to the 30-day credit period.",
  ];

  const approvedDeliverables = [
    "Data-quality and availability scorecard.",
    "Agreed KPI, target-definition, and labelling rules.",
    "Baseline opportunity analysis.",
    "Prioritised implementation roadmap.",
    "Fixed-scope implementation proposal.",
  ];

  const approvedExclusions = [
    "Implementation or deployment.",
    "Production changes.",
    "Ongoing monitoring.",
    "24/7 support.",
    "Data remediation.",
    "Work outside the five deliverables.",
  ];

  for (const term of [...approvedTerms, ...approvedDeliverables, ...approvedExclusions]) {
    assert.ok(page.includes(term), `Missing approved page copy: ${term}`);
  }

  assert.ok(
    page.includes("It does not warrant retention, ROI, revenue, or model performance."),
    "The approved no-warranty boundary must be explicit",
  );
  assert.ok(
    page.includes("Personal data is excluded unless it is separately justified and approved through the separately approved route."),
    "The approved personal-data boundary must be explicit",
  );
  assert.ok(page.includes("priority business opportunity"), "The sprint must support more than retention use cases");
  assert.ok(page.includes("AI or automation solution"), "The sprint must cover AI and automation opportunities");
  assert.ok(!page.includes("retention decisions"), "The sprint must not be positioned as retention-only");
});

test("the sprint page has a public route and visible landing-page navigation", async () => {
  const [app, services, footer, hero, navigation] = await Promise.all([
    readSource("../App.tsx"),
    readSource("../components/Services.tsx"),
    readSource("../components/Footer.tsx"),
    readSource("../components/Hero.tsx"),
    readSource("../components/Navigation.tsx"),
  ]);

  assert.ok(app.includes(`<Route path="${route}"`), "The sprint route must be registered");
  assert.ok(services.includes(`href: "${route}"`), "The services section must link to the sprint page");
  assert.ok(services.includes("fixed-scope implementation proposal."), "The service summary must use the approved final deliverable");
  assert.ok(!services.includes("fixed-scope implementation decision."), "The replaced draft deliverable must not remain");
  assert.ok(footer.includes(`href="${route}"`), "The footer service navigation must link to the sprint page");
  assert.ok(hero.includes(`href="${route}"`), "The landing-page hero must link to the sprint page");
  assert.ok(hero.includes("View sprint details"), "The landing-page hero must name the sprint link");
  assert.ok(navigation.includes(`href: "${route}"`), "The main navigation must link to the sprint page");
  assert.ok(navigation.includes("Readiness Sprint"), "The main navigation must name the sprint link");
});
