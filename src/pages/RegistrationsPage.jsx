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

  const groupedRegistrations = registrations.reduce((groups, registration) => {
    const eventId = registration.eventId ?? registration.eventTitle ?? "ukendt";
    const eventTitle = registration.eventTitle || "Ukendt event";

    if (!groups[eventId]) {
      groups[eventId] = {
        id: eventId,
        title: eventTitle,
        registrations: [],
      };
    }

    groups[eventId].registrations.push(registration);
    return groups;
  }, {});

  const eventGroups = Object.values(groupedRegistrations);

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
          <div className="registration-groups">
            {eventGroups.map((group) => (
              <section className="registration-group" key={group.id}>
                <h2>{group.title}</h2>
                <div className="registration-table-wrapper">
                  <table className="registration-table">
                    <thead>
                      <tr>
                        <th scope="col">Navn</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">Dato</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.registrations.map((registration) => (
                        <tr key={registration.id}>
                          <td>{registration.name}</td>
                          <td>{registration.email}</td>
                          <td>
                            {new Date(
                              registration.eventDate,
                            ).toLocaleDateString("da-DK")}
                          </td>
                          <td>
                            <span className="status">
                              {registration.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
