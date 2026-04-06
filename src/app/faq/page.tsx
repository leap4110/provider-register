import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const metadata = {
  title: "FAQ — NDIS Provider Directory",
  description:
    "Find answers to common questions about using the NDIS Provider Directory as a participant, provider, or support coordinator.",
};

const participantFaqs = [
  {
    q: "Is the NDIS Provider Directory free to use?",
    a: "Yes. Searching for providers, reading reviews, and submitting service requests is completely free for NDIS participants, their families, and carers. There are no hidden fees or charges for using the platform.",
  },
  {
    q: "Do I need an NDIS plan to use the directory?",
    a: "You can browse and search the directory without an NDIS plan. However, to submit service requests or leave reviews, you will need to create a free account. Having an active NDIS plan is not required to use the platform, but it is helpful when connecting with providers.",
  },
  {
    q: "How do I know if a provider is NDIS registered?",
    a: "Each provider profile displays their NDIS registration status. Registered providers show a verification badge along with their registration number and registration groups. You can also view their compliance history and audit outcomes where available.",
  },
  {
    q: "Can I trust the reviews on the platform?",
    a: "All reviews are submitted by users who have created an account. We moderate reviews to ensure they comply with our guidelines, including being based on genuine experiences. Reviews that are fake, defamatory, or submitted in exchange for incentives are removed.",
  },
  {
    q: "How does the service request matching work?",
    a: "When you submit a service request, you describe your support needs, location, and preferences. Our matching engine identifies providers in your area who offer the relevant services and sends them your request. Matched providers can then respond with their availability and details.",
  },
  {
    q: "Can I contact providers directly?",
    a: "Yes. Every provider profile includes contact information such as phone number, email, and website. You can reach out to providers directly or use the service request system to have matched providers come to you.",
  },
  {
    q: "What if I have a bad experience with a provider?",
    a: "We encourage you to leave an honest review describing your experience. If you have a serious complaint, you can also contact the NDIS Quality and Safeguards Commission. Our platform provides information about providers but is not a party to service agreements between you and providers.",
  },
  {
    q: "Is my personal information safe?",
    a: "We take data privacy seriously. Your personal information is protected in accordance with the Australian Privacy Principles. We do not share your contact details with providers unless you submit a service request. See our Privacy Policy for full details.",
  },
];

const providerFaqs = [
  {
    q: "How do I list my business on the directory?",
    a: "Create a provider account, complete your business profile with your NDIS registration details, and set up your service offerings. Once our team verifies your registration, your listing will go live within 24 hours.",
  },
  {
    q: "What plans are available and how much do they cost?",
    a: "We offer three plans: Starter at $59/month, Accreditation Plus at $99/month, and Enterprise at $199/month. Each plan includes different features such as the number of service offerings, analytics, and service request matching. Visit our Providers page for full details.",
  },
  {
    q: "Can I respond to negative reviews?",
    a: "Yes. Provider accounts can respond publicly to any review on their profile. We encourage professional, constructive responses. If you believe a review violates our guidelines, you can flag it for moderation.",
  },
  {
    q: "How do service request leads work?",
    a: "Participants submit requests describing their needs. If your services and location match, you will receive a notification with the request details. You can then respond with your availability and service information. Service request matching is available on Accreditation Plus and Enterprise plans.",
  },
  {
    q: "Do I need to be NDIS registered to list?",
    a: "Both registered and unregistered providers can create listings. However, your registration status is displayed on your profile. Registered providers receive a verification badge that builds trust with participants.",
  },
  {
    q: "Can I add team members to manage my listing?",
    a: "Team member accounts are available on the Enterprise plan. You can invite colleagues to help manage your profile, respond to reviews, and handle service requests.",
  },
  {
    q: "How are search results ranked?",
    a: "Search results are ranked based on relevance to the user's query, location proximity, review ratings, profile completeness, and plan level. Providers on Accreditation Plus and Enterprise plans receive priority ranking in search results.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. All plans are billed monthly with no lock-in contracts. You can cancel from your dashboard at any time, and your listing will remain active until the end of your current billing period.",
  },
];

const coordinatorFaqs = [
  {
    q: "How can support coordinators use the directory?",
    a: "Support coordinators can use the directory to search for providers on behalf of their participants, compare services and reviews, and submit service requests. It is a free tool designed to make your job of finding suitable providers faster and easier.",
  },
  {
    q: "Can I create an account as a support coordinator?",
    a: "Yes. When registering, select the support coordinator role. This gives you access to features tailored for coordinators, including the ability to manage service requests on behalf of participants.",
  },
  {
    q: "Can I submit service requests for my participants?",
    a: "Yes. Support coordinators can submit service requests on behalf of their participants. When submitting, you can specify the participant's needs, location, and preferences, and our matching engine will identify suitable providers.",
  },
  {
    q: "How do I verify a provider's compliance history?",
    a: "Each provider profile includes a compliance section showing their NDIS registration status, registration groups, and audit history where available. This information is sourced from public NDIS records and updated regularly.",
  },
  {
    q: "Is there a cost for support coordinators?",
    a: "No. The platform is completely free for support coordinators. There are no fees for searching, reviewing providers, or submitting service requests.",
  },
  {
    q: "Can I filter providers by specific registration groups?",
    a: "Yes. The search filters allow you to narrow results by service category, which maps to NDIS registration groups. You can also filter by location, language, and other criteria to find the most suitable providers for your participants.",
  },
  {
    q: "How current is the provider information?",
    a: "Providers manage their own listings and are responsible for keeping information up to date. NDIS registration data is refreshed regularly from public sources. Review dates are displayed so you can see how recent the feedback is.",
  },
];

function FaqSection({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-lg border border-gray-200 bg-white"
        >
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-gray-900 marker:[content:''] [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="ml-2 shrink-0 text-gray-400 transition-transform group-open:rotate-180">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </summary>
          <p className="px-5 pb-4 text-sm text-gray-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-gray-600">
            Find answers to common questions about using the NDIS Provider
            Directory.
          </p>
        </div>

        <div className="mt-10">
          <Tabs defaultValue="participants">
            <TabsList className="w-full">
              <TabsTrigger value="participants">For Participants</TabsTrigger>
              <TabsTrigger value="providers">For Providers</TabsTrigger>
              <TabsTrigger value="coordinators">
                For Support Coordinators
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="mt-6">
              <FaqSection items={participantFaqs} />
            </TabsContent>

            <TabsContent value="providers" className="mt-6">
              <FaqSection items={providerFaqs} />
            </TabsContent>

            <TabsContent value="coordinators" className="mt-6">
              <FaqSection items={coordinatorFaqs} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
