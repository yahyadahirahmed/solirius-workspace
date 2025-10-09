import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const employees = [
  {
    name: "Benjamin Foster",
    currentRole: "Lead Software Architect",
    currentProject: "Enterprise Architecture Modernization",
    email: "benjamin.foster@solirius.com",
    password: "password123", // Simple password for demo
    location: "LONDON",
    about: "Software architect with 15+ years experience designing large-scale distributed systems. I'm passionate about clean code, system design patterns, and mentoring developers. Currently leading our microservices transformation initiative.",
    skillTags: ["System Design", "Microservices", "Java", "Spring Boot", "Kafka", "PostgreSQL", "Redis", "AWS"],
    previousExperiences: [
      {
        role: "Senior Software Engineer",
        project: "Payment Processing Platform",
        description: "Architected high-throughput payment processing system handling 10M+ transactions daily with 99.99% uptime.",
        startDate: new Date("2021-03-01"),
        endDate: new Date("2022-12-31")
      },
      {
        role: "Technical Lead",
        project: "API Gateway Implementation",
        description: "Designed and built enterprise API gateway serving 200+ microservices with advanced routing and security features.",
        startDate: new Date("2020-01-01"),
        endDate: new Date("2021-02-28")
      }
    ]
  },
  {
    name: "Olivia Martinez",
    currentRole: "Head of Product Strategy",
    currentProject: "AI-Powered Customer Insights",
    email: "olivia.martinez@solirius.com",
    password: "password123", // Simple password for demo
    location: "MANCHESTER",
    about: "Product strategist with deep expertise in fintech and AI. I help organizations build products that customers love while driving business growth. Former startup founder with successful exit experience.",
    skillTags: ["Product Strategy", "Market Research", "AI/ML Products", "Customer Analytics", "A/B Testing", "Growth Hacking", "Fintech"],
    previousExperiences: [
      {
        role: "Product Manager",
        project: "Mobile Banking App",
        description: "Led product development for award-winning mobile banking app, growing user base from 50K to 2M in 18 months.",
        startDate: new Date("2020-06-01"),
        endDate: new Date("2022-08-31")
      }
    ]
  },
  {
    name: "Thomas Wright",
    currentRole: "DevOps Platform Engineer",
    currentProject: "Kubernetes Infrastructure Migration",
    email: "thomas.wright@solirius.com",
    password: "password123", // Simple password for demo
    location: "LONDON",
    about: "Infrastructure engineer specializing in container orchestration and CI/CD automation. I believe in infrastructure as code and building self-healing systems. Certified Kubernetes administrator and AWS solutions architect.",
    skillTags: ["Kubernetes", "Docker", "Terraform", "GitOps", "Prometheus", "Grafana", "Jenkins", "AWS", "Linux"],
    previousExperiences: [
      {
        role: "Site Reliability Engineer",
        project: "Multi-Region Deployment",
        description: "Implemented disaster recovery solution across 3 AWS regions, reducing RTO from 4 hours to 15 minutes.",
        startDate: new Date("2021-09-01"),
        endDate: new Date("2023-03-31")
      },
      {
        role: "DevOps Engineer",
        project: "CI/CD Pipeline Overhaul",
        description: "Rebuilt deployment pipeline using GitOps principles, reducing deployment time by 80% and improving reliability.",
        startDate: new Date("2020-04-01"),
        endDate: new Date("2021-08-31")
      }
    ]
  },
  {
    name: "Sophia Patel",
    currentRole: "Senior Data Engineer",
    currentProject: "Real-time Analytics Platform",
    email: "sophia.patel@solirius.com",
    password: "password123", // Simple password for demo
    location: "MANCHESTER",
    about: "Data engineer passionate about building scalable data pipelines and real-time analytics systems. I specialize in big data technologies and love turning raw data into actionable insights. PhD in Computer Science from Oxford.",
    skillTags: ["Apache Spark", "Kafka", "Python", "Scala", "Databricks", "Delta Lake", "Apache Airflow", "Snowflake"],
    previousExperiences: [
      {
        role: "Data Engineer",
        project: "Customer 360 Platform",
        description: "Built real-time customer data platform processing 50TB+ daily, enabling personalized experiences for 5M+ customers.",
        startDate: new Date("2021-01-01"),
        endDate: new Date("2022-11-30")
      }
    ]
  }
];

async function main() {
  console.log('🌱 Starting database seed...');
  
  try {
    // Clear existing data first
    console.log('🧹 Clearing existing data...');
    await prisma.employee.deleteMany();

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
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });