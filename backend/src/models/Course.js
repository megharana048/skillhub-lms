import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    resourceUrl: { type: String, default: "" },
    duration: { type: Number, default: 0, min: 0 },
    order: { type: Number, required: true },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    shortDescription: { type: String, required: true, maxlength: 240 },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    language: { type: String, default: "English" },
    price: { type: Number, default: 0, min: 0 },
    thumbnail: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lessons: { type: [lessonSchema], default: [] },
    isPublished: { type: Boolean, default: false, index: true },
    enrollmentCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true },
);

schema.pre("save", function orderLessons() {
  this.lessons.forEach((lesson, index) => {
    lesson.order = index + 1;
  });
});

export default mongoose.model("Course", schema);
