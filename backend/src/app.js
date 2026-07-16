import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import Course from "./models/Course.js";
import Enrollment from "./models/Enrollment.js";
import Progress from "./models/Progress.js";
import User from "./models/User.js";
import { authorize, errorHandler, notFound, protect } from "./middleware.js";
import { ApiError, asyncHandler, tokenFor } from "./utils.js";

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(morgan("dev"));

const publicUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
  isActive: user.isActive,
});

app.get("/api/health", (_request, response) => {
  response.json({ success: true, message: "SkillHub API is running." });
});

/* AUTH */
app.post(
  "/api/auth/register",
  asyncHandler(async (request, response) => {
    const { name, email, password, role = "student" } = request.body;

    if (!name?.trim() || !email?.trim() || !password) {
      throw new ApiError(422, "Name, email and password are required.");
    }

    if (password.length < 6) {
      throw new ApiError(422, "Password must contain at least 6 characters.");
    }

    if (!["student", "instructor"].includes(role)) {
      throw new ApiError(403, "Invalid public registration role.");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const user = await User.create({ name, email, password, role });

    response.status(201).json({
      success: true,
      token: tokenFor(user._id),
      user: publicUser(user),
    });
  }),
);

app.post(
  "/api/auth/login",
  asyncHandler(async (request, response) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");

    if (!user || !(await user.comparePassword(password || ""))) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (!user.isActive) throw new ApiError(403, "This account is blocked.");

    response.json({
      success: true,
      token: tokenFor(user._id),
      user: publicUser(user),
    });
  }),
);

app.get("/api/auth/me", protect, (request, response) => {
  response.json({ success: true, user: publicUser(request.user) });
});

app.put(
  "/api/auth/profile",
  protect,
  asyncHandler(async (request, response) => {
    const updates = {};
    ["name", "bio", "avatar"].forEach((field) => {
      if (request.body[field] !== undefined) updates[field] = request.body[field];
    });

    const user = await User.findByIdAndUpdate(request.user._id, updates, {
      new: true,
      runValidators: true,
    });

    response.json({ success: true, user: publicUser(user) });
  }),
);

/* COURSES */
app.get(
  "/api/courses",
  asyncHandler(async (request, response) => {
    const {
      search = "",
      category = "",
      level = "",
      page = 1,
      limit = 9,
    } = request.query;

    const query = { isPublished: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { shortDescription: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("instructor", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      Course.countDocuments(query),
    ]);

    response.json({
      success: true,
      courses,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.max(Math.ceil(total / limitNumber), 1),
      },
    });
  }),
);

app.get(
  "/api/courses/instructor/mine",
  protect,
  authorize("instructor"),
  asyncHandler(async (request, response) => {
    const courses = await Course.find({ instructor: request.user._id })
      .populate("instructor", "name avatar")
      .sort({ createdAt: -1 });

    response.json({ success: true, courses });
  }),
);

app.get(
  "/api/courses/:id",
  asyncHandler(async (request, response) => {
    const course = await Course.findById(request.params.id).populate(
      "instructor",
      "name avatar bio",
    );

    if (!course) throw new ApiError(404, "Course not found.");

    response.json({ success: true, course });
  }),
);

app.post(
  "/api/courses",
  protect,
  authorize("instructor"),
  asyncHandler(async (request, response) => {
    const { title, shortDescription, description, category, lessons = [] } =
      request.body;

    if (!title || !shortDescription || !description || !category) {
      throw new ApiError(422, "Complete all required course fields.");
    }

    const course = await Course.create({
      ...request.body,
      lessons: lessons.map((lesson, index) => ({ ...lesson, order: index + 1 })),
      instructor: request.user._id,
      isPublished: false,
    });

    response.status(201).json({ success: true, course });
  }),
);

async function ownedCourse(id, user) {
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, "Course not found.");

  if (
    user.role !== "admin" &&
    course.instructor.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, "You cannot modify this course.");
  }

  return course;
}

app.put(
  "/api/courses/:id",
  protect,
  authorize("instructor", "admin"),
  asyncHandler(async (request, response) => {
    const course = await ownedCourse(request.params.id, request.user);

    [
      "title",
      "shortDescription",
      "description",
      "category",
      "level",
      "language",
      "price",
      "thumbnail",
    ].forEach((field) => {
      if (request.body[field] !== undefined) course[field] = request.body[field];
    });

    if (request.body.lessons) {
      course.lessons = request.body.lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));
    }

    await course.save();
    response.json({ success: true, course });
  }),
);

app.patch(
  "/api/courses/:id/publish",
  protect,
  authorize("instructor", "admin"),
  asyncHandler(async (request, response) => {
    const course = await ownedCourse(request.params.id, request.user);

    if (!course.isPublished && course.lessons.length === 0) {
      throw new ApiError(400, "Add at least one lesson before publishing.");
    }

    course.isPublished = !course.isPublished;
    await course.save();

    response.json({ success: true, course });
  }),
);

app.delete(
  "/api/courses/:id",
  protect,
  authorize("instructor", "admin"),
  asyncHandler(async (request, response) => {
    const course = await ownedCourse(request.params.id, request.user);

    await Promise.all([
      Enrollment.deleteMany({ course: course._id }),
      Progress.deleteMany({ course: course._id }),
      course.deleteOne(),
    ]);

    response.json({ success: true, message: "Course deleted." });
  }),
);

