/**
 * Extract the base URL from an Azure DevOps organization URL
 *
 * @param organizationUrl The organization URL (e.g., https://dev.azure.com/org-name)
 * @returns The base URL (e.g., https://dev.azure.com)
 * @throws {Error} If the URL format is invalid
 */
export function getBaseUrl(organizationUrl: string): string {
  const match = organizationUrl.match(/(https?:\/\/[^/]+)/);
  if (!match) {
    throw new Error('Invalid organization URL format');
  }
  return match[1];
}
