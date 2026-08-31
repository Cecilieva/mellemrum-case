import { useCallback, useState } from "react";
import { Link, useParams } from "react-router";
import { getEvent } from "../api/events";
import { createRegistration } from "../api/registrations";
import AsyncState from "../components/AsyncState";
import useAsyncData from "../hooks/useAsyncData";

export default function EventPage() {
  const { eventId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  const loadEvent = useCallback(() => getEvent(eventId), [eventId]);
  const { data: event, isLoading, hasError, retry } = useAsyncData(loadEvent);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();

    if (!event) {
      return;
    }

    setIsSubmitting(true);
    setFormMessage("");
    setFormError("");

    try {
      await createRegistration({
        name,
        email,
        status: "Ny",
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.venueName,
      });

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
      <main className="event-page">
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
            onRetry={retry}
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
    </>
  );
}
