import { Separator } from "@/components/ui/separator";

interface ServiceOffering {
  id: string;
  category: { name: string };
  description: string | null;
  sa4Codes: string[];
  ageGroups: string[];
  accessMethods: string[];
  languages: string[];
  availableDays: string[];
  telehealth: boolean;
  mobileService: boolean;
}

interface ServicesTabProps {
  offerings: ServiceOffering[];
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="w-24 shrink-0 text-sm font-medium text-gray-500">
        {label}
      </span>
      <span className="text-sm text-gray-700">{value}</span>
    </div>
  );
}

export function ServicesTab({ offerings }: ServicesTabProps) {
  if (offerings.length === 0) {
    return (
      <p className="italic text-gray-400">
        This provider has not listed any services yet.
      </p>
    );
  }

  return (
    <div>
      {offerings.map((offering, i) => (
        <div key={offering.id}>
          {i > 0 && <Separator className="my-6" />}
          <h3 className="text-lg font-semibold text-gray-900">
            {offering.category.name}
          </h3>
          {offering.description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {offering.description}
            </p>
          )}
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            {offering.sa4Codes.length > 0 && (
              <DetailRow label="Areas:" value={offering.sa4Codes.join(", ")} />
            )}
            {offering.ageGroups.length > 0 && (
              <DetailRow label="Ages:" value={offering.ageGroups.join(", ")} />
            )}
            {offering.accessMethods.length > 0 && (
              <DetailRow
                label="Access:"
                value={offering.accessMethods.join(", ")}
              />
            )}
            {offering.languages.length > 0 && (
              <DetailRow
                label="Languages:"
                value={offering.languages.join(", ")}
              />
            )}
            {offering.availableDays.length > 0 && (
              <DetailRow
                label="Days:"
                value={offering.availableDays.join(", ")}
              />
            )}
            <DetailRow
              label="Telehealth:"
              value={
                offering.telehealth
                  ? "✓ Available"
                  : "✗ Not available"
              }
            />
            <DetailRow
              label="Mobile:"
              value={
                offering.mobileService
                  ? "✓ Provider comes to you"
                  : "✗ Not available"
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
