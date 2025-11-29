const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test complex (apartment building)
  const complex = await prisma.complex.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Sunset Apartments',
      address: '123 Main Street, Portland, OR 97201'
    }
  });
  console.log('✅ Created complex:', complex.name);

  // Create a test user (tenant)
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: 'test.user@example.com',
      password_hash: 'hashed_password_here', // In real app, this would be bcrypt hashed
      role: 'TENANT',
      first_name: 'John',
      last_name: 'Doe',
      phone: '555-0123',
      apartment_number: '4B',
      building_name: 'Sunset Apartments',
      address: '123 Main Street, Unit 4B',
      move_in_date: new Date('2024-01-15')
    }
  });
  console.log('✅ Created user:', user.email);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
