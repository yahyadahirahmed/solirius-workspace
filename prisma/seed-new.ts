import { PrismaClient } from '@prisma/client';

// Create a fresh Prisma client for seeding
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const employees = [
  {
    name: "Yahya Ahmed",
    currentRole: "Graduate Technical Consultant",
    currentProject: "HMCTS",
    email: "yahya.ahmed@solirius.com",
    password: "password123",
    location: "LONDON",
    about: "Graduate Technical Consultant with a passion for technology and a desire to learn. I enjoy working on innovative projects and collaborating with talented teams.",
    skillTags: ["TypeScript", "React", "Node.js", "CSS", "HTML"],
    previousExperiences: [
      {
        role: "Software Engineer",
        project: "Employee Data Automisation",
        description: "Automated data processing by reading and analyzing CSV files, improving reporting accuracy and reducing manual effort.",
        startDate: new Date("2023-06-01"),
        endDate: new Date("2023-08-31")
      }
    ]
  }
];

async function main() {
  console.log('🌱 Starting database seed...');
  
  try {
   

    console.log('👥 Creating employees...');
    
    for (const employeeData of employees) {
      const { previousExperiences, ...employeeInfo } = employeeData;
      
      const employee = await prisma.employee.create({
        data: {
          ...employeeInfo,
          previousExperiences: {
            create: previousExperiences
          }
        }
      });
      
      console.log(`✅ Created employee: ${employee.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${employees.length} employees with their experience data`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Final error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });