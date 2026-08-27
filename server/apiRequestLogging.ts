const CONTACT_RESPONSE_PATHS = [
  "/api/contact",
  "/api/admin/contact-submissions",
];

export function shouldLogApiResponseBody(path: string): boolean {
  return !CONTACT_RESPONSE_PATHS.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  );
}