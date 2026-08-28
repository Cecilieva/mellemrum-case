import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getRegistrations } from "../api/registrations";
import AsyncState from "../components/AsyncState";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadRegistrations() {
      setIsLoading(true);
      setHasError(false);

      try {
        const data = await getRegistrations();
        if (!Array.isArray(data))
          throw new Error("Invalid registrations response");
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

    loadRegistrations();
  }, [reloadKey]);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>
          {isLoading
            ? "Henter tilmeldinger..."
            : hasError
              ? "Tilmeldinger kunne ikke hentes"
              : `${registrationCount} tilmeldinger i alt`}
        </p>
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
    </>
  );
}
