export async function safeJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    return null;
  }

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}
