interface SRAnnouncerProps {
  message: string;
  assertive?: boolean;
}

export function SRAnnouncer({ message, assertive = false }: SRAnnouncerProps) {
  return (
    <div
      role="status"
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
