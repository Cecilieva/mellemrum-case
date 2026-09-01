import { supabaseRequest } from "./supabase";

export async function upsertUser({ name, email }) {
  const users = await supabaseRequest("/users?on_conflict=email", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    }),
  });

  return users[0];
}
