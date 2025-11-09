// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create a test recruiter user
  const recruiter = await prisma.user.create({
    data: {
      name: "John Recruiter",
      email: "recruiter@example.com",
      password: "$2b$12$LQv3c1yqBWVHxkd5g5f6Oe6d7LcuhTf7Yc5t5WcRZc5c5c5c5c5c5c", // hashed "123456"
      role: "RECRUITER",
      phone: "+1234567890",
      bio: "Tech recruiter at Awesome Company",
      skills: ["Recruitment", "HR", "Tech"],
      location: "New York, NY",
    },
  });

  // Create a test candidate user
  const candidate = await prisma.user.create({
    data: {
      name: "Alice Candidate",
      email: "candidate@example.com",
      password: "$2b$12$LQv3c1yqBWVHxkd5g5f6Oe6d7LcuhTf7Yc5t5WcRZc5c5c5c5c5c5c", // hashed "123456"
      role: "APPLIER",
      phone: "+0987654321",
      bio: "Full-stack developer looking for new opportunities",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      location: "San Francisco, CA",
      resume: "https://example.com/resume.pdf",
    },
  });

  // Create test jobs
  const job1 = await prisma.job.create({
    data: {
      title: "Senior React Developer",
      description:
        "We are looking for an experienced React developer to join our frontend team. You will be working on building responsive web applications.",
      requirements:
        "5+ years of React experience, TypeScript, Redux, Node.js, REST APIs",
      salary: "$80,000 - $120,000",
      location: "New York, NY",
      jobType: "FULL_TIME",
      experienceLevel: "SENIOR",
      category: "Engineering",
      tags: ["React", "TypeScript", "Node.js", "Frontend"],
      isRemote: true,
      recruiterId: recruiter.id,
      expiresAt: new Date("2024-12-31"),
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "Junior Frontend Developer",
      description:
        "Great opportunity for a junior developer to learn and grow with our team. Mentorship provided.",
      requirements:
        "1+ years of JavaScript, React basics, HTML/CSS, willingness to learn",
      salary: "$50,000 - $70,000",
      location: "Remote",
      jobType: "FULL_TIME",
      experienceLevel: "ENTRY",
      category: "Engineering",
      tags: ["JavaScript", "React", "CSS", "Junior"],
      isRemote: true,
      recruiterId: recruiter.id,
      expiresAt: new Date("2024-11-30"),
    },
  });

  // Create a test application
  const application = await prisma.application.create({
    data: {
      coverLetter:
        "I'm very interested in this position and believe my skills align perfectly with your requirements.",
      resume: "https://example.com/alice-resume.pdf",
      applierId: candidate.id,
      jobId: job1.id,
      status: "PENDING",
    },
  });

  console.log("✅ Seed completed!");
  console.log(`📊 Created:`);
  console.log(`   - ${recruiter.name} (Recruiter)`);
  console.log(`   - ${candidate.name} (Candidate)`);
  console.log(`   - ${job1.title} (Job)`);
  console.log(`   - ${job2.title} (Job)`);
  console.log(`   - 1 Application`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
