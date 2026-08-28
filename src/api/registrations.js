import { supabaseRequest } from "./supabase";

export function getRegistrations() {
  return supabaseRequest("/registrations?order=createdAt.desc");
}

export function createRegistration(registration) {
  return supabaseRequest("/registrations", {
    method: "POST",
    body: JSON.stringify(registration),
  });
}
