import {
  BookOpen,
  Heart,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";

function CourseCard({ course }) {
  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

  const saved = isWishlisted(course._id);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 shadow-xl shadow-black/20 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-950/30">
      <button
        type="button"
        onClick={() => toggleWishlist(course)}
        className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border shadow-xl backdrop-blur transition hover:scale-110 ${
          saved
            ? "border-violet-400/40 bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
            : "border-slate-600 bg-slate-950/75 text-slate-300 hover:border-violet-400 hover:text-violet-300"
        }`}
        aria-label={
          saved
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        title={
          saved
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        <Heart
          size={20}
          fill={saved ? "currentColor" : "none"}
        />
      </button>

      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950">
        {course.thumbnail?.url ? (
          <>
            <img
              src={course.thumbnail.url}
              alt={course.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-xl shadow-indigo-950/30">
              <BookOpen size={30} />
            </span>

            <span className="text-lg font-black text-slate-100">
              {course.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
            {course.level}
          </span>

          <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-400">
            {course.category}
          </span>
        </div>

        <h2 className="mt-5 text-[1.35rem] font-black leading-7 text-white">
          {course.title}
        </h2>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
          {course.shortDescription}
        </p>

        <p className="mt-4 text-sm text-slate-500">
          By{" "}
          <span className="font-semibold text-slate-300">
            {course.instructor?.name ||
              "SkillHub Instructor"}
          </span>
        </p>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <Star
              size={16}
              fill="currentColor"
            />

            {Number(
              course.averageRating || 0,
            ).toFixed(1)}
          </span>

          <span className="flex items-center gap-1.5 text-slate-500">
            <Users size={16} />
            {course.enrollmentCount || 0}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-5">
          <span className="text-xl font-black text-white">
            {course.price > 0
              ? `₹${course.price}`
              : "Free"}
          </span>

          <span className="text-sm text-slate-500">
            {course.lessons?.length || 0} lessons
          </span>
        </div>

        <Link
          to={`/courses/${course._id}`}
          className="glow-button mt-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3.5 text-center font-bold text-white hover:-translate-y-0.5"
        >
          View Course
        </Link>
      </div>
    </article>
  );
}

export default CourseCard;