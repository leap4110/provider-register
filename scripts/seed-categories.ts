import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-+/g, "-");
}

const categories = [
  { name: "Support Work", icon: "heart-handshake" },
  { name: "Support Coordination", icon: "compass" },
  { name: "Specialist Support Coordination", icon: "shield-check" },
  { name: "Plan Management", icon: "calculator" },
  { name: "Occupational Therapy", icon: "accessibility" },
  { name: "Physiotherapy", icon: "activity" },
  { name: "Speech Therapy", icon: "message-circle" },
  { name: "Psychology", icon: "brain" },
  { name: "Behaviour Support", icon: "shield" },
  { name: "Exercise Physiology", icon: "dumbbell" },
  { name: "Dietetics", icon: "apple" },
  { name: "Nursing", icon: "stethoscope" },
  { name: "Personal Care", icon: "hand-helping" },
  { name: "Domestic Assistance", icon: "home" },
  { name: "Community Participation", icon: "users" },
  { name: "Gardening", icon: "flower-2" },
  { name: "Cleaning", icon: "sparkles" },
  { name: "Home Modifications", icon: "wrench" },
  { name: "Vehicle Modifications", icon: "car" },
  { name: "Assistive Technology", icon: "smartphone" },
  { name: "Specialist Disability Accommodation", icon: "building" },
  { name: "Supported Independent Living", icon: "house" },
  { name: "Short Term Accommodation / Respite", icon: "bed" },
  { name: "Medium Term Accommodation", icon: "door-open" },
  { name: "Transport", icon: "bus" },
  { name: "Employment Support", icon: "briefcase" },
  { name: "Art Therapy", icon: "palette" },
  { name: "Music Therapy", icon: "music" },
  { name: "Counselling", icon: "heart" },
  { name: "Social Work", icon: "hand-heart" },
  { name: "Life Skills Development", icon: "graduation-cap" },
  { name: "Early Childhood Intervention", icon: "baby" },
  { name: "School Leaver Employment Supports", icon: "backpack" },
  { name: "Group Activities", icon: "users-round" },
  { name: "Meal Preparation", icon: "cooking-pot" },
  { name: "Interpreting and Translation", icon: "languages" },
  { name: "Podiatry", icon: "footprints" },
  { name: "Orthotics and Prosthetics", icon: "cog" },
  { name: "Vision Support", icon: "eye" },
  { name: "Hearing Support", icon: "ear" },
  { name: "Recovery Coaching", icon: "refresh-cw" },
  { name: "Peer Support", icon: "handshake" },
  { name: "Advocacy", icon: "megaphone" },
  { name: "Yard Maintenance", icon: "trees" },
];

async function main() {
  console.log("Seeding service categories...");

  for (const category of categories) {
    const slug = toSlug(category.name);

    await prisma.serviceCategory.upsert({
      where: { slug },
      update: {
        name: category.name,
        icon: category.icon,
      },
      create: {
        name: category.name,
        slug,
        icon: category.icon,
      },
    });

    console.log(`  ✓ ${category.name} (${slug})`);
  }

  console.log(`\nSeeded ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
