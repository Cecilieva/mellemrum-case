export default function AsyncState({ type, title, message, onRetry }) {
  return (
    <section
      className={`async-state async-state-${type}`}
      role={type === "error" ? "alert" : undefined}
    >
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && (
        <button className="state-button" type="button" onClick={onRetry}>
          Prøv igen
        </button>
      )}
    </section>
  );
}
