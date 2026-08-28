import { useEffect, useState } from "react";
import { Link } from "react-router";
import { safeJsonResponse } from "../utils/safeJson";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [sortBy, setSortBy] = useState("eventDate");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadRegistrations() {
      setIsLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `${SUPABASE_URL}/registrations?select=*,events(title,date)&order=createdAt.desc`,
          { headers },
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await safeJsonResponse(response);
        if (!Array.isArray(data)) {
          throw new Error("Invalid response");
        }

        setRegistrations(data);
        setRegistrationCount(data.length);
      } catch {
        setRegistrations([]);
        setRegistrationCount(0);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadRegistrations();
  }, [reloadKey]);

  const registrationsByEvent = registrations.reduce((counts, registration) => {
    const eventId = registration.eventId ?? registration.eventTitle;
    counts[eventId] = (counts[eventId] ?? 0) + 1;
    return counts;
  }, {});

  const sortedRegistrations = [...registrations].sort((first, second) => {
    const firstValue =
      sortBy === "eventDate"
        ? (first.events?.date ?? first.eventDate)
        : first.createdAt;
    const secondValue =
      sortBy === "eventDate"
        ? (second.events?.date ?? second.eventDate)
        : second.createdAt;

    return new Date(firstValue) - new Date(secondValue);
  });

  function formatDate(value, includeTime = false) {
    return new Intl.DateTimeFormat("da-DK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...(includeTime && {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }).format(new Date(value));
  }

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>
          {isLoading
            ? "Henter tilmeldinger..."
            : error
              ? "Tilmeldinger kunne ikke hentes"
              : `${registrationCount} tilmeldinger i alt`}
        </p>
      </header>
      <main>
        {isLoading && (
          <section className="async-state" aria-live="polite">
            <h2>Henter tilmeldinger...</h2>
            <p>Vi henter det interne overblik.</p>
          </section>
        )}
        {error && (
          <section className="async-state" role="alert">
            <h2>Tilmeldinger kunne ikke hentes</h2>
            <p>Der opstod et problem. Prøv igen om lidt.</p>
            <button
              className="state-button"
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Prøv igen
            </button>
          </section>
        )}
        {!isLoading && !error && registrations.length === 0 && (
          <section className="async-state">
            <h2>Ingen tilmeldinger endnu</h2>
            <p>Der er ikke kommet nogen tilmeldinger endnu.</p>
          </section>
        )}
        {!isLoading && !error && registrations.length > 0 && (
          <section
            className="registration-section"
            aria-labelledby="registration-table-title"
          >
            <div className="registration-toolbar">
              <h2 id="registration-table-title">Alle tilmeldinger</h2>
              <label>
                Sortér efter
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="eventDate">Eventdato</option>
                  <option value="createdAt">Oprettelsesdato</option>
                </select>
              </label>
            </div>
            <div className="registration-table-wrapper">
              <table className="registration-table">
                <caption className="sr-only">
                  Tilmeldte deltagere og deres events
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Navn og e-mail</th>
                    <th scope="col">Event</th>
                    <th scope="col">Eventdato</th>
                    <th scope="col">Oprettet</th>
                    <th scope="col">Antal på event</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRegistrations.map((registration) => {
                    const eventId =
                      registration.eventId ?? registration.eventTitle;

                    return (
                      <tr key={registration.id}>
                        <th scope="row" data-label="Navn og e-mail">
                          <strong>{registration.name}</strong>
                          <small>{registration.email}</small>
                        </th>
                        <td data-label="Event">
                          {registration.events?.title ??
                            registration.eventTitle}
                        </td>
                        <td data-label="Eventdato">
                          <time
                            dateTime={
                              registration.events?.date ??
                              registration.eventDate
                            }
                          >
                            {formatDate(
                              registration.events?.date ??
                                registration.eventDate,
                            )}
                          </time>
                        </td>
                        <td data-label="Oprettet">
                          <time dateTime={registration.createdAt}>
                            {formatDate(registration.createdAt, true)}
                          </time>
                        </td>
                        <td data-label="Antal på event">
                          {registrationsByEvent[eventId]}
                        </td>
                        <td data-label="Status">
                          <span className="status">{registration.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
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
