import bcrypt from "bcrypt";
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 300 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

schema.pre("save", async function hashPassword() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

schema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", schema);
