import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const employees = [
  {
    name: "Benjamin Foster",
    currentRole: "Lead Software Architect",
    currentProject: "Enterprise Architecture Modernization",
    email: "benjamin.foster@solirius.com",
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
  },
  {
    name: "Noah Campbell",
    currentRole: "Frontend Engineering Lead",
    currentProject: "Design System Implementation",
    email: "noah.campbell@solirius.com",
    location: "LONDON",
    about: "Frontend engineer with expertise in modern JavaScript frameworks and design systems. I'm passionate about creating accessible, performant user interfaces and fostering great developer experiences.",
    skillTags: ["React", "TypeScript", "Next.js", "GraphQL", "Design Systems", "Web Performance", "Accessibility", "Storybook"],
    previousExperiences: [
      {
        role: "Senior Frontend Engineer",
        project: "E-commerce Platform Rebuild",
        description: "Led frontend team rebuilding legacy e-commerce platform, improving Core Web Vitals by 60% and conversion by 25%.",
        startDate: new Date("2020-10-01"),
        endDate: new Date("2022-06-30")
      }
    ]
  },
  {
    name: "Isabella Chen",
    currentRole: "Machine Learning Engineer",
    currentProject: "Fraud Detection System",
    email: "isabella.chen@solirius.com",
    location: "LONDON",
    about: "ML engineer focused on building production-ready machine learning systems. I specialize in computer vision and NLP applications. Always excited to explore cutting-edge AI research and apply it to real-world problems.",
    skillTags: ["Machine Learning", "Python", "TensorFlow", "PyTorch", "Computer Vision", "NLP", "MLOps", "Kubernetes"],
    previousExperiences: [
      {
        role: "AI Research Engineer",
        project: "Document Processing AI",
        description: "Developed computer vision system for automated document processing, reducing manual work by 90% and improving accuracy to 99.2%.",
        startDate: new Date("2021-05-01"),
        endDate: new Date("2023-01-31")
      }
    ]
  },
  {
    name: "Lucas Anderson",
    currentRole: "Mobile Development Lead",
    currentProject: "Cross-Platform Mobile App",
    email: "lucas.anderson@solirius.com",
    location: "MANCHESTER",
    about: "Mobile developer with expertise in both native and cross-platform development. I'm passionate about creating smooth, intuitive mobile experiences and optimizing app performance. Active contributor to open source projects.",
    skillTags: ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin", "Firebase", "Mobile CI/CD"],
    previousExperiences: [
      {
        role: "Senior Mobile Developer",
        project: "Healthcare Mobile App",
        description: "Built HIPAA-compliant mobile app for healthcare providers, supporting offline sync and serving 100K+ medical professionals.",
        startDate: new Date("2020-08-01"),
        endDate: new Date("2022-10-31")
      }
    ]
  },
  {
    name: "Grace Kim",
    currentRole: "Senior Business Consultant",
    currentProject: "Digital Transformation Strategy",
    email: "grace.kim@solirius.com",
    location: "LONDON",
    about: "Strategic consultant helping enterprises navigate digital transformation. I specialize in change management, process optimization, and technology adoption. Former McKinsey consultant with deep expertise in financial services.",
    skillTags: ["Digital Strategy", "Change Management", "Process Improvement", "Stakeholder Engagement", "Financial Modeling", "Workshop Facilitation"],
    previousExperiences: [
      {
        role: "Management Consultant",
        project: "Bank Digital Strategy",
        description: "Led digital transformation strategy for major European bank, identifying £50M+ in cost savings and revenue opportunities.",
        startDate: new Date("2019-01-01"),
        endDate: new Date("2021-12-31")
      }
    ]
  },
  {
    name: "Ethan Brooks",
    currentRole: "Cloud Security Architect",
    currentProject: "Zero Trust Security Implementation",
    email: "ethan.brooks@solirius.com",
    location: "MANCHESTER",
    about: "Cloud security specialist with expertise in zero trust architecture and compliance frameworks. I help organizations secure their cloud infrastructure while maintaining agility. CISSP and AWS Security certified.",
    skillTags: ["Cloud Security", "Zero Trust", "Identity Management", "Compliance", "Threat Modeling", "Security Automation", "SIEM"],
    previousExperiences: [
      {
        role: "Security Engineer",
        project: "Multi-Cloud Security Framework",
        description: "Designed security framework for multi-cloud environment, achieving SOC2 Type II and ISO27001 compliance.",
        startDate: new Date("2020-02-01"),
        endDate: new Date("2022-04-30")
      }
    ]
  },
  {
    name: "Amelia Taylor",
    currentRole: "Senior UX Researcher",
    currentProject: "User Experience Optimization",
    email: "amelia.taylor@solirius.com",
    location: "LONDON",
    about: "UX researcher passionate about understanding user behavior and designing evidence-based experiences. I specialize in mixed-methods research and have led user research for products serving millions of users.",
    skillTags: ["User Research", "Usability Testing", "Design Thinking", "Data Analysis", "Survey Design", "Interview Techniques", "Prototyping"],
    previousExperiences: [
      {
        role: "UX Researcher",
        project: "Mobile App User Journey",
        description: "Conducted comprehensive user research for fintech app redesign, improving user satisfaction scores by 40% and reducing drop-off rates by 35%.",
        startDate: new Date("2021-02-01"),
        endDate: new Date("2022-09-30")
      }
    ]
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.previousExperience.deleteMany();
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
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });