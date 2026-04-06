import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------------------------------------------------------
// Data definitions
// ---------------------------------------------------------------------------

const TEST_PASSWORD = "TestPassword123!";
const BCRYPT_ROUNDS = 12;

const TEST_USERS = [
  {
    email: "sarah.johnson@test.com",
    name: "Sarah Johnson",
    role: "PARTICIPANT" as const,
    phone: "0412345678",
  },
  {
    email: "mike.chen@test.com",
    name: "Mike Chen",
    role: "PARTICIPANT" as const,
    phone: "0423456789",
  },
  {
    email: "emma.williams@test.com",
    name: "Emma Williams",
    role: "PARTICIPANT" as const,
    phone: "0434567890",
  },
  {
    email: "david.kumar@test.com",
    name: "David Kumar",
    role: "PARTICIPANT" as const,
    phone: "0445678901",
  },
  {
    email: "lisa.nguyen@test.com",
    name: "Lisa Nguyen",
    role: "PARTICIPANT" as const,
    phone: "0456789012",
  },
  {
    email: "admin@brightcare.test.com",
    name: "Rachel Thompson",
    role: "PROVIDER_ADMIN" as const,
    phone: "0467890123",
  },
  {
    email: "admin@activeot.test.com",
    name: "James Mitchell",
    role: "PROVIDER_ADMIN" as const,
    phone: "0478901234",
  },
  {
    email: "admin@mindwell.test.com",
    name: "Priya Sharma",
    role: "PROVIDER_ADMIN" as const,
    phone: "0489012345",
  },
  {
    email: "coordinator1@test.com",
    name: "Angela Martinez",
    role: "SUPPORT_COORDINATOR" as const,
    phone: "0490123456",
  },
  {
    email: "coordinator2@test.com",
    name: "Tom Bradley",
    role: "SUPPORT_COORDINATOR" as const,
    phone: "0401234567",
  },
];

const TEST_PROVIDERS = [
  {
    name: "BrightCare Support Services",
    slug: "brightcare-support-services",
    abn: "11222333444",
    email: "info@brightcare.com.au",
    phone: "07 3000 1001",
    address: "Level 3, 100 Edward Street",
    suburb: "Brisbane City",
    state: "QLD",
    postcode: "4000",
    latitude: -27.468,
    longitude: 153.024,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001001",
    tier: "ACCREDITATION_PLUS" as const,
    accredited: true,
    description:
      "BrightCare Support Services is a leading disability support provider in Brisbane, offering a comprehensive range of personalised services to NDIS participants across South East Queensland. Founded in 2017, we specialise in daily living support, community participation, and skill-building programs tailored to each participant's goals.\n\nOur team of over 50 qualified support workers brings experience across physical, intellectual, and psychosocial disability support. We pride ourselves on person-centred approaches that respect individual choice, promote independence, and build meaningful community connections.\n\nBrightCare holds full NDIS registration and maintains the highest standards of quality and safeguarding. We are committed to continuous improvement and regularly seek participant feedback to refine our services.",
    categorySlugs: [
      "support-work",
      "community-participation",
      "life-skills-development",
      "personal-care",
    ],
    createdDaysAgo: 180,
  },
  {
    name: "Active OT Solutions",
    slug: "active-ot-solutions",
    abn: "22333444555",
    email: "hello@activeot.com.au",
    phone: "07 3000 1002",
    address: "Suite 5, 22 Vulture Street",
    suburb: "South Brisbane",
    state: "QLD",
    postcode: "4101",
    latitude: -27.478,
    longitude: 153.018,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001002",
    tier: "ENTERPRISE" as const,
    accredited: true,
    description:
      "Active OT Solutions provides specialist occupational therapy services across Brisbane and surrounding regions. Our multidisciplinary team works with children, adolescents, and adults to develop functional capacity, improve daily living skills, and achieve greater independence.\n\nWe offer clinic-based and mobile services including functional assessments, home modification recommendations, assistive technology prescription, and sensory processing support. Our therapists are experienced in working with a wide range of conditions including autism spectrum disorder, cerebral palsy, acquired brain injury, and mental health conditions.\n\nAs an NDIS registered provider, Active OT Solutions is committed to evidence-based practice and collaborative goal setting with participants and their support networks.",
    categorySlugs: [
      "occupational-therapy",
      "assistive-technology",
      "home-modifications",
    ],
    createdDaysAgo: 160,
  },
  {
    name: "MindWell Psychology",
    slug: "mindwell-psychology",
    abn: "33444555666",
    email: "reception@mindwell.com.au",
    phone: "07 3000 1003",
    address: "12 Wickham Terrace",
    suburb: "Fortitude Valley",
    state: "QLD",
    postcode: "4006",
    latitude: -27.46,
    longitude: 153.028,
    registrationStatus: "CONDITIONS_APPLIED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001003",
    tier: "ACCREDITATION_PLUS" as const,
    accredited: true,
    description:
      "MindWell Psychology offers specialist psychological services to NDIS participants in the Brisbane region. Our team of registered and clinical psychologists provides assessment, therapy, and behaviour support across clinic, telehealth, and community settings.\n\nWe specialise in psychosocial disability support, trauma-informed care, and capacity-building interventions. Our practitioners use evidence-based modalities including CBT, DBT, EMDR, and ACT to support participants in achieving their mental health and wellbeing goals.\n\nPlease note: MindWell Psychology currently has conditions on its registration following a compliance review. We are actively working with the NDIS Quality and Safeguards Commission to resolve all outstanding matters and improve our practices.",
    categorySlugs: ["psychology", "behaviour-support", "counselling"],
    createdDaysAgo: 150,
  },
  {
    name: "Sunshine Coast Physio & Rehab",
    slug: "sunshine-coast-physio-rehab",
    abn: "44555666777",
    email: "bookings@sunshinecoastphysio.com.au",
    phone: "07 5400 2001",
    address: "88 Aerodrome Road",
    suburb: "Maroochydore",
    state: "QLD",
    postcode: "4558",
    latitude: -26.654,
    longitude: 153.091,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001004",
    tier: "STARTER" as const,
    accredited: false,
    description:
      "Sunshine Coast Physio & Rehab provides physiotherapy and exercise physiology services to NDIS participants on the Sunshine Coast. Our experienced team works with participants to improve mobility, strength, and physical function through individually tailored rehabilitation programs.\n\nWe offer clinic-based treatment, hydrotherapy sessions, and mobile physiotherapy for participants who are unable to attend our clinic. Our therapists have extensive experience working with neurological conditions, musculoskeletal injuries, and developmental disabilities.\n\nConveniently located in Maroochydore, we serve participants across the entire Sunshine Coast region with flexible appointment scheduling and a warm, welcoming clinic environment.",
    categorySlugs: ["physiotherapy", "exercise-physiology"],
    createdDaysAgo: 140,
  },
  {
    name: "HomeFlex Support",
    slug: "homeflex-support",
    abn: "55666777888",
    email: "contact@homeflex.com.au",
    phone: "07 3000 1005",
    address: "3 Sherwood Road",
    suburb: "Toowong",
    state: "QLD",
    postcode: "4066",
    latitude: -27.486,
    longitude: 152.985,
    registrationStatus: "UNREGISTERED" as const,
    ndisRegistered: false,
    tier: "STARTER" as const,
    accredited: false,
    description:
      "HomeFlex Support provides in-home support services across Brisbane's western suburbs. As a self-managed and plan-managed provider, we offer flexible daily living assistance, domestic support, and community access services to NDIS participants who value choice and control.\n\nOur support workers are carefully matched to each participant based on personality, interests, and support needs. We focus on building genuine relationships and providing reliable, consistent support that empowers participants to live their best lives at home.\n\nHomeFlex is an unregistered provider servicing self-managed and plan-managed NDIS participants. We maintain our own quality standards and welcome feedback from all participants and their families.",
    categorySlugs: [
      "support-work",
      "domestic-assistance",
      "personal-care",
    ],
    createdDaysAgo: 120,
  },
  {
    name: "NextStep Employment Services",
    slug: "nextstep-employment",
    abn: "66777888999",
    email: "admin@nextstep.com.au",
    phone: "07 3000 1006",
    address: "Level 8, 240 Queen Street",
    suburb: "Brisbane City",
    state: "QLD",
    postcode: "4000",
    latitude: -27.47,
    longitude: 153.027,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001006",
    tier: "ACCREDITATION_PLUS" as const,
    accredited: true,
    description:
      "NextStep Employment Services is dedicated to helping NDIS participants achieve their employment goals. We provide end-to-end employment support including job readiness training, resume development, interview coaching, job placement, and ongoing workplace support.\n\nOur employment consultants work closely with participants and local employers to create meaningful, sustainable employment opportunities. We specialise in supporting people with intellectual disability, autism spectrum disorder, and psychosocial disability to find and maintain competitive employment.\n\nNextStep also offers School Leaver Employment Supports (SLES) for young people transitioning from school to the workforce, with structured programs that build workplace skills and confidence.",
    categorySlugs: [
      "employment-support",
      "school-leaver-employment-supports",
      "life-skills-development",
    ],
    createdDaysAgo: 170,
  },
  {
    name: "Speak Easy Speech Pathology",
    slug: "speak-easy-speech-pathology",
    abn: "77888999000",
    email: "info@speakeasy.com.au",
    phone: "07 3000 1007",
    address: "Unit 2, 55 Creek Road",
    suburb: "Camp Hill",
    state: "QLD",
    postcode: "4152",
    latitude: -27.492,
    longitude: 153.075,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001007",
    tier: "ACCREDITATION_PLUS" as const,
    accredited: true,
    description:
      "Speak Easy Speech Pathology provides expert communication and swallowing support for NDIS participants of all ages. Our team of certified practising speech pathologists offers assessment, therapy, and augmentative and alternative communication (AAC) solutions.\n\nWe work with children and adults experiencing speech delays, language disorders, stuttering, voice disorders, and feeding and swallowing difficulties. Our services are available in clinic, via telehealth, and in schools, homes, and community settings across Brisbane's eastern suburbs.\n\nSpeak Easy is passionate about helping every person find their voice. We use evidence-based approaches and the latest technology to deliver engaging, effective therapy that makes a real difference.",
    categorySlugs: [
      "speech-therapy",
      "early-childhood-intervention",
    ],
    createdDaysAgo: 165,
  },
  {
    name: "GoldCoast Disability Housing",
    slug: "goldcoast-disability-housing",
    abn: "88999000111",
    email: "enquiries@gchousing.com.au",
    phone: "07 5500 3001",
    address: "Level 2, 50 Cavill Avenue",
    suburb: "Surfers Paradise",
    state: "QLD",
    postcode: "4217",
    latitude: -27.999,
    longitude: 153.431,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001008",
    tier: "ENTERPRISE" as const,
    accredited: true,
    description:
      "GoldCoast Disability Housing is a specialist accommodation provider offering Specialist Disability Accommodation (SDA) and Supported Independent Living (SIL) options across the Gold Coast region. We manage a portfolio of purpose-built and modified properties designed to maximise accessibility and participant independence.\n\nOur accommodation options include fully accessible apartments, shared living arrangements, and individual homes with various levels of onsite support. All properties meet NDIS SDA design standards and are located near public transport, shops, and community amenities.\n\nWe work closely with participants, their families, and support coordinators to match people with the right home and the right level of support, ensuring a comfortable and empowering living arrangement.",
    categorySlugs: [
      "specialist-disability-accommodation",
      "supported-independent-living",
    ],
    createdDaysAgo: 175,
  },
  {
    name: "Caring Hands Plan Management",
    slug: "caring-hands-plan-management",
    abn: "99000111222",
    email: "plans@caringhands.com.au",
    phone: "07 3000 1009",
    address: "18 Latrobe Terrace",
    suburb: "Paddington",
    state: "QLD",
    postcode: "4064",
    latitude: -27.461,
    longitude: 152.999,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001009",
    tier: "ACCREDITATION_PLUS" as const,
    accredited: true,
    description:
      "Caring Hands Plan Management takes the stress out of managing your NDIS plan. We handle all the financial administration so you can focus on choosing the supports and providers that work best for you. Our service gives you the freedom to use both registered and unregistered providers.\n\nOur dedicated plan managers provide personalised support including invoice processing, budget tracking, provider payment, and financial reporting. We use a secure online portal so participants can view their budget and claims in real time.\n\nCaring Hands is committed to empowering NDIS participants through financial transparency and responsive service. We process claims within 48 hours and our friendly team is always available to answer questions.",
    categorySlugs: ["plan-management"],
    createdDaysAgo: 130,
  },
  {
    name: "Therapy Tree Early Intervention",
    slug: "therapy-tree-early-intervention",
    abn: "10111222333",
    email: "hello@therapytree.com.au",
    phone: "07 3000 1010",
    address: "44 Given Terrace",
    suburb: "Paddington",
    state: "QLD",
    postcode: "4064",
    latitude: -27.459,
    longitude: 152.998,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001010",
    tier: "ACCREDITATION_PLUS" as const,
    accredited: true,
    description:
      "Therapy Tree Early Intervention provides multidisciplinary therapy services for children aged 0-12 with developmental delays and disabilities. Our warm, family-centred team includes occupational therapists, speech pathologists, psychologists, and behaviour support practitioners who collaborate to deliver holistic early intervention support.\n\nWe offer individual and group therapy sessions in our purpose-built clinic, as well as home and childcare/school visits. Our programs are designed around each child's unique strengths and goals, with active involvement of parents and carers in the therapy process.\n\nTherapy Tree believes that early intervention changes lives. We are passionate about helping every child reach their potential and supporting families on their journey.",
    categorySlugs: [
      "early-childhood-intervention",
      "occupational-therapy",
      "speech-therapy",
      "behaviour-support",
    ],
    createdDaysAgo: 155,
  },
  {
    name: "Outback Support Network",
    slug: "outback-support-network",
    abn: "21222333445",
    email: "support@outbacknetwork.com.au",
    phone: "07 4600 5001",
    address: "15 Russell Street",
    suburb: "Toowoomba",
    state: "QLD",
    postcode: "4350",
    latitude: -27.561,
    longitude: 151.954,
    registrationStatus: "REGISTERED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001011",
    tier: "STARTER" as const,
    accredited: false,
    description:
      "Outback Support Network provides disability support services to participants in Toowoomba and the broader Darling Downs region. We understand the unique challenges of accessing services in regional areas and are committed to bringing high-quality support to communities outside the metropolitan hubs.\n\nOur services include daily living assistance, community participation, transport support, and social skill-building programs. We also offer telehealth-based support coordination for participants in remote areas who may have limited access to local services.\n\nOutback Support Network is a small, community-focused provider that values genuine relationships and cultural sensitivity. We are proud to support NDIS participants in regional Queensland to live fulfilling, connected lives.",
    categorySlugs: [
      "support-work",
      "community-participation",
      "transport",
    ],
    createdDaysAgo: 100,
  },
  {
    name: "Dubious Care Solutions",
    slug: "dubious-care-solutions",
    abn: "32333444556",
    email: "info@dubiouscare.com.au",
    phone: "07 3200 9001",
    address: "Unit 7, 200 Wembley Road",
    suburb: "Logan Central",
    state: "QLD",
    postcode: "4114",
    latitude: -27.639,
    longitude: 153.109,
    registrationStatus: "CONDITIONS_APPLIED" as const,
    ndisRegistered: true,
    ndisProviderNumber: "4050001012",
    tier: "STARTER" as const,
    accredited: false,
    description:
      "Dubious Care Solutions provides support work and personal care services in the Logan and southern Brisbane corridor. We have been operating since 2021 and service a number of NDIS participants in the area.\n\nPlease be aware that Dubious Care Solutions currently has conditions on its NDIS registration and active compliance actions from the NDIS Quality and Safeguards Commission. Prospective participants are encouraged to review the compliance information on this profile and discuss with their support coordinator before engaging our services.\n\nWe are working to address the matters raised by the Commission and improve our service delivery and compliance systems.",
    categorySlugs: ["support-work", "personal-care"],
    createdDaysAgo: 90,
  },
];

