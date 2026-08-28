import { useEffect, useState } from "react";
import { Link } from "react-router";
import { safeJsonResponse } from "../utils/safeJson";
import { AsyncState } from "../components/AsyncState";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function getRegistrations() {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(
          `${SUPABASE_URL}/registrations?order=createdAt.desc`,
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
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getRegistrations();
  }, [reloadKey]);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        {isLoading && (
          <AsyncState
            type="loading"
            title="Henter tilmeldinger..."
            message="Vi henter det interne overblik."
          />
        )}
        {hasError && (
          <AsyncState
            type="error"
            title="Tilmeldinger kunne ikke hentes"
            message="Der opstod et problem. Prøv igen om lidt."
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        )}
        {!isLoading && !hasError && registrations.length === 0 && (
          <AsyncState
            type="empty"
            title="Ingen tilmeldinger endnu"
            message="Der er ikke kommet nogen tilmeldinger endnu."
          />
        )}
        {!isLoading && !hasError && registrations.length > 0 && (
          <div className="registration-list">
            <div className="registration-row registration-labels">
              <span>Navn</span>
              <span>Event</span>
              <span>Dato</span>
              <span>Status</span>
            </div>
            {registrations.map((registration) => (
              <div className="registration-row" key={registration.id}>
                <div>
                  <strong>{registration.name}</strong>
                  <small>{registration.email}</small>
                </div>
                <span>{registration.eventTitle}</span>
                <span>
                  {new Date(registration.eventDate).toLocaleDateString("da-DK")}
                </span>
                <span className="status">{registration.status}</span>
              </div>
            ))}
          </div>
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
