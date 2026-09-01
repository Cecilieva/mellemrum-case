import { supabaseRequest } from "./supabase";

export function getRegistrations() {
  return supabaseRequest(
    "/registrations?select=id,createdAt,status,userId,eventId,users(name,email),events(title,date)&order=createdAt.desc",
  );
}

export function createRegistration({ userId, eventId, status }) {
  return supabaseRequest("/registrations", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({ userId, eventId, status }),
  });
}