// Provider member links: email -> provider slug
const PROVIDER_MEMBERS: { email: string; providerSlug: string }[] = [
  {
    email: "admin@brightcare.test.com",
    providerSlug: "brightcare-support-services",
  },
  {
    email: "admin@activeot.test.com",
    providerSlug: "active-ot-solutions",
  },
  {
    email: "admin@mindwell.test.com",
    providerSlug: "mindwell-psychology",
  },
];

// Service offerings per provider slug
interface OfferingDef {
  providerSlug: string;
  categorySlug: string;
  sa4Codes: string[];
  ageGroups: string[];
  accessMethods: string[];
  languages: string[];
  telehealth: boolean;
  mobileService: boolean;
  description: string;
}

const SERVICE_OFFERINGS: OfferingDef[] = [
  // BrightCare Support Services
  {
    providerSlug: "brightcare-support-services",
    categorySlug: "support-work",
    sa4Codes: ["301", "302", "303", "304", "305"],
    ageGroups: ["18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English", "Mandarin", "Vietnamese"],
    telehealth: false,
    mobileService: true,
    description:
      "Flexible support work services including daily living assistance, community access, and skill development. Our support workers are matched to each participant based on shared interests and goals.",
  },
  {
    providerSlug: "brightcare-support-services",
    categorySlug: "community-participation",
    sa4Codes: ["301", "303", "305"],
    ageGroups: ["18-25", "25-44", "45-64"],
    accessMethods: ["in-person", "group"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Group and individual community participation programs including social outings, recreational activities, and volunteer opportunities. We run weekly group programs in Brisbane CBD and northern suburbs.",
  },
  {
    providerSlug: "brightcare-support-services",
    categorySlug: "life-skills-development",
    sa4Codes: ["301", "305"],
    ageGroups: ["18-25", "25-44"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Structured life skills programs covering cooking, budgeting, public transport training, and household management. Delivered in home and community settings with tailored learning plans.",
  },
  // Active OT Solutions
  {
    providerSlug: "active-ot-solutions",
    categorySlug: "occupational-therapy",
    sa4Codes: ["301", "302", "303", "304", "305"],
    ageGroups: ["0-6", "7-17", "18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person", "telehealth", "mobile"],
    languages: ["English", "Hindi", "Arabic"],
    telehealth: true,
    mobileService: true,
    description:
      "Comprehensive occupational therapy assessments and interventions for all ages. Services include functional capacity evaluations, sensory processing therapy, fine motor skill development, and equipment prescription.",
  },
  {
    providerSlug: "active-ot-solutions",
    categorySlug: "assistive-technology",
    sa4Codes: ["301", "302", "304", "305"],
    ageGroups: ["7-17", "18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person", "telehealth"],
    languages: ["English"],
    telehealth: true,
    mobileService: false,
    description:
      "Assistive technology assessment, prescription, and training. We work with participants to identify the right equipment and technology solutions to support independence in daily activities.",
  },
  {
    providerSlug: "active-ot-solutions",
    categorySlug: "home-modifications",
    sa4Codes: ["301", "302", "303", "304", "305", "306"],
    ageGroups: ["18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Home modification assessments and recommendations including bathroom modifications, ramp installations, kitchen adaptations, and smart home technology integration for improved accessibility.",
  },
  // MindWell Psychology
  {
    providerSlug: "mindwell-psychology",
    categorySlug: "psychology",
    sa4Codes: ["301", "303"],
    ageGroups: ["18-25", "25-44", "45-64"],
    accessMethods: ["in-person", "telehealth"],
    languages: ["English", "Tamil", "Sinhala"],
    telehealth: true,
    mobileService: false,
    description:
      "Individual psychological therapy and assessment for NDIS participants with psychosocial disability. Our clinical psychologists provide evidence-based treatment using CBT, DBT, and trauma-informed approaches.",
  },
  {
    providerSlug: "mindwell-psychology",
    categorySlug: "behaviour-support",
    sa4Codes: ["301", "303"],
    ageGroups: ["7-17", "18-25", "25-44"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Positive behaviour support plans developed by registered behaviour support practitioners. We conduct functional behaviour assessments and work with participants and their support teams to implement evidence-based strategies.",
  },
  // Sunshine Coast Physio & Rehab
  {
    providerSlug: "sunshine-coast-physio-rehab",
    categorySlug: "physiotherapy",
    sa4Codes: ["307"],
    ageGroups: ["18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Physiotherapy services including musculoskeletal rehabilitation, neurological physiotherapy, and hydrotherapy. Clinic-based and mobile services available across the Sunshine Coast.",
  },
  {
    providerSlug: "sunshine-coast-physio-rehab",
    categorySlug: "exercise-physiology",
    sa4Codes: ["307"],
    ageGroups: ["18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person", "group"],
    languages: ["English"],
    telehealth: false,
    mobileService: false,
    description:
      "Accredited exercise physiology programs tailored to participants with disability. Group fitness classes and individual exercise plans designed to improve strength, endurance, and overall wellbeing.",
  },
  // HomeFlex Support
  {
    providerSlug: "homeflex-support",
    categorySlug: "support-work",
    sa4Codes: ["305"],
    ageGroups: ["25-44", "45-64", "65+"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English", "Cantonese"],
    telehealth: false,
    mobileService: true,
    description:
      "In-home support work services in Brisbane's western suburbs. We provide daily living assistance, meal preparation support, and community access with a focus on building lasting, trusted relationships.",
  },
  {
    providerSlug: "homeflex-support",
    categorySlug: "domestic-assistance",
    sa4Codes: ["305"],
    ageGroups: ["25-44", "45-64", "65+"],
    accessMethods: ["in-person"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Domestic assistance including light housekeeping, laundry, and meal preparation. Flexible scheduling with regular and casual options available.",
  },
  // NextStep Employment
  {
    providerSlug: "nextstep-employment",
    categorySlug: "employment-support",
    sa4Codes: ["301", "302", "303", "304", "305"],
    ageGroups: ["18-25", "25-44", "45-64"],
    accessMethods: ["in-person", "telehealth", "group"],
    languages: ["English", "Arabic", "Samoan"],
    telehealth: true,
    mobileService: true,
    description:
      "End-to-end employment support including job readiness workshops, resume writing, interview preparation, job matching, and ongoing in-work support. Our team partners with over 100 local employers.",
  },
  {
    providerSlug: "nextstep-employment",
    categorySlug: "school-leaver-employment-supports",
    sa4Codes: ["301", "302", "303"],
    ageGroups: ["18-25"],
    accessMethods: ["in-person", "group"],
    languages: ["English"],
    telehealth: false,
    mobileService: false,
    description:
      "Structured School Leaver Employment Supports (SLES) program for young people transitioning from school to employment. Includes work experience placements, vocational skill building, and travel training.",
  },
  // Speak Easy Speech Pathology
  {
    providerSlug: "speak-easy-speech-pathology",
    categorySlug: "speech-therapy",
    sa4Codes: ["301", "302", "304"],
    ageGroups: ["0-6", "7-17", "18-25", "25-44"],
    accessMethods: ["in-person", "telehealth", "mobile"],
    languages: ["English", "Greek"],
    telehealth: true,
    mobileService: true,
    description:
      "Speech pathology services for children and adults including articulation therapy, language intervention, fluency treatment, and AAC assessment and setup. Clinic, school, and home visits available.",
  },
  {
    providerSlug: "speak-easy-speech-pathology",
    categorySlug: "early-childhood-intervention",
    sa4Codes: ["301", "302"],
    ageGroups: ["0-6"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Early childhood speech and language intervention for children aged 0-6. We provide developmental assessments, parent coaching, and play-based therapy in home and early childhood settings.",
  },
  // GoldCoast Disability Housing
  {
    providerSlug: "goldcoast-disability-housing",
    categorySlug: "specialist-disability-accommodation",
    sa4Codes: ["306"],
    ageGroups: ["18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person"],
    languages: ["English"],
    telehealth: false,
    mobileService: false,
    description:
      "Specialist Disability Accommodation properties across the Gold Coast including fully accessible apartments, shared living homes, and robust design dwellings. All properties are SDA-enrolled and meet NDIS design standards.",
  },
  {
    providerSlug: "goldcoast-disability-housing",
    categorySlug: "supported-independent-living",
    sa4Codes: ["306"],
    ageGroups: ["18-25", "25-44", "45-64"],
    accessMethods: ["in-person"],
    languages: ["English", "Mandarin"],
    telehealth: false,
    mobileService: false,
    description:
      "Supported Independent Living services with 24/7 onsite support, personalised routines, and community integration programs. Our SIL model supports participants to develop independence while having access to assistance when needed.",
  },
  // Caring Hands Plan Management
  {
    providerSlug: "caring-hands-plan-management",
    categorySlug: "plan-management",
    sa4Codes: ["301", "302", "303", "304", "305", "306", "307", "309"],
    ageGroups: ["0-6", "7-17", "18-25", "25-44", "45-64", "65+"],
    accessMethods: ["telehealth", "in-person"],
    languages: ["English", "Vietnamese", "Mandarin", "Arabic"],
    telehealth: true,
    mobileService: false,
    description:
      "Full plan management services including invoice processing within 48 hours, real-time budget tracking via our online portal, and dedicated plan manager support. We service all of South East Queensland.",
  },
  // Therapy Tree Early Intervention
  {
    providerSlug: "therapy-tree-early-intervention",
    categorySlug: "early-childhood-intervention",
    sa4Codes: ["301", "305"],
    ageGroups: ["0-6", "7-17"],
    accessMethods: ["in-person", "mobile", "group"],
    languages: ["English", "Mandarin"],
    telehealth: false,
    mobileService: true,
    description:
      "Multidisciplinary early intervention programs for children aged 0-12 including OT, speech, psychology, and behaviour support. Clinic-based, home, and school visits with collaborative family-centred approach.",
  },
  {
    providerSlug: "therapy-tree-early-intervention",
    categorySlug: "occupational-therapy",
    sa4Codes: ["301", "305"],
    ageGroups: ["0-6", "7-17"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Paediatric occupational therapy focusing on fine motor skills, sensory processing, self-care development, and school readiness. Individual sessions and group programs available.",
  },
  {
    providerSlug: "therapy-tree-early-intervention",
    categorySlug: "speech-therapy",
    sa4Codes: ["301", "305"],
    ageGroups: ["0-6", "7-17"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Paediatric speech pathology for early language development, articulation, social communication, and literacy support. Collaborative sessions with parents and carers.",
  },
  // Outback Support Network
  {
    providerSlug: "outback-support-network",
    categorySlug: "support-work",
    sa4Codes: ["309"],
    ageGroups: ["18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person", "mobile"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Support work services in Toowoomba and the Darling Downs region. Daily living assistance, community participation, and social skill development with local support workers who understand regional communities.",
  },
  {
    providerSlug: "outback-support-network",
    categorySlug: "community-participation",
    sa4Codes: ["309"],
    ageGroups: ["18-25", "25-44", "45-64"],
    accessMethods: ["in-person", "group"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Community participation programs in the Toowoomba region including social groups, recreational activities, and supported volunteering opportunities.",
  },
  {
    providerSlug: "outback-support-network",
    categorySlug: "transport",
    sa4Codes: ["309"],
    ageGroups: ["18-25", "25-44", "45-64", "65+"],
    accessMethods: ["in-person"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Transport assistance for NDIS appointments, community activities, and essential errands in the Toowoomba area. Wheelchair accessible vehicles available.",
  },
  // Dubious Care Solutions
  {
    providerSlug: "dubious-care-solutions",
    categorySlug: "support-work",
    sa4Codes: ["304"],
    ageGroups: ["25-44", "45-64"],
    accessMethods: ["in-person"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "General support work services in the Logan area including daily living assistance and community access.",
  },
  {
    providerSlug: "dubious-care-solutions",
    categorySlug: "personal-care",
    sa4Codes: ["304"],
    ageGroups: ["25-44", "45-64", "65+"],
    accessMethods: ["in-person"],
    languages: ["English"],
    telehealth: false,
    mobileService: true,
    description:
      "Personal care services in the Logan corridor including hygiene assistance, dressing support, and medication prompting.",
  },
];

// Reviews: [providerSlug, userEmail, rating, title, content, daysAgo]
interface ReviewDef {
  providerSlug: string;
  userEmail: string;
  rating: number;
  title: string;
  content: string;
  daysAgo: number;
}

const REVIEWS: ReviewDef[] = [
  // BrightCare - 5 reviews, avg ~4.6
  {
    providerSlug: "brightcare-support-services",
    userEmail: "sarah.johnson@test.com",
    rating: 5,
    title: "Outstanding support workers",
    content:
      "BrightCare has been absolutely fantastic. My support worker genuinely cares about helping me achieve my goals. The team is responsive, professional, and always willing to go the extra mile. I have been with them for over a year and the consistency has been excellent.",
    daysAgo: 30,
  },
  {
    providerSlug: "brightcare-support-services",
    userEmail: "mike.chen@test.com",
    rating: 5,
    title: "Great community programs",
    content:
      "The community participation programs at BrightCare are well organised and genuinely enjoyable. I have made real friends through the weekly social groups and feel much more connected to my community. The staff facilitate everything so naturally.",
    daysAgo: 60,
  },
  {
    providerSlug: "brightcare-support-services",
    userEmail: "emma.williams@test.com",
    rating: 4,
    title: "Very good but scheduling could improve",
    content:
      "Overall a great service. My support worker is wonderful and really understands my needs. The only area for improvement is scheduling. There have been a couple of times when shifts were changed at short notice, which was a bit stressful. Otherwise highly recommend.",
    daysAgo: 120,
  },
  {
    providerSlug: "brightcare-support-services",
    userEmail: "david.kumar@test.com",
    rating: 5,
    title: "Life-changing support",
    content:
      "BrightCare has genuinely changed my life. Their life skills program helped me learn to cook, budget, and use public transport independently. My confidence has grown enormously. The whole team is supportive and encouraging without being condescending.",
    daysAgo: 180,
  },
  {
    providerSlug: "brightcare-support-services",
    userEmail: "lisa.nguyen@test.com",
    rating: 4,
    title: "Reliable and caring",
    content:
      "I appreciate that BrightCare offers Mandarin and Vietnamese speaking support workers. It made a huge difference for my mother who is more comfortable communicating in Vietnamese. The team has been reliable and caring throughout our time with them.",
    daysAgo: 250,
  },
  // Active OT - 4 reviews, avg ~4.75
  {
    providerSlug: "active-ot-solutions",
    userEmail: "sarah.johnson@test.com",
    rating: 5,
    title: "Excellent OT assessment",
    content:
      "James and the Active OT team conducted a thorough functional assessment that really captured my needs. The report was comprehensive and helped my support coordinator build a much better plan. The home modification recommendations were practical and well thought out.",
    daysAgo: 45,
  },
  {
    providerSlug: "active-ot-solutions",
    userEmail: "emma.williams@test.com",
    rating: 5,
    title: "Great with assistive technology",
    content:
      "Active OT helped me find the right assistive technology to use my computer independently. The therapist was patient, knowledgeable, and took the time to trial several options before making a recommendation. The follow-up support was also excellent.",
    daysAgo: 90,
  },
  {
    providerSlug: "active-ot-solutions",
    userEmail: "david.kumar@test.com",
    rating: 4,
    title: "Very professional service",
    content:
      "Professional and thorough occupational therapy service. My therapist was skilled at identifying areas where I needed support and setting realistic goals. The only downside was a longer than expected wait for the initial appointment, but once in the service was excellent.",
    daysAgo: 200,
  },
  {
    providerSlug: "active-ot-solutions",
    userEmail: "lisa.nguyen@test.com",
    rating: 5,
    title: "Transformed our home",
    content:
      "Active OT assessed our home for modifications and the recommendations completely transformed how I move through my house. The bathroom modifications have made such a difference to my daily routine and independence. Highly recommend their home mod assessments.",
    daysAgo: 300,
  },
  // MindWell Psychology - 5 reviews, avg ~3.8
  {
    providerSlug: "mindwell-psychology",
    userEmail: "sarah.johnson@test.com",
    rating: 5,
    title: "Excellent psychologist",
    content:
      "My psychologist at MindWell is incredibly skilled and compassionate. The sessions have helped me develop better coping strategies and I feel much more equipped to manage my mental health. The telehealth option is also very convenient.",
    daysAgo: 40,
  },
  {
    providerSlug: "mindwell-psychology",
    userEmail: "mike.chen@test.com",
    rating: 4,
    title: "Good therapy, some admin issues",
    content:
      "The therapy itself is high quality and my psychologist has been excellent. However, the administrative side has had some hiccups including missed appointment reminders and slow invoice processing. It has improved recently though.",
    daysAgo: 100,
  },
  {
    providerSlug: "mindwell-psychology",
    userEmail: "emma.williams@test.com",
    rating: 3,
    title: "Mixed experience",
    content:
      "The clinical work is good when you can get an appointment. I had issues with long wait times and had to chase up my behaviour support plan several times. I understand they have had compliance issues which might explain the disruption. The therapy itself is helpful when it happens.",
    daysAgo: 150,
  },
  {
    providerSlug: "mindwell-psychology",
    userEmail: "david.kumar@test.com",
    rating: 3,
    title: "Concerned about compliance matters",
    content:
      "I was a bit worried when I learned about the conditions on MindWell's registration. My support coordinator helped me understand the situation. The actual therapy has been fine but the uncertainty was stressful. I hope they sort out their compliance issues soon.",
    daysAgo: 200,
  },
  {
    providerSlug: "mindwell-psychology",
    userEmail: "lisa.nguyen@test.com",
    rating: 4,
    title: "Helpful behaviour support",
    content:
      "The behaviour support team at MindWell developed a comprehensive plan for my son that has made a real difference at school and home. The practitioner was thorough and took the time to understand our family's situation before making recommendations.",
    daysAgo: 280,
  },
  // Sunshine Coast Physio - 3 reviews, avg ~4.33
  {
    providerSlug: "sunshine-coast-physio-rehab",
    userEmail: "mike.chen@test.com",
    rating: 5,
    title: "Fantastic physio on the coast",
    content:
      "Best physiotherapy I have received under my NDIS plan. The therapist took time to understand my condition and designed a rehab program that has significantly improved my mobility. The hydrotherapy sessions have been particularly beneficial.",
    daysAgo: 55,
  },
  {
    providerSlug: "sunshine-coast-physio-rehab",
    userEmail: "david.kumar@test.com",
    rating: 4,
    title: "Good rehabilitation program",
    content:
      "Solid physiotherapy service with knowledgeable staff. My exercise program has been well designed and progressive. Would love to see extended hours as the current scheduling can be tricky for those of us who work part-time.",
    daysAgo: 130,
  },
  {
    providerSlug: "sunshine-coast-physio-rehab",
    userEmail: "emma.williams@test.com",
    rating: 4,
    title: "Welcoming clinic environment",
    content:
      "The clinic is modern, accessible, and welcoming. The physio team is friendly and professional. My rehabilitation has progressed well since starting with them. Mobile visits to my home were also well managed.",
    daysAgo: 220,
  },
  // HomeFlex - 2 reviews, avg ~3.5
  {
    providerSlug: "homeflex-support",
    userEmail: "sarah.johnson@test.com",
    rating: 4,
    title: "Flexible and reliable",
    content:
      "HomeFlex lives up to its name. The flexibility in scheduling has been great for my routine. My support worker is consistent and has become a trusted part of my support team. Being unregistered was initially a concern but I have had no issues as a self-managed participant.",
    daysAgo: 70,
  },
  {
    providerSlug: "homeflex-support",
    userEmail: "lisa.nguyen@test.com",
    rating: 3,
    title: "Decent but limited area",
    content:
      "Good quality support within their coverage area. However, they only service the western suburbs which means I could not use them when I moved to the east side temporarily. The Cantonese-speaking support worker was a real bonus for my family though.",
    daysAgo: 160,
  },
  // NextStep Employment - 4 reviews, avg ~4.5
  {
    providerSlug: "nextstep-employment",
    userEmail: "mike.chen@test.com",
    rating: 5,
    title: "Got me my dream job",
    content:
      "NextStep helped me find and secure employment that genuinely suits my skills and interests. The interview coaching was incredibly helpful and having ongoing workplace support eased my transition into the role. I cannot recommend them highly enough.",
    daysAgo: 35,
  },
  {
    providerSlug: "nextstep-employment",
    userEmail: "emma.williams@test.com",
    rating: 4,
    title: "Great job readiness program",
    content:
      "The job readiness workshops at NextStep gave me skills I did not even know I needed. Resume writing, interview practice, even workplace social skills. My consultant was encouraging and realistic about the job market. Still looking but feeling much more prepared.",
    daysAgo: 80,
  },
  {
    providerSlug: "nextstep-employment",
    userEmail: "david.kumar@test.com",
    rating: 5,
    title: "Excellent SLES program",
    content:
      "My son completed the SLES program and it was transformative. The work experience placements were well matched and the transition support was thorough. He is now in supported employment and thriving. The NextStep team truly cares about outcomes.",
    daysAgo: 140,
  },
  {
    providerSlug: "nextstep-employment",
    userEmail: "lisa.nguyen@test.com",
    rating: 4,
    title: "Supportive employment service",
    content:
      "NextStep provides solid employment support with a good network of employer partners. The consultants are knowledgeable about disability employment and understand the challenges. Communication could be a bit more proactive but overall a very good service.",
    daysAgo: 260,
  },
  // Speak Easy - 3 reviews, avg ~4.67
  {
    providerSlug: "speak-easy-speech-pathology",
    userEmail: "sarah.johnson@test.com",
    rating: 5,
    title: "Amazing speech therapy for my child",
    content:
      "Speak Easy has been wonderful for my daughter's speech development. The therapist makes sessions fun and engaging while still making real progress on her goals. We have seen significant improvement in her communication over the past six months.",
    daysAgo: 50,
  },
  {
    providerSlug: "speak-easy-speech-pathology",
    userEmail: "david.kumar@test.com",
    rating: 5,
    title: "Expert AAC support",
    content:
      "The team at Speak Easy helped us set up an AAC device for my son and provided thorough training for our whole family. Their expertise in augmentative communication is outstanding. The school visits to train his teachers were especially valuable.",
    daysAgo: 110,
  },
  {
    providerSlug: "speak-easy-speech-pathology",
    userEmail: "lisa.nguyen@test.com",
    rating: 4,
    title: "Great early intervention speech",
    content:
      "Our toddler has been seeing a speech pathologist at Speak Easy for six months and the progress has been encouraging. The parent coaching aspect is really helpful as we learn strategies to support her communication at home throughout the week.",
    daysAgo: 190,
  },
  // GoldCoast Housing - 2 reviews, avg ~4.0
  {
    providerSlug: "goldcoast-disability-housing",
    userEmail: "mike.chen@test.com",
    rating: 4,
    title: "Quality accessible apartments",
    content:
      "The SDA apartment I moved into through GoldCoast Housing is well designed and genuinely accessible. The location near the tram line is great for my independence. The property management team is responsive to maintenance requests.",
    daysAgo: 75,
  },
  {
    providerSlug: "goldcoast-disability-housing",
    userEmail: "emma.williams@test.com",
    rating: 4,
    title: "Good SIL support",
    content:
      "The Supported Independent Living service is well structured with good staff. The house is comfortable and the support workers help me maintain my daily routine while encouraging me to do more independently. A good balance of support and independence.",
    daysAgo: 170,
  },
  // Caring Hands - 2 reviews, avg ~4.5
  {
    providerSlug: "caring-hands-plan-management",
    userEmail: "sarah.johnson@test.com",
    rating: 5,
    title: "Makes plan management easy",
    content:
      "Caring Hands has taken all the stress out of managing my NDIS budget. Invoices are processed quickly, the online portal is easy to use, and my plan manager is always available when I have questions. Best decision I made was switching to plan management.",
    daysAgo: 25,
  },
  {
    providerSlug: "caring-hands-plan-management",
    userEmail: "emma.williams@test.com",
    rating: 4,
    title: "Responsive plan management",
    content:
      "Very happy with Caring Hands. They process claims fast and the budget tracking through their portal keeps me informed about my spending. Occasionally the auto-generated emails could be clearer but the personal service from my plan manager makes up for it.",
    daysAgo: 95,
  },
  // Therapy Tree - 3 reviews, avg ~4.67
  {
    providerSlug: "therapy-tree-early-intervention",
    userEmail: "david.kumar@test.com",
    rating: 5,
    title: "Best early intervention service",
    content:
      "Therapy Tree is exceptional. Having OT, speech, and psychology all in one place means my daughter gets truly coordinated care. The therapists communicate with each other and align their approaches. The progress we have seen has exceeded our expectations.",
    daysAgo: 20,
  },
  {
    providerSlug: "therapy-tree-early-intervention",
    userEmail: "lisa.nguyen@test.com",
    rating: 5,
    title: "Wonderful team",
    content:
      "The team at Therapy Tree is passionate and skilled. Every session is engaging and purposeful. They involve us as parents in the therapy process which means we can support our child's development throughout the week, not just during sessions.",
    daysAgo: 85,
  },
  {
    providerSlug: "therapy-tree-early-intervention",
    userEmail: "mike.chen@test.com",
    rating: 4,
    title: "Great multi-disciplinary clinic",
    content:
      "Therapy Tree provides excellent multidisciplinary early intervention. The clinic is bright, child-friendly, and well equipped. My only minor critique is that school visits can sometimes be hard to schedule but the clinic sessions are consistently great.",
    daysAgo: 230,
  },
  // Outback Support Network - 1 review, 4 stars
  {
    providerSlug: "outback-support-network",
    userEmail: "emma.williams@test.com",
    rating: 4,
    title: "Great regional provider",
    content:
      "Finding NDIS support in Toowoomba was challenging until I connected with Outback Support Network. They understand the regional context and their support workers are genuine, caring people. Transport assistance has been a game changer for getting to appointments.",
    daysAgo: 65,
  },
  // Dubious Care - 1 review, 2 stars
  {
    providerSlug: "dubious-care-solutions",
    userEmail: "mike.chen@test.com",
    rating: 2,
    title: "Inconsistent service quality",
    content:
      "My experience with Dubious Care was disappointing. Support workers changed frequently with little notice, and there seemed to be a lack of supervision and training. Given the compliance actions I later learned about, I have moved to a different provider. I would advise others to check compliance records carefully.",
    daysAgo: 105,
  },
];

// Compliance actions
interface ComplianceActionDef {
  providerSlug: string;
  type: string;
  description: string;
  dateIssuedDaysAgo: number;
  dateResolvedDaysAgo?: number;
  isActive: boolean;
}

const COMPLIANCE_ACTIONS: ComplianceActionDef[] = [
  {
    providerSlug: "mindwell-psychology",
    type: "CONDITION_ON_REGISTRATION",
    description:
      "Conditions imposed following routine audit findings related to behaviour support plan documentation and reporting. MindWell Psychology is required to implement an improved documentation management system and provide evidence of staff retraining in record-keeping practices within 90 days.",
    dateIssuedDaysAgo: 60,
    isActive: true,
  },
  {
    providerSlug: "mindwell-psychology",
    type: "COMPLIANCE_NOTICE",
    description:
      "Compliance notice issued regarding timeliness of behaviour support plan lodgement with the NDIS Commission. The provider was found to have lodged several plans outside the required timeframe. This matter has been resolved following process improvements.",
    dateIssuedDaysAgo: 200,
    dateResolvedDaysAgo: 120,
    isActive: false,
  },
  {
    providerSlug: "dubious-care-solutions",
    type: "CONDITION_ON_REGISTRATION",
    description:
      "Conditions imposed following investigation into worker screening and supervision practices. Dubious Care Solutions is required to conduct retrospective NDIS Worker Screening Checks for all existing staff and implement a documented supervision framework within 60 days.",
    dateIssuedDaysAgo: 45,
    isActive: true,
  },
  {
    providerSlug: "dubious-care-solutions",
    type: "INFRINGEMENT_NOTICE",
    description:
      "Infringement notice issued for failure to notify the NDIS Commission of a reportable incident within the required 24-hour timeframe. The provider failed to report an incident involving a participant injury for seven business days.",
    dateIssuedDaysAgo: 90,
    isActive: true,
  },
  {
    providerSlug: "dubious-care-solutions",
    type: "COMPLIANCE_NOTICE",
    description:
      "Compliance notice issued regarding inadequate incident management procedures and record keeping. The provider was required to develop and implement a compliant incident management system. This matter was resolved following system implementation.",
    dateIssuedDaysAgo: 180,
    dateResolvedDaysAgo: 100,
    isActive: false,
  },
];

// Postcode mappings
const POSTCODE_MAPPINGS = [
  { postcode: "4000", suburb: "Brisbane City", state: "QLD", sa4Code: "301", latitude: -27.468, longitude: 153.024 },
  { postcode: "4006", suburb: "Fortitude Valley", state: "QLD", sa4Code: "301", latitude: -27.456, longitude: 153.035 },
  { postcode: "4064", suburb: "Paddington", state: "QLD", sa4Code: "305", latitude: -27.461, longitude: 152.999 },
  { postcode: "4066", suburb: "Toowong", state: "QLD", sa4Code: "305", latitude: -27.486, longitude: 152.985 },
  { postcode: "4101", suburb: "South Brisbane", state: "QLD", sa4Code: "301", latitude: -27.478, longitude: 153.018 },
  { postcode: "4102", suburb: "Woolloongabba", state: "QLD", sa4Code: "301", latitude: -27.488, longitude: 153.035 },
  { postcode: "4114", suburb: "Logan Central", state: "QLD", sa4Code: "304", latitude: -27.639, longitude: 153.109 },
  { postcode: "4152", suburb: "Camp Hill", state: "QLD", sa4Code: "302", latitude: -27.492, longitude: 153.075 },
  { postcode: "4217", suburb: "Surfers Paradise", state: "QLD", sa4Code: "306", latitude: -27.999, longitude: 153.431 },
  { postcode: "4350", suburb: "Toowoomba", state: "QLD", sa4Code: "309", latitude: -27.561, longitude: 151.954 },
  { postcode: "4558", suburb: "Maroochydore", state: "QLD", sa4Code: "307", latitude: -26.654, longitude: 153.091 },
  { postcode: "4011", suburb: "Clayfield", state: "QLD", sa4Code: "303", latitude: -27.417, longitude: 153.058 },
  { postcode: "4030", suburb: "Wooloowin", state: "QLD", sa4Code: "303", latitude: -27.412, longitude: 153.044 },
  { postcode: "4053", suburb: "Stafford", state: "QLD", sa4Code: "303", latitude: -27.408, longitude: 153.015 },
  { postcode: "4105", suburb: "Moorooka", state: "QLD", sa4Code: "304", latitude: -27.525, longitude: 153.026 },
  { postcode: "4121", suburb: "Holland Park", state: "QLD", sa4Code: "302", latitude: -27.518, longitude: 153.07 },
  { postcode: "4170", suburb: "Cannon Hill", state: "QLD", sa4Code: "302", latitude: -27.468, longitude: 153.096 },
  { postcode: "4209", suburb: "Coomera", state: "QLD", sa4Code: "306", latitude: -27.862, longitude: 153.344 },
  { postcode: "4215", suburb: "Southport", state: "QLD", sa4Code: "306", latitude: -27.967, longitude: 153.401 },
  { postcode: "4220", suburb: "Burleigh Heads", state: "QLD", sa4Code: "306", latitude: -28.087, longitude: 153.447 },
];

// SA4 Regions
const SA4_REGIONS = [
  { code: "301", name: "Brisbane Inner City", state: "QLD" },
  { code: "302", name: "Brisbane-East", state: "QLD" },
  { code: "303", name: "Brisbane-North", state: "QLD" },
  { code: "304", name: "Brisbane-South", state: "QLD" },
  { code: "305", name: "Brisbane-West", state: "QLD" },
  { code: "306", name: "Gold Coast", state: "QLD" },
  { code: "307", name: "Sunshine Coast", state: "QLD" },
  { code: "309", name: "Toowoomba", state: "QLD" },
  { code: "310", name: "Cairns", state: "QLD" },
  { code: "311", name: "Townsville", state: "QLD" },
];

// Blog posts
const BLOG_POSTS = [
  {
    title: "Understanding Your NDIS Plan: A Guide to Plan Management Options",
    slug: "understanding-ndis-plan-management-options",
    content: `<h2>What is Plan Management?</h2>
<p>When you receive your NDIS plan, one of the most important decisions you will make is how to manage the funding. The NDIS offers three management options: self-managed, plan-managed, and NDIA-managed. Each option offers different levels of flexibility and control over your supports.</p>

<h2>Self-Managed</h2>
<p>Self-management gives you the most flexibility. You can choose any provider, including unregistered providers, and you handle your own invoices, payments, and record-keeping. This option works well for participants who want maximum choice and are comfortable managing financial administration or have someone who can help.</p>

<h2>Plan-Managed</h2>
<p>With plan management, a registered plan manager handles the financial side of your plan on your behalf. You still get to choose your own providers, including unregistered providers, but the plan manager processes invoices, tracks your budget, and makes payments. This is a popular option that balances flexibility with convenience.</p>

<h2>NDIA-Managed</h2>
<p>If your plan is NDIA-managed, the National Disability Insurance Agency manages your funding directly. You can only use NDIS registered providers, and invoices are submitted through the NDIS portal. This option offers less flexibility but requires the least administrative effort from participants.</p>

<h2>Choosing the Right Option</h2>
<p>There is no one-size-fits-all answer. Consider your confidence with financial administration, how important provider choice is to you, and whether you have support to help manage paperwork. Many participants find that plan management offers the best balance of flexibility and ease. You can also have different management types for different parts of your plan.</p>

<p>Talk to your Local Area Coordinator or support coordinator to discuss which management option best suits your situation and goals.</p>`,
    excerpt:
      "Learn about the three NDIS plan management options and how to choose the right one for your situation. We break down self-managed, plan-managed, and NDIA-managed funding.",
    authorName: "Sarah Mitchell",
    authorRole: "NDIS Plan Management Specialist",
    publishedDaysAgo: 14,
    tags: ["NDIS", "Plan Management", "Self-Managed", "Funding"],
  },
  {
    title: "How to Find the Right NDIS Provider: Tips for Participants and Families",
    slug: "how-to-find-right-ndis-provider",
    content: `<h2>Starting Your Provider Search</h2>
<p>Finding the right NDIS provider can feel overwhelming, especially if you are new to the scheme. With thousands of registered and unregistered providers across Australia, knowing where to start is half the battle. This guide shares practical tips to help you find providers who are the right fit for your needs and goals.</p>

<h2>Define Your Priorities</h2>
<p>Before you start searching, take some time to think about what matters most to you. Consider the type of support you need, your preferred location or whether you want mobile services, any language or cultural considerations, and whether experience with your specific disability type is important. Writing these priorities down gives you a clear framework for evaluating providers.</p>

<h2>Use Provider Directories</h2>
<p>Online provider directories like this one allow you to search for providers by service type, location, and other criteria. Look for directories that include reviews from other participants, compliance information, and detailed service descriptions. This transparency helps you make informed decisions.</p>

<h2>Check Registration and Compliance</h2>
<p>If your plan is NDIA-managed, you must use registered providers. Even if you have more flexibility with plan-managed or self-managed funding, checking a provider's registration status and any compliance actions is an important step. The NDIS Quality and Safeguards Commission publishes compliance and enforcement actions, and many provider directories display this information alongside provider profiles.</p>

<h2>Ask for Recommendations</h2>
<p>Word of mouth remains one of the most valuable ways to find good providers. Ask your support coordinator, Local Area Coordinator, other participants, or disability peer support groups for recommendations. Online reviews from verified NDIS participants can also provide helpful insights.</p>

<h2>Try Before You Commit</h2>
<p>Most providers will offer an initial meeting or trial session. Use this opportunity to assess whether the provider understands your goals, communicates in a way that works for you, and feels like a good fit. Remember, you always have the right to change providers if something is not working.</p>`,
    excerpt:
      "Practical tips for NDIS participants and families on finding the right disability service provider. From defining priorities to checking compliance records.",
    authorName: "Angela Martinez",
    authorRole: "Support Coordinator",
    publishedDaysAgo: 35,
    tags: ["NDIS", "Provider Search", "Tips", "Support Coordination"],
  },
  {
    title: "Early Childhood Intervention Under the NDIS: What Parents Need to Know",
    slug: "early-childhood-intervention-ndis-guide",
    content: `<h2>What is Early Childhood Intervention?</h2>
<p>Early Childhood Intervention (ECI) refers to support services for children aged 0 to 9 with developmental delays or disabilities. Research consistently shows that early intervention can significantly improve developmental outcomes, and the NDIS funds a range of ECI supports to help children reach their full potential.</p>

<h2>The NDIS Early Childhood Approach</h2>
<p>The NDIS Early Childhood Approach is designed to support young children and their families as early as possible. An Early Childhood Partner, often called an Early Childhood Early Intervention (ECEI) partner, works with families to understand their child's needs and connect them with the right supports. Not all children need a full NDIS plan; some may benefit from short-term early intervention or community-based supports.</p>

<h2>Types of Early Intervention Supports</h2>
<p>NDIS-funded early intervention can include speech pathology, occupational therapy, physiotherapy, psychology, behaviour support, and specialist early childhood programs. Many providers offer multidisciplinary teams where therapists work together to provide coordinated, holistic support tailored to each child's developmental needs.</p>

<h2>Choosing an ECI Provider</h2>
<p>When selecting an ECI provider, consider their experience with your child's specific needs, whether they offer multidisciplinary services, their approach to family involvement, and practical factors like location, session times, and waitlists. Visiting the clinic, meeting the therapists, and asking about their therapeutic approach can help you find the right fit.</p>

<h2>The Role of Parents and Carers</h2>
<p>Parents and carers are essential partners in early intervention. The most effective ECI programs actively involve families in therapy sessions and provide coaching and strategies that can be used at home and in everyday routines. Your knowledge of your child is invaluable, and a good provider will recognise and harness this expertise.</p>

<h2>Getting Started</h2>
<p>If you have concerns about your child's development, the first step is to speak with your GP or child health nurse. They can refer you to the NDIS Early Childhood Approach if appropriate. You do not need a diagnosis to access early intervention supports through the NDIS, as eligibility can be based on developmental delay.</p>`,
    excerpt:
      "A guide for parents on early childhood intervention under the NDIS. Learn about the Early Childhood Approach, types of supports available, and how to choose the right provider.",
    authorName: "Dr. Priya Sharma",
    authorRole: "Clinical Psychologist",
    publishedDaysAgo: 60,
    tags: [
      "NDIS",
      "Early Intervention",
      "Children",
      "Therapy",
      "Parents",
    ],
  },
];

// Service Requests
interface ServiceRequestDef {
  userEmail: string;
  categorySlug: string;
  description: string;
  postcode: string;
  sa4Code: string;
  suburb: string;
  state: string;
  ageGroup: string;
  accessMethod: string;
  status: string;
  matchProviderSlugs: string[];
  matchStatuses: string[];
  daysAgo: number;
  expiresInDays: number;
}

const SERVICE_REQUESTS: ServiceRequestDef[] = [
  {
    userEmail: "sarah.johnson@test.com",
    categorySlug: "occupational-therapy",
    description:
      "Looking for an occupational therapist in the Brisbane area who can conduct a home assessment and recommend modifications for wheelchair accessibility. I need someone who is experienced with physical disability and can also help with assistive technology recommendations.",
    postcode: "4000",
    sa4Code: "301",
    suburb: "Brisbane City",
    state: "QLD",
    ageGroup: "25-44",
    accessMethod: "mobile",
    status: "MATCHED",
    matchProviderSlugs: ["active-ot-solutions", "therapy-tree-early-intervention"],
    matchStatuses: ["ACCEPTED", "OPEN"],
    daysAgo: 5,
    expiresInDays: 25,
  },
  {
    userEmail: "mike.chen@test.com",
    categorySlug: "speech-therapy",
    description:
      "Seeking a speech pathologist for my 4-year-old daughter who has been diagnosed with a speech delay. We would prefer clinic-based sessions in Brisbane's eastern suburbs. Experience with paediatric clients and play-based therapy approaches would be ideal.",
    postcode: "4152",
    sa4Code: "302",
    suburb: "Camp Hill",
    state: "QLD",
    ageGroup: "0-6",
    accessMethod: "in-person",
    status: "MATCHED",
    matchProviderSlugs: ["speak-easy-speech-pathology", "therapy-tree-early-intervention"],
    matchStatuses: ["ACCEPTED", "DECLINED"],
    daysAgo: 10,
    expiresInDays: 20,
  },
  {
    userEmail: "emma.williams@test.com",
    categorySlug: "plan-management",
    description:
      "Need a plan manager who can process claims quickly and provides a good online portal for budget tracking. I am currently self-managing but finding the admin too time-consuming. Prefer a provider who services the broader SEQ region.",
    postcode: "4101",
    sa4Code: "301",
    suburb: "South Brisbane",
    state: "QLD",
    ageGroup: "25-44",
    accessMethod: "telehealth",
    status: "MATCHED",
    matchProviderSlugs: ["caring-hands-plan-management"],
    matchStatuses: ["ACCEPTED"],
    daysAgo: 3,
    expiresInDays: 27,
  },
  {
    userEmail: "david.kumar@test.com",
    categorySlug: "employment-support",
    description:
      "Looking for employment support for my son who is finishing school this year. He has autism spectrum disorder and would benefit from a structured SLES program with work experience placements. We are based in Brisbane's north side.",
    postcode: "4053",
    sa4Code: "303",
    suburb: "Stafford",
    state: "QLD",
    ageGroup: "18-25",
    accessMethod: "in-person",
    status: "OPEN",
    matchProviderSlugs: ["nextstep-employment"],
    matchStatuses: ["OPEN"],
    daysAgo: 2,
    expiresInDays: 28,
  },
  {
    userEmail: "lisa.nguyen@test.com",
    categorySlug: "support-work",
    description:
      "Looking for a support worker in the Toowoomba area who can help with community participation and daily living tasks. Would love someone who is patient, reliable, and enjoys outdoor activities. Two to three sessions per week preferred.",
    postcode: "4350",
    sa4Code: "309",
    suburb: "Toowoomba",
    state: "QLD",
    ageGroup: "25-44",
    accessMethod: "in-person",
    status: "OPEN",
    matchProviderSlugs: ["outback-support-network"],
    matchStatuses: ["OPEN"],
    daysAgo: 1,
    expiresInDays: 29,
  },
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function main() {
  console.log("==============================================");
  console.log("  NDIS Provider Directory - Test Data Seeder  ");
  console.log("==============================================\n");

  // ------------------------------------------------------------------
  // Step 0: Verify required service categories exist
  // ------------------------------------------------------------------
  console.log("[0/11] Verifying service categories exist...");
  const requiredSlugs = new Set<string>();
  for (const p of TEST_PROVIDERS) {
    for (const s of p.categorySlugs) requiredSlugs.add(s);
  }
  for (const o of SERVICE_OFFERINGS) {
    requiredSlugs.add(o.categorySlug);
  }
  for (const sr of SERVICE_REQUESTS) {
    requiredSlugs.add(sr.categorySlug);
  }

  const existingCategories = await prisma.serviceCategory.findMany({
    select: { id: true, slug: true },
  });
  const categoryMap = new Map(existingCategories.map((c) => [c.slug, c.id]));

  const missingSlugs = [...requiredSlugs].filter((s) => !categoryMap.has(s));
  if (missingSlugs.length > 0) {
    console.error(
      `\nERROR: The following service categories are missing from the database:\n  ${missingSlugs.join("\n  ")}\n`
    );
    console.error(
      "Run the category seed first: npx tsx scripts/seed-categories.ts"
    );
    process.exit(1);
  }
  console.log(`  Found ${existingCategories.length} categories. All required slugs present.\n`);

  // ------------------------------------------------------------------
  // Step 1: Clean up existing test data
  // ------------------------------------------------------------------
  console.log("[1/11] Cleaning up existing test data...");

  // Find test user IDs
  const testEmails = TEST_USERS.map((u) => u.email);
  const existingTestUsers = await prisma.user.findMany({
    where: { email: { in: testEmails } },
    select: { id: true, email: true },
  });
  const existingUserIds = existingTestUsers.map((u) => u.id);

  // Find test provider slugs
  const testProviderSlugs = TEST_PROVIDERS.map((p) => p.slug);
  const existingTestProviders = await prisma.provider.findMany({
    where: { slug: { in: testProviderSlugs } },
    select: { id: true, slug: true },
  });
  const existingProviderIds = existingTestProviders.map((p) => p.id);

  // Delete in dependency order
  if (existingProviderIds.length > 0) {
    await prisma.serviceRequestMatch.deleteMany({
      where: { providerId: { in: existingProviderIds } },
    });
    await prisma.complianceAction.deleteMany({
      where: { providerId: { in: existingProviderIds } },
    });
    await prisma.serviceOffering.deleteMany({
      where: { providerId: { in: existingProviderIds } },
    });
    await prisma.providerCategory.deleteMany({
      where: { providerId: { in: existingProviderIds } },
    });
    await prisma.providerPhoto.deleteMany({
      where: { providerId: { in: existingProviderIds } },
    });
    await prisma.review.deleteMany({
      where: { providerId: { in: existingProviderIds } },
    });
    await prisma.providerMember.deleteMany({
      where: { providerId: { in: existingProviderIds } },
    });
    await prisma.provider.deleteMany({
      where: { id: { in: existingProviderIds } },
    });
  }

  if (existingUserIds.length > 0) {
    await prisma.serviceRequestMatch.deleteMany({
      where: {
        serviceRequest: { userId: { in: existingUserIds } },
      },
    });
    await prisma.serviceRequest.deleteMany({
      where: { userId: { in: existingUserIds } },
    });
    await prisma.review.deleteMany({
      where: { userId: { in: existingUserIds } },
    });
    await prisma.notificationSettings.deleteMany({
      where: { userId: { in: existingUserIds } },
    });
    await prisma.session.deleteMany({
      where: { userId: { in: existingUserIds } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: existingUserIds } },
    });
  }

  // Clean up test blog posts
  const testBlogSlugs = BLOG_POSTS.map((b) => b.slug);
  await prisma.blogPost.deleteMany({
    where: { slug: { in: testBlogSlugs } },
  });

  // Clean up test postcode mappings and SA4 regions
  const testPostcodes = POSTCODE_MAPPINGS.map((p) => p.postcode);
  await prisma.postcodeMapping.deleteMany({
    where: { postcode: { in: testPostcodes } },
  });
  const testSA4Codes = SA4_REGIONS.map((r) => r.code);
  await prisma.sA4Region.deleteMany({
    where: { code: { in: testSA4Codes } },
  });

  console.log("  Cleaned up existing test data.\n");

  // ------------------------------------------------------------------
  // Step 2: Hash password
  // ------------------------------------------------------------------
  console.log("[2/11] Hashing test password...");
  const passwordHash = await hash(TEST_PASSWORD, BCRYPT_ROUNDS);
  console.log("  Password hashed.\n");

  // ------------------------------------------------------------------
  // Step 3: Create users
  // ------------------------------------------------------------------
  console.log("[3/11] Creating test users...");
  const userMap = new Map<string, string>(); // email -> id

  for (const userData of TEST_USERS) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        passwordHash,
        emailVerified: new Date(),
        createdAt: daysAgo(randomBetween(90, 365)),
      },
    });
    userMap.set(userData.email, user.id);
    console.log(`  + ${userData.name} (${userData.email}) [${userData.role}]`);
  }
  console.log(`  Created ${TEST_USERS.length} users.\n`);

  // ------------------------------------------------------------------
  // Step 4: Create providers
  // ------------------------------------------------------------------
  console.log("[4/11] Creating test providers...");
  const providerMap = new Map<string, string>(); // slug -> id

  for (const pData of TEST_PROVIDERS) {
    const provider = await prisma.provider.create({
      data: {
        name: pData.name,
        slug: pData.slug,
        abn: pData.abn,
        description: pData.description,
        email: pData.email,
        phone: pData.phone,
        address: pData.address,
        suburb: pData.suburb,
        state: pData.state,
        postcode: pData.postcode,
        latitude: pData.latitude,
        longitude: pData.longitude,
        ndisRegistered: pData.ndisRegistered,
        registrationStatus: pData.registrationStatus,
        ndisProviderNumber: pData.ndisProviderNumber || null,
        tier: pData.tier,
        accredited: pData.accredited,
        verifiedAt: pData.accredited ? daysAgo(pData.createdDaysAgo - 10) : null,
        createdAt: daysAgo(pData.createdDaysAgo),
      },
    });
    providerMap.set(pData.slug, provider.id);
    console.log(`  + ${pData.name} (${pData.slug}) [${pData.tier}, ${pData.registrationStatus}]`);
  }
  console.log(`  Created ${TEST_PROVIDERS.length} providers.\n`);

  // ------------------------------------------------------------------
  // Step 5: Create provider members
  // ------------------------------------------------------------------
  console.log("[5/11] Linking provider admins...");
  for (const pm of PROVIDER_MEMBERS) {
    const userId = userMap.get(pm.email);
    const providerId = providerMap.get(pm.providerSlug);
    if (!userId || !providerId) {
      console.error(`  WARN: Could not link ${pm.email} -> ${pm.providerSlug}`);
      continue;
    }
    await prisma.providerMember.create({
      data: { userId, providerId, role: "admin" },
    });
    console.log(`  + ${pm.email} -> ${pm.providerSlug}`);
  }
  console.log(`  Linked ${PROVIDER_MEMBERS.length} provider members.\n`);

  // ------------------------------------------------------------------
  // Step 6: Create provider categories and service offerings
  // ------------------------------------------------------------------
  console.log("[6/11] Creating provider categories and service offerings...");

  // Provider categories
  let categoryLinkCount = 0;
  for (const pData of TEST_PROVIDERS) {
    const providerId = providerMap.get(pData.slug)!;
    for (const catSlug of pData.categorySlugs) {
      const categoryId = categoryMap.get(catSlug);
      if (!categoryId) {
        console.error(`  WARN: Category slug '${catSlug}' not found for ${pData.slug}`);
        continue;
      }
      await prisma.providerCategory.create({
        data: { providerId, categoryId },
      });
      categoryLinkCount++;
    }
  }
  console.log(`  Created ${categoryLinkCount} provider-category links.`);

  // Service offerings
  let offeringCount = 0;
  for (const o of SERVICE_OFFERINGS) {
    const providerId = providerMap.get(o.providerSlug);
    const categoryId = categoryMap.get(o.categorySlug);
    if (!providerId || !categoryId) {
      console.error(
        `  WARN: Could not create offering ${o.categorySlug} for ${o.providerSlug}`
      );
      continue;
    }
    await prisma.serviceOffering.create({
      data: {
        providerId,
        categoryId,
        description: o.description,
        sa4Codes: o.sa4Codes,
        ageGroups: o.ageGroups,
        accessMethods: o.accessMethods,
        languages: o.languages,
        telehealth: o.telehealth,
        mobileService: o.mobileService,
        isActive: true,
        postcodes: [],
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        createdAt: daysAgo(randomBetween(30, 150)),
      },
    });
    offeringCount++;
  }
  console.log(`  Created ${offeringCount} service offerings.\n`);

  // ------------------------------------------------------------------
  // Step 7: Create reviews
  // ------------------------------------------------------------------
  console.log("[7/11] Creating reviews...");
  let reviewCount = 0;
  for (const r of REVIEWS) {
    const providerId = providerMap.get(r.providerSlug);
    const userId = userMap.get(r.userEmail);
    if (!providerId || !userId) {
      console.error(
        `  WARN: Could not create review for ${r.providerSlug} by ${r.userEmail}`
      );
      continue;
    }
    await prisma.review.create({
      data: {
        providerId,
        userId,
        rating: r.rating,
        title: r.title,
        content: r.content,
        isVerified: true,
        isPublished: true,
        createdAt: daysAgo(r.daysAgo),
      },
    });
    reviewCount++;
  }
  console.log(`  Created ${reviewCount} reviews.\n`);

  // ------------------------------------------------------------------
  // Step 8: Create compliance actions
  // ------------------------------------------------------------------
  console.log("[8/11] Creating compliance actions...");
  for (const ca of COMPLIANCE_ACTIONS) {
    const providerId = providerMap.get(ca.providerSlug);
    if (!providerId) {
      console.error(`  WARN: Provider '${ca.providerSlug}' not found for compliance action`);
      continue;
    }
    await prisma.complianceAction.create({
      data: {
        providerId,
        type: ca.type as any,
        description: ca.description,
        dateIssued: daysAgo(ca.dateIssuedDaysAgo),
        dateResolved: ca.dateResolvedDaysAgo
          ? daysAgo(ca.dateResolvedDaysAgo)
          : null,
        isActive: ca.isActive,
      },
    });
    console.log(
      `  + ${ca.providerSlug}: ${ca.type} (${ca.isActive ? "ACTIVE" : "RESOLVED"})`
    );
  }
  console.log(`  Created ${COMPLIANCE_ACTIONS.length} compliance actions.\n`);

  // ------------------------------------------------------------------
  // Step 9: Create postcode mappings and SA4 regions
  // ------------------------------------------------------------------
  console.log("[9/11] Creating postcode mappings and SA4 regions...");

  // Build postcodes list per SA4 code for the SA4 regions
  const sa4PostcodeMap = new Map<string, string[]>();
  for (const pm of POSTCODE_MAPPINGS) {
    if (!sa4PostcodeMap.has(pm.sa4Code)) {
      sa4PostcodeMap.set(pm.sa4Code, []);
    }
    sa4PostcodeMap.get(pm.sa4Code)!.push(pm.postcode);
  }

  for (const region of SA4_REGIONS) {
    const postcodes = sa4PostcodeMap.get(region.code) || [];
    await prisma.sA4Region.upsert({
      where: { code: region.code },
      update: {
        name: region.name,
        state: region.state,
        postcodes,
      },
      create: {
        code: region.code,
        name: region.name,
        state: region.state,
        postcodes,
      },
    });
  }
  console.log(`  Created ${SA4_REGIONS.length} SA4 regions.`);

  for (const pm of POSTCODE_MAPPINGS) {
    await prisma.postcodeMapping.upsert({
      where: { postcode: pm.postcode },
      update: {
        suburb: pm.suburb,
        state: pm.state,
        sa4Code: pm.sa4Code,
        latitude: pm.latitude,
        longitude: pm.longitude,
      },
      create: {
        postcode: pm.postcode,
        suburb: pm.suburb,
        state: pm.state,
        sa4Code: pm.sa4Code,
        latitude: pm.latitude,
        longitude: pm.longitude,
      },
    });
  }
  console.log(`  Created ${POSTCODE_MAPPINGS.length} postcode mappings.\n`);

  // ------------------------------------------------------------------
  // Step 10: Create blog posts
  // ------------------------------------------------------------------
  console.log("[10/11] Creating blog posts...");
  for (const bp of BLOG_POSTS) {
    await prisma.blogPost.create({
      data: {
        title: bp.title,
        slug: bp.slug,
        content: bp.content,
        excerpt: bp.excerpt,
        authorName: bp.authorName,
        authorRole: bp.authorRole,
        isPublished: true,
        publishedAt: daysAgo(bp.publishedDaysAgo),
        tags: bp.tags,
        createdAt: daysAgo(bp.publishedDaysAgo + 2),
      },
    });
    console.log(`  + "${bp.title}"`);
  }
  console.log(`  Created ${BLOG_POSTS.length} blog posts.\n`);

  // ------------------------------------------------------------------
  // Step 11: Create service requests with matches
  // ------------------------------------------------------------------
  console.log("[11/11] Creating service requests with matches...");
  for (const sr of SERVICE_REQUESTS) {
    const userId = userMap.get(sr.userEmail);
    const categoryId = categoryMap.get(sr.categorySlug);
    if (!userId) {
      console.error(`  WARN: User '${sr.userEmail}' not found for service request`);
      continue;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + sr.expiresInDays);

    const request = await prisma.serviceRequest.create({
      data: {
        userId,
        categoryId: categoryId || null,
        description: sr.description,
        postcode: sr.postcode,
        sa4Code: sr.sa4Code,
        suburb: sr.suburb,
        state: sr.state,
        ageGroup: sr.ageGroup,
        accessMethod: sr.accessMethod,
        status: sr.status as any,
        maxProviders: 3,
        expiresAt,
        createdAt: daysAgo(sr.daysAgo),
      },
    });

    // Create matches
    for (let i = 0; i < sr.matchProviderSlugs.length; i++) {
      const providerId = providerMap.get(sr.matchProviderSlugs[i]);
      if (!providerId) {
        console.error(
          `  WARN: Provider '${sr.matchProviderSlugs[i]}' not found for service request match`
        );
        continue;
      }
      const matchStatus = sr.matchStatuses[i] || "OPEN";
      await prisma.serviceRequestMatch.create({
        data: {
          serviceRequestId: request.id,
          providerId,
          status: matchStatus as any,
          reservedAt: daysAgo(sr.daysAgo),
          acceptedAt: matchStatus === "ACCEPTED" ? daysAgo(sr.daysAgo - 1) : null,
          declinedAt: matchStatus === "DECLINED" ? daysAgo(sr.daysAgo - 1) : null,
        },
      });
    }

    console.log(
      `  + ${sr.userEmail} -> ${sr.categorySlug} [${sr.status}] (${sr.matchProviderSlugs.length} matches)`
    );
  }
  console.log(`  Created ${SERVICE_REQUESTS.length} service requests.\n`);

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  console.log("==============================================");
  console.log("  Seed Complete! Summary:");
  console.log("==============================================");
  console.log(`  Users:              ${TEST_USERS.length}`);
  console.log(`  Providers:          ${TEST_PROVIDERS.length}`);
  console.log(`  Provider Members:   ${PROVIDER_MEMBERS.length}`);
  console.log(`  Category Links:     ${categoryLinkCount}`);
  console.log(`  Service Offerings:  ${offeringCount}`);
  console.log(`  Reviews:            ${reviewCount}`);
  console.log(`  Compliance Actions: ${COMPLIANCE_ACTIONS.length}`);
  console.log(`  SA4 Regions:        ${SA4_REGIONS.length}`);
  console.log(`  Postcode Mappings:  ${POSTCODE_MAPPINGS.length}`);
  console.log(`  Blog Posts:         ${BLOG_POSTS.length}`);
  console.log(`  Service Requests:   ${SERVICE_REQUESTS.length}`);
  console.log("----------------------------------------------");
  console.log(`  Password for all test accounts: ${TEST_PASSWORD}`);
  console.log("==============================================\n");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
