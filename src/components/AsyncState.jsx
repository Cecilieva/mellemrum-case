export function AsyncState({ type, title, message, onRetry, children }) {
  return (
    <div
      className={`async-state async-state-${type}`}
      role={type === "error" ? "alert" : undefined}
    >
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {onRetry && (
        <button className="state-button" type="button" onClick={onRetry}>
          Prøv igen
        </button>
      )}
      {children}
    </div>
  );
}
