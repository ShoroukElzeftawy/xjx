export function itemKey(item: { handle?: string; code?: string }) {
  return item.handle || item.code || "";
}

export function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" overflow="visible" aria-hidden="true">
      <path
        d="M12 7.5c.9-1.8 2.8-3 4.8-3 2.8 0 5 2.2 5 5.1 0 6.4-8.3 11.4-9.8 11.4S2.2 16 2.2 9.6c0-2.9 2.2-5.1 5-5.1 2 0 3.9 1.2 4.8 3z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
