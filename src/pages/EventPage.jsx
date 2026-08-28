import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { safeJsonResponse } from "../utils/safeJson";
import { AsyncState } from "../components/AsyncState";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function getEvent() {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(
          `${SUPABASE_URL}/events?id=eq.${eventId}`,
          {
            headers,
          },
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await safeJsonResponse(response);
        if (!Array.isArray(data)) {
          throw new Error("Invalid response");
        }

        setEvent(data[0] ?? null);
      } catch {
        setEvent(null);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getEvent();
  }, [eventId, reloadKey]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();

    if (!event) {
      return;
    }

    setIsSubmitting(true);
    setFormMessage("");
    setFormError("");

    try {
      const response = await fetch(`${SUPABASE_URL}/registrations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          email,
          status: "Ny",
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.venueName,
        }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke oprette tilmeldingen.");
      }

      setName("");
      setEmail("");
      setFormMessage("Du er nu tilmeldt eventet.");
    } catch {
      setFormError("Der skete en fejl. Prøv igen om lidt.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || hasError || !event) {
    return (
      <main className="event-page state-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>
        {isLoading && (
          <AsyncState
            type="loading"
            title="Henter event..."
            message="Vi gør siden klar."
          />
        )}
        {hasError && (
          <AsyncState
            type="error"
            title="Eventet kunne ikke hentes"
            message="Der opstod et problem. Prøv igen om lidt."
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        )}
        {!isLoading && !hasError && (
          <AsyncState
            type="not-found"
            title="Eventet blev ikke fundet"
            message="Eventet findes ikke længere eller har aldrig været oprettet."
          />
        )}
      </main>
    );
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                value={name}
                required
                disabled={isSubmitting}
                autoComplete="name"
                onChange={(inputEvent) => setName(inputEvent.target.value)}
              />
            </label>
            <label>
              E-mail
              <input
                value={email}
                required
                disabled={isSubmitting}
                type="email"
                autoComplete="email"
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                placeholder="dig@example.com"
              />
            </label>
            {formMessage && (
              <p className="form-message" role="status">
                {formMessage}
              </p>
            )}
            {formError && (
              <p className="form-message" role="alert">
                {formError}
              </p>
            )}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Tilmelder..." : "Tilmeld mig"}
            </button>
          </form>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-brand">
              mellemrum<span>.</span>
            </p>
            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <p className="footer-heading">Udforsk</p>
              <Link to="/">Events</Link>
              <Link to="/om">Om Mellemrum</Link>
            </div>
            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>
              <Link to="/tilmeldinger">Se tilmeldinger</Link>
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© 2025 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
