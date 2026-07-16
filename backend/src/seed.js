import "dotenv/config";
import mongoose from "mongoose";
import Course from "./models/Course.js";
import Enrollment from "./models/Enrollment.js";
import Progress from "./models/Progress.js";
import User from "./models/User.js";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Promise.all([
      User.deleteMany(),
      Course.deleteMany(),
      Enrollment.deleteMany(),
      Progress.deleteMany(),
    ]);

    const instructor = await User.create({
      name: "Demo Instructor",
      email: "instructor@skillhub.com",
      password: "meghainstructor@jsjnjvjk",
      role: "instructor",
      bio: "Full-stack instructor creating practical courses.",
    });

    await User.create({
      name: "Demo Student",
      email: "student@skillhub.com",
      password: "meghastudent@jsjnjvjk",
      role: "student",
    });

    await User.create({
      name: "SkillHub Admin",
      email: "admin@skillhub.com",
      password: "meghaadmin@jsjnjvjk",
      role: "admin",
    });

    await Course.create({
      title: "Complete MERN Stack Development",
      shortDescription:
        "Build production-style applications using MongoDB, Express, React and Node.",
      description:
        "Learn the full MERN flow from reusable frontend components to secure REST APIs and MongoDB schemas.",
      category: "Web Development",
      level: "Beginner",
      language: "English",
      price: 0,
      instructor: instructor._id,
      isPublished: true,
      lessons: [
        {
          title: "Understanding MERN architecture",
          content: "Learn how React, Express, Node and MongoDB communicate.",
          duration: 18,
          order: 1,
          isPreview: true,
        },
        {
          title: "Building the React frontend",
          content: "Create reusable components, pages and protected routes.",
          duration: 35,
          order: 2,
        },
        {
          title: "Creating secure Express APIs",
          content: "Use controllers, middleware, JWT and error handling.",
          duration: 42,
          order: 3,
        },
      ],
    });

    await Course.create({
      title: "JavaScript From Basics to Advanced",
      shortDescription:
        "Master modern JavaScript concepts used in frontend and backend development.",
      description:
        "Study functions, arrays, objects, asynchronous JavaScript, modules and practical problem solving.",
      category: "JavaScript",
      level: "Intermediate",
      language: "English",
      price: 499,
      instructor: instructor._id,
      isPublished: true,
      lessons: [
        {
          title: "Modern JavaScript foundations",
          content: "Review variables, functions, arrays and objects.",
          duration: 28,
          order: 1,
          isPreview: true,
        },
        {
          title: "Promises and async await",
          content: "Understand asynchronous execution and API calls.",
          duration: 32,
          order: 2,
        },
      ],
    });

    console.log("Seed completed.");
    console.log("Student: student@skillhub.com / Password123");
    console.log("Instructor: instructor@skillhub.com / Password123");
    console.log("Admin: admin@skillhub.com / Password123");
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
