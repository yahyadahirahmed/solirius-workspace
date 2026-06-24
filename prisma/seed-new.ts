import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('Seeding database...');

  await prisma.previousExperience.deleteMany();
  await prisma.employee.deleteMany();

  const hash = (pw: string) => bcrypt.hash(pw, 10);

  await prisma.employee.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah.chen@solirius.com',
      password: await hash('password123'),
      currentRole: 'Senior Software Engineer',
      currentProject: 'NHS Digital Transformation',
      location: 'LONDON',
      about: 'Full-stack engineer with a focus on cloud-native applications and microservices. Passionate about clean architecture and developer experience.',
      skillTags: ['TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL'],
      previousExperiences: {
        create: [
          {
            role: 'Software Engineer',
            project: 'HMRC Self Assessment Portal',
            startDate: new Date('2021-03-01'),
            endDate: new Date('2023-06-30'),
            description: 'Built and maintained the self assessment tax return portal serving 4 million users annually.',
          },
          {
            role: 'Junior Developer',
            project: 'DWP Universal Credit',
            startDate: new Date('2019-09-01'),
            endDate: new Date('2021-02-28'),
            description: 'Developed frontend components for the Universal Credit claimant journey.',
          },
        ],
      },
    },
  });

  await prisma.employee.create({
    data: {
      name: 'James Okafor',
      email: 'james.okafor@solirius.com',
      password: await hash('password123'),
      currentRole: 'Lead Business Analyst',
      currentProject: 'Ministry of Justice Case Management',
      location: 'LONDON',
      about: 'Experienced BA with a background in justice and policing. Skilled at bridging the gap between technical teams and senior stakeholders.',
      skillTags: ['Business Analysis', 'Agile', 'JIRA', 'Stakeholder Management', 'Process Mapping'],
      previousExperiences: {
        create: [
          {
            role: 'Business Analyst',
            project: 'Home Office Visa Processing',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2023-04-30'),
            description: 'Led requirements gathering and process redesign for the visa application system.',
          },
        ],
      },
    },
  });

  await prisma.employee.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@solirius.com',
      password: await hash('password123'),
      currentRole: 'DevOps Engineer',
      currentProject: 'DVLA Licensing Platform',
      location: 'MANCHESTER',
      about: 'DevOps specialist with deep expertise in CI/CD pipelines and infrastructure as code. Advocate for SRE practices and observability.',
      skillTags: ['Kubernetes', 'Terraform', 'Jenkins', 'Azure', 'Prometheus', 'Linux'],
      previousExperiences: {
        create: [
          {
            role: 'Infrastructure Engineer',
            project: 'DfT Transport Data Platform',
            startDate: new Date('2021-06-01'),
            endDate: new Date('2023-09-30'),
            description: 'Designed and maintained cloud infrastructure for national transport data pipelines.',
          },
        ],
      },
    },
  });

  await prisma.employee.create({
    data: {
      name: 'Tom Whitfield',
      email: 'tom.whitfield@solirius.com',
      password: await hash('password123'),
      currentRole: 'Delivery Manager',
      currentProject: 'Cabinet Office Digital Services',
      location: 'LONDON',
      about: 'Delivery manager with 8 years of experience leading agile teams across central government. Certified Scrum Master and SAFe practitioner.',
      skillTags: ['Agile', 'Scrum', 'Risk Management', 'Roadmapping', 'SAFe'],
      previousExperiences: {
        create: [
          {
            role: 'Scrum Master',
            project: 'GDS GOV.UK Notify',
            startDate: new Date('2019-04-01'),
            endDate: new Date('2022-12-31'),
            description: 'Facilitated agile ceremonies and removed blockers for the GOV.UK Notify engineering team.',
          },
        ],
      },
    },
  });

  await prisma.employee.create({
    data: {
      name: 'Aisha Malik',
      email: 'aisha.malik@solirius.com',
      password: await hash('password123'),
      currentRole: 'UX Designer',
      currentProject: 'HMRC Business Tax Account',
      location: 'MANCHESTER',
      about: 'User-centred designer with expertise in GDS design patterns and accessibility. Experienced in end-to-end service design for complex government services.',
      skillTags: ['Figma', 'User Research', 'Accessibility', 'Prototyping', 'GDS Design System'],
      previousExperiences: {
        create: [
          {
            role: 'Interaction Designer',
            project: 'DWP Find a Job Service',
            startDate: new Date('2020-07-01'),
            endDate: new Date('2023-03-31'),
            description: 'Designed and iterated on the job search and application journey used by 2 million job seekers.',
          },
        ],
      },
    },
  });

  console.log('Seeded 5 employees successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
