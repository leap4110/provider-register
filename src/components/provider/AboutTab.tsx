import { ProviderGallery } from "@/components/provider/ProviderGallery";

interface AboutTabProps {
  description: string | null;
  photos: { id: string; url: string; alt: string | null }[];
  providerName: string;
  showGallery: boolean;
}

export function AboutTab({
  description,
  photos,
  providerName,
  showGallery,
}: AboutTabProps) {
  return (
    <div>
      {description ? (
        description.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-4 text-base leading-relaxed text-gray-700">
            {paragraph}
          </p>
        ))
      ) : (
        <p className="italic text-gray-400">
          This provider has not added a description yet.
        </p>
      )}

      {showGallery && photos.length > 0 && (
        <>
          <h3 className="mb-4 mt-8 text-lg font-semibold text-gray-900">
            Photos
          </h3>
          <ProviderGallery photos={photos} providerName={providerName} />
        </>
      )}
    </div>
  );
}
