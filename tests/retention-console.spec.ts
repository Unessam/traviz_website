import { expect, test, type Page, type Route } from "@playwright/test";

const completedDryRun = {
  id: "dry-run-reviewed",
  requestedBy: "allowlisted-staff",
  referenceTime: "2026-08-26T12:00:00.000Z",
  dryRun: true,
  status: "completed",
  candidateFingerprint: "synthetic-candidate-snapshot",
  contactEligible: 2,
  usersEligible: 1,
  contactsDeleted: 0,
  usersAnonymized: 0,
  blockedByLegalHold: 0,
  skipped: 0,
  failureCode: null,
  createdAt: "2026-08-26T12:00:01.000Z",
  completedAt: "2026-08-26T12:00:02.000Z",
};

const preview = {
  referenceTime: "2026-08-26T12:00:00.000Z",
  contacts: { total: 3, eligible: 2, legalHold: 1, notDue: 0, missingTimestamp: 0 },
  users: { total: 2, eligible: 1, legalHold: 0, notDue: 1, missingTimestamp: 0, alreadyAnonymized: 0 },
};

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function mockAdminApi(page: Page, retentionAuthorized: boolean) {
  let runs: typeof completedDryRun[] = [];
  let dryRunPosts = 0;
  let liveRunPosts = 0;

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (path === "/api/auth/user") {
      return json(route, { id: "staff-user", email: "staff@example.test" });
    }

    if (path === "/api/admin/contact-submissions") {
      return retentionAuthorized
        ? json(route, [])
        : json(route, { message: "Retention authorization required" }, 403);
    }

    if (path.startsWith("/api/admin/retention/")) {
      if (!retentionAuthorized) {
        return json(route, { message: "Retention authorization required" }, 403);
      }
      if (path === "/api/admin/retention/runs" && request.method() === "POST") {
        const body = request.postDataJSON() as { dryRun?: boolean };
        if (body.dryRun !== true) {
          liveRunPosts += 1;
          return json(route, { message: "Live retention is forbidden in UI regression tests" }, 500);
        }
        dryRunPosts += 1;
        runs = [completedDryRun];
        return json(route, completedDryRun);
      }
      if (path === "/api/admin/retention/runs") return json(route, runs);
      if (path === "/api/admin/retention/preview") return json(route, preview);
      if (path === "/api/admin/retention/audit-events") return json(route, []);
    }

    const emptyCollections = new Set([
      "/api/services",
      "/api/products",
      "/api/case-studies",
      "/api/testimonials",
      "/api/admin/blog-posts",
      "/api/resources",
    ]);
    if (emptyCollections.has(path)) return json(route, []);
    if (path === "/api/stats") {
      return json(route, { yearsExperience: 7, hoursSavedAnnually: 1000, industryProjectsCount: "Multiple" });
    }
    if (path === "/api/hero" || path === "/api/about") return json(route, {});

    return json(route, { message: `Unexpected test request: ${request.method()} ${path}` }, 501);
  });

  return {
    dryRunPosts: () => dryRunPosts,
    liveRunPosts: () => liveRunPosts,
  };
}

test("non-allowlisted staff cannot see retention or contact-submission data", async ({ page }) => {
  const requests = await mockAdminApi(page, false);

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
  await expect(page.getByTestId("retention-console")).toHaveCount(0);
  await expect(page.getByText(/Contact Submissions/)).toHaveCount(0);
  await expect(page.locator('[data-testid^="submission-"]')).toHaveCount(0);
  expect(requests.dryRunPosts()).toBe(0);
  expect(requests.liveRunPosts()).toBe(0);
});

test("allowlisted staff can create and select a dry run while the live gate stays exact", async ({ page }) => {
  const requests = await mockAdminApi(page, true);

  await page.goto("/admin");
  const console = page.getByTestId("retention-console");
  const liveButton = page.getByTestId("button-submit-live-run");
  const confirmation = page.getByTestId("input-live-confirmation");

  await expect(console).toBeVisible();
  await expect(page.getByTestId("retention-preview")).toBeVisible();
  await expect(liveButton).toBeDisabled();

  await page.getByTestId("button-create-dry-run").click();
  await expect(page.getByText("Dry run created", { exact: true })).toBeVisible();
  await expect(page.getByTestId(`retention-run-${completedDryRun.id}`)).toBeVisible();
  await expect(page.getByTestId("select-reviewed-dry-run")).toContainText(/3 eligible/);
  expect(requests.dryRunPosts()).toBe(1);

  await confirmation.fill("apply_retention");
  await expect(liveButton).toBeDisabled();
  await confirmation.fill("APPLY_RETENTION ");
  await expect(liveButton).toBeDisabled();
  await confirmation.fill("APPLY_RETENTION");
  await expect(liveButton).toBeEnabled();

  // Deliberately do not click: the route guard also fails the test if a live POST occurs.
  expect(requests.liveRunPosts()).toBe(0);
});