/* ENROLLMENTS AND PROGRESS */
app.post(
  "/api/enrollments/:courseId",
  protect,
  authorize("student"),
  asyncHandler(async (request, response) => {
    const course = await Course.findById(request.params.courseId);

    if (!course || !course.isPublished) {
      throw new ApiError(404, "Published course not found.");
    }

    let enrollment = await Enrollment.findOne({
      student: request.user._id,
      course: course._id,
    });

    if (!enrollment) {
      enrollment = await Enrollment.create({
        student: request.user._id,
        course: course._id,
      });

      await Progress.create({
        student: request.user._id,
        course: course._id,
      });

      course.enrollmentCount += 1;
      await course.save();
    }

    response.status(201).json({ success: true, enrollment });
  }),
);

app.get(
  "/api/enrollments/my",
  protect,
  authorize("student"),
  asyncHandler(async (request, response) => {
    const enrollments = await Enrollment.find({ student: request.user._id })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name avatar" },
      })
      .sort({ createdAt: -1 });

    const progress = await Progress.find({
      student: request.user._id,
      course: { $in: enrollments.map((item) => item.course._id) },
    });

    const progressMap = new Map(
      progress.map((item) => [item.course.toString(), item.progressPercent]),
    );

    response.json({
      success: true,
      enrollments: enrollments.map((item) => ({
        ...item.toObject(),
        progressPercent: progressMap.get(item.course._id.toString()) || 0,
      })),
    });
  }),
);

async function requireEnrollment(student, course) {
  const enrollment = await Enrollment.findOne({ student, course });
  if (!enrollment) throw new ApiError(403, "Enroll before accessing lessons.");
  return enrollment;
}

app.get(
  "/api/progress/:courseId",
  protect,
  authorize("student"),
  asyncHandler(async (request, response) => {
    await requireEnrollment(request.user._id, request.params.courseId);

    const progress = await Progress.findOne({
      student: request.user._id,
      course: request.params.courseId,
    });

    response.json({ success: true, progress });
  }),
);

app.put(
  "/api/progress/:courseId/lessons/:lessonId",
  protect,
  authorize("student"),
  asyncHandler(async (request, response) => {
    const { courseId, lessonId } = request.params;
    const enrollment = await requireEnrollment(request.user._id, courseId);
    const course = await Course.findById(courseId);
    const progress = await Progress.findOne({
      student: request.user._id,
      course: courseId,
    });

    if (!course.lessons.some((lesson) => lesson._id.toString() === lessonId)) {
      throw new ApiError(404, "Lesson not found.");
    }

    const index = progress.completedLessons.findIndex(
      (item) => item.lesson.toString() === lessonId,
    );

    if (index >= 0) progress.completedLessons.splice(index, 1);
    else progress.completedLessons.push({ lesson: lessonId });

    progress.progressPercent =
      course.lessons.length === 0
        ? 0
        : Math.round(
            (progress.completedLessons.length / course.lessons.length) * 100,
          );

    await progress.save();

    enrollment.status = progress.progressPercent === 100 ? "completed" : "active";
    enrollment.completedAt =
      progress.progressPercent === 100 ? new Date() : null;
    await enrollment.save();

    response.json({ success: true, progress });
  }),
);

/* ADMIN */
app.get(
  "/api/admin/stats",
  protect,
  authorize("admin"),
  asyncHandler(async (_request, response) => {
    const [users, courses, enrollments, publishedCourses] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Course.countDocuments({ isPublished: true }),
    ]);

    response.json({
      success: true,
      stats: { users, courses, enrollments, publishedCourses },
    });
  }),
);

app.get(
  "/api/admin/users",
  protect,
  authorize("admin"),
  asyncHandler(async (_request, response) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    response.json({ success: true, users });
  }),
);

app.patch(
  "/api/admin/users/:id/status",
  protect,
  authorize("admin"),
  asyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id);
    if (!user) throw new ApiError(404, "User not found.");
    if (user._id.toString() === request.user._id.toString()) {
      throw new ApiError(400, "You cannot block your own account.");
    }
    user.isActive = !user.isActive;
    await user.save();
    response.json({ success: true, user });
  }),
);

app.get(
  "/api/admin/courses",
  protect,
  authorize("admin"),
  asyncHandler(async (_request, response) => {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    response.json({ success: true, courses });
  }),
);

app.delete(
  "/api/admin/courses/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (request, response) => {
    const course = await Course.findById(request.params.id);
    if (!course) throw new ApiError(404, "Course not found.");

    await Promise.all([
      Enrollment.deleteMany({ course: course._id }),
      Progress.deleteMany({ course: course._id }),
      course.deleteOne(),
    ]);

    response.json({ success: true, message: "Course deleted." });
  }),
);

/* CLOUDINARY UPLOAD */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video/")
      ? "video"
      : file.mimetype === "application/pdf"
        ? "raw"
        : "image";

    const stream = cloudinary.uploader.upload_stream(
      { folder: "skillhub", resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result)),
    );

    Readable.from(file.buffer).pipe(stream);
  });
}

app.post(
  "/api/uploads",
  protect,
  authorize("instructor", "admin"),
  upload.single("file"),
  asyncHandler(async (request, response) => {
    if (!request.file) throw new ApiError(400, "Choose a file to upload.");

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new ApiError(503, "Cloudinary environment variables are missing.");
    }

    const result = await uploadBuffer(request.file);

    response.status(201).json({
      success: true,
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
      },
    });
  }),
);

app.use(notFound);
app.use(errorHandler);

export default app;
