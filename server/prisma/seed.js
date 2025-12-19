const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Hash passwords for test users
  const saltRounds = 10;
  const tenantPassword = await bcrypt.hash("password123", saltRounds);
  const landlordPassword = await bcrypt.hash("password123", saltRounds);

  // Create a test complex
  const complex = await prisma.complex.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Sunset Apartments",
      address: "123 Main Street, Anytown, USA",
    },
  });

  console.log("✅ Created complex:", complex.name);

  // Create a test tenant user
  const tenant = await prisma.user.upsert({
    where: { email: "tenant@example.com" },
    update: {},
    create: {
      email: "tenant@example.com",
      password_hash: tenantPassword,
      role: "TENANT",
      first_name: "John",
      last_name: "Doe",
      phone: "555-0123",
      apartment_number: "4B",
      building_name: "Building A",
      complex_id: complex.id,
      move_in_date: new Date("2024-01-15"),
    },
  });

  console.log("✅ Created tenant user:", tenant.email);

  // Create a test landlord user
  const landlord = await prisma.user.upsert({
    where: { email: "landlord@example.com" },
    update: {},
    create: {
      email: "landlord@example.com",
      password_hash: landlordPassword,
      role: "LANDLORD",
      first_name: "Jane",
      last_name: "Smith",
      phone: "555-0456",
      apartment_number: "Office",
      building_name: "Main Office",
      complex_id: complex.id,
      move_in_date: new Date("2020-01-01"),
    },
  });

  console.log("✅ Created landlord user:", landlord.email);

  // Create a test issue
  const issue = await prisma.issue.create({
    data: {
      title: "Leaky faucet in kitchen",
      description:
        "The kitchen sink faucet has been dripping constantly for the past week.",
      category: "PLUMBING",
      priority: "MEDIUM",
      status: "OPEN",
      location: "Kitchen",
      user_id: tenant.id,
      complex_id: complex.id,
    },
  });

  console.log("✅ Created test issue:", issue.title);

  // Create a test message
  const message = await prisma.message.create({
    data: {
      issue_id: issue.id,
      sender_id: tenant.id,
      sender_type: "TENANT",
      message_text: "This has been going on for a week now. Please help!",
    },
  });

  console.log("✅ Created test message");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
