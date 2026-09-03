export function Toast({ message, onView }: { message: string; onView: () => void }) {
  return (
    <div className="toast" role="status">
      {message}
      <button type="button" onClick={onView}>VIEW BAG</button>
    </div>
  );
}
