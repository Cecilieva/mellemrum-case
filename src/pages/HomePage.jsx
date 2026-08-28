import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getEvents } from "../api/events";
import AsyncState from "../components/AsyncState";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      setHasError(false);

      try {
        const data = await getEvents();
        if (!Array.isArray(data)) throw new Error("Invalid events response");
        setEvents(data);
      } catch {
        setEvents([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [reloadKey]);

  const categories = [
    "Alle",
    ...new Set(events.map((event) => event.category).filter(Boolean)),
  ];

  const filteredEvents = events.filter((event) => {
    const searchText =
      `${event.title} ${event.summary} ${event.venueName}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  const hasActiveFilters = search.trim() !== "" || category !== "Alle";

  function resetFilters() {
    setSearch("");
    setCategory("Alle");
  }

  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return (
    <>
      <header
        className="hero"
        style={{
          "--hero-image": `url("${import.meta.env.BASE_URL}hero.webp")`,
        }}
      >
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
        </p>
        <a className="hero-link" href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className="section-heading">
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className="filters">
          <label>
            Søg
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        {hasActiveFilters && filteredEvents.length === 0 && (
          <section
            className="message filter-empty-state"
            aria-live="polite"
            role="status"
          >
            <h2>Ingen events matcher dine filtre</h2>
            <p>Prøv at søge efter noget andet eller nulstil filtrene.</p>
            <button
              className="filter-reset-button"
              type="button"
              onClick={resetFilters}
            >
              Nulstil søgning og kategori
            </button>
          </section>
        )}

        <section className="event-grid">
          {isLoading && (
            <AsyncState
              type="loading"
              title="Henter events..."
              message="Vi finder de kommende oplevelser til dig."
            />
          )}
          {hasError && (
            <AsyncState
              type="error"
              title="Events kunne ikke hentes"
              message="Der opstod et problem. Prøv igen om lidt."
              onRetry={() => setReloadKey((key) => key + 1)}
            />
          )}
          {!isLoading && !hasError && events.length === 0 && (
            <AsyncState
              type="empty"
              title="Ingen events endnu"
              message="Der er ikke planlagt nye events lige nu."
            />
          )}
          {!isLoading &&
            !hasError &&
            events.length > 0 &&
            filteredEvents.length === 0 && (
              <AsyncState
                type="empty"
                title="Ingen events matcher din søgning"
                message="Prøv at ændre din søgning eller vælge en anden kategori."
              />
            )}
          {!isLoading &&
            !hasError &&
            filteredEvents.map((event) => (
              <article className="event-card" key={event.id}>
                <img src={event.image} alt="" />
                <div className="event-card-content">
                  <p className="event-category">{event.category}</p>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  <div className="event-meta">
                    <span>{formatEventDate(event.date)}</span>
                    <span>{event.venueName}</span>
                  </div>
                  <Link className="card-link" to={`/events/${event.id}`}>
                    Læs mere
                  </Link>
                </div>
              </article>
            ))}
        </section>
      </main>
    </>
  );
}
