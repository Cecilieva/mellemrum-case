import { safeJsonResponse } from "../utils/safeJson";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export async function supabaseRequest(path, options = {}) {
  if (!SUPABASE_URL || !import.meta.env.VITE_SUPABASE_APIKEY) {
    throw new Error("Supabase configuration is missing");
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Supabase request failed");
  }

  const data = await safeJsonResponse(response);
  if (data === null) {
    throw new Error("Supabase returned an invalid response");
  }

  return data;
}
