export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

export function formatReviewerName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

export function formatABN(abn: string): string {
  const digits = abn.replace(/\D/g, "");
  if (digits.length !== 11) return abn;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
}

export function formatComplianceType(type: string): string {
  const map: Record<string, string> = {
    CONDITION_ON_REGISTRATION: "Condition on Registration",
    SUSPENSION: "Suspension of Registration",
    REVOCATION: "Revocation of Registration",
    BANNING_ORDER: "Banning Order",
    INFRINGEMENT_NOTICE: "Infringement Notice",
    COMPLIANCE_NOTICE: "Compliance Notice",
    ENFORCEABLE_UNDERTAKING: "Enforceable Undertaking",
    COURT_ORDER: "Court Order",
  };
  return (
    map[type] ||
    type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
