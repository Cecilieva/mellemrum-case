import { useCallback } from "react";
import { Link } from "react-router";
import { getRegistrations } from "../api/registrations";
import AsyncState from "../components/AsyncState";
import useAsyncData from "../hooks/useAsyncData";

export default function RegistrationsPage() {
  const loadRegistrations = useCallback(() => getRegistrations(), []);
  const { data, isLoading, hasError, retry } = useAsyncData(loadRegistrations);
  const registrations = Array.isArray(data) ? data : [];
  const registrationCount = registrations.length;

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
            onRetry={retry}
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
