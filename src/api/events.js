import { supabaseRequest } from "./supabase";

export function getEvents() {
  return supabaseRequest("/events?order=date.asc");
}

export async function getEvent(eventId) {
  const events = await supabaseRequest(
    `/events?id=eq.${encodeURIComponent(eventId)}`,
  );

  return Array.isArray(events) ? (events[0] ?? null) : null;
}
