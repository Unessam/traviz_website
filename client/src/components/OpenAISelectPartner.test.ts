import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (relativePath: string) =>
  readFile(new URL(relativePath, import.meta.url), "utf8");

const partnerUrl = "https://openai.com/business/partners/";
const badgeAlt = "OpenAI Select Partner badge";
const aboutCopy = "Traviz is an OpenAI Select Partner. We help organisations build, deploy and scale AI solutions responsibly and effectively. Model and tool choices are still made for each client's data, risk and workflow.";

test("the approved badge is copied without modification", async () => {
  const badge = await readFile(new URL("../../../attached_assets/OpenAI_Select_Partner_Badge.svg", import.meta.url));
  assert.equal(
    createHash("sha256").update(badge).digest("hex"),
    "312a3c4767dcf6a51eab6b73f49143a54dee60a88899f4b0b2ca448547efac86",
  );
});

test("the hero badge follows the CTAs and stays outside the stats strip", async () => {
  const hero = await readSource("./Hero.tsx");
  const cta = hero.indexOf('data-testid="button-secondary-cta"');
  const badge = hero.indexOf('data-testid="openai-select-partner-hero"');
  const stats = hero.indexOf('className="bg-cool-gray py-16"');

  assert.ok(cta < badge && badge < stats, "The badge must follow both CTAs and precede the stats strip");
  assert.ok(hero.includes(`href="${partnerUrl}"`));
  assert.ok(hero.includes('target="_blank"'));
  assert.ok(hero.includes('rel="noopener noreferrer"'));
  assert.ok(hero.includes(`alt="${badgeAlt}"`));
  assert.ok(hero.includes('className="inline-block bg-white p-5"'));
  assert.ok(hero.includes('className="h-auto w-[120px] sm:w-[140px]"'));
});

test("the homepage components contain exactly one partner badge in the Hero", async () => {
  const [hero, about, footer] = await Promise.all([
    readSource("./Hero.tsx"),
    readSource("./About.tsx"),
    readSource("./Footer.tsx"),
  ]);
  const badgeImages = [hero, about, footer].reduce(
    (count, source) => count + source.split(`alt="${badgeAlt}"`).length - 1,
    0,
  );

  assert.equal(badgeImages, 1);
  assert.ok(hero.includes("OpenAI_Select_Partner_Badge.svg"));
  assert.ok(!about.includes("OpenAI_Select_Partner_Badge.svg"));
  assert.ok(!footer.includes("OpenAI_Select_Partner_Badge.svg"));
});

test("the About and footer copy is exact and correctly placed", async () => {
  const [about, footer] = await Promise.all([
    readSource("./About.tsx"),
    readSource("./Footer.tsx"),
  ]);
  const experience = about.indexOf("Cross-sector Traviz delivery experience");
  const partnerBlock = about.indexOf('data-testid="openai-select-partner-about"');
  const principles = about.indexOf('className="grid gap-8 md:grid-cols-3"');

  assert.ok(experience < partnerBlock && partnerBlock < principles, "The partner block must follow the experience card");
  assert.ok(about.includes(aboutCopy));

  const description = footer.indexOf("Practical AI decisions, validated use cases and implementation plans for digital businesses.");
  const credential = footer.indexOf("Traviz Ltd is an OpenAI Select Partner.");
  const copyright = footer.indexOf("All rights reserved.");
  const trademark = footer.indexOf("OpenAI and the OpenAI logo are trademarks of OpenAI.");
  assert.ok(description < credential, "The credential must follow the footer description");
  assert.ok(copyright < trademark, "The trademark notice must follow the copyright");
});

test("OpenAI is absent from prohibited website areas", async () => {
  const [hero, navigation, index, sprint, sportsbook, caseStudies] = await Promise.all([
    readSource("./Hero.tsx"),
    readSource("./Navigation.tsx"),
    readSource("../../index.html"),
    readSource("../pages/AiOpportunityDataReadinessSprint.tsx"),
    readSource("../pages/CaseStudySportsbookChurnPrediction.tsx"),
    readSource("../pages/ApprovedCaseStudyPages.tsx"),
  ]);
  const headline = hero.slice(hero.indexOf("<h1"), hero.indexOf("</h1>") + 5);
  const stats = hero.slice(hero.indexOf('className="bg-cool-gray py-16"'));

  for (const [area, source] of Object.entries({ headline, stats, navigation, index, sprint, sportsbook, caseStudies })) {
    assert.ok(!source.includes("OpenAI"), `OpenAI must not appear in ${area}`);
  }
});

test("AGENTS.md points to the controlling brand rules", async () => {
  const agents = await readSource("../../../AGENTS.md");
  assert.ok(agents.includes("departments/marketing/brand/openai-select-partner/README.md"));
});
