import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Clock3,
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

  const lessonCount =
    course.lessons?.length || 0;

  const totalDuration =
    course.lessons?.reduce(
      (total, lesson) =>
        total + Number(lesson.duration || 0),
      0,
    ) || 0;

  return (
    <article className="group relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-[#243047] bg-[#111827] shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-[#6366F1]/60 hover:bg-[#172033] hover:shadow-2xl hover:shadow-indigo-950/30">
      <button
        type="button"
        onClick={() => toggleWishlist(course)}
        className={`absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-xl border shadow-lg backdrop-blur transition hover:scale-105 ${
          saved
            ? "border-[#6366F1] bg-[#6366F1] text-white"
            : "border-[#243047] bg-[#070A16]/90 text-[#94A3B8] hover:border-[#6366F1] hover:text-[#A78BFA]"
        }`}
        aria-label={
          saved
            ? "Remove saved course"
            : "Save course"
        }
        title={
          saved
            ? "Remove saved course"
            : "Save course"
        }
      >
        <Bookmark
          size={20}
          fill={saved ? "currentColor" : "none"}
        />
      </button>

      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#172033]">
        {course.thumbnail?.url ? (
          <>
            <img
              src={course.thumbnail.url}
              alt={course.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#070A16]/90 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#6366F1]/25 bg-[#6366F1]/10 text-[#A78BFA]">
              <BookOpen size={30} />
            </span>

            <span className="text-lg font-black text-[#F8FAFC]">
              {course.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#6366F1]/25 bg-[#6366F1]/10 px-3 py-1 text-xs font-bold text-[#A78BFA]">
            {course.level}
          </span>

          <span className="rounded-full border border-[#243047] bg-[#0B1120] px-3 py-1 text-xs font-semibold text-[#94A3B8]">
            {course.category}
          </span>
        </div>

        <h2 className="mt-5 text-[1.35rem] font-black leading-7 text-[#F8FAFC]">
          {course.title}
        </h2>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#94A3B8]">
          {course.shortDescription}
        </p>

        <p className="mt-4 text-sm text-[#64748B]">
          Instructor:{" "}
          <span className="font-semibold text-[#F8FAFC]">
            {course.instructor?.name ||
              "SkillHub Instructor"}
          </span>
        </p>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-bold text-[#FBBF24]">
            <Star
              size={16}
              fill="currentColor"
            />

            {Number(
              course.averageRating || 0,
            ).toFixed(1)}
          </span>

          <span className="flex items-center gap-1.5 text-[#64748B]">
            <Users size={16} />

            {course.enrollmentCount || 0}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#243047] pt-5">
          <span className="text-xl font-black text-[#F8FAFC]">
            {course.price > 0
              ? `₹${course.price}`
              : "Free"}
          </span>

          <span className="text-sm text-[#64748B]">
            {lessonCount} lessons
          </span>
        </div>

        <Link
          to={`/courses/${course._id}`}
          className="primary-button mt-6 rounded-2xl px-4 py-3.5 text-center font-bold"
        >
          View Course
        </Link>
      </div>

      {/* Desktop hover preview */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden translate-y-5 flex-col justify-end bg-gradient-to-t from-[#070A16] via-[#070A16]/98 to-[#070A16]/70 p-6 opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:flex">
        <div className="translate-y-4 transition duration-300 group-hover:translate-y-0">
          <span className="inline-flex rounded-full border border-[#6366F1]/30 bg-[#6366F1]/15 px-3 py-1 text-xs font-bold text-[#A78BFA]">
            {course.level} course
          </span>

          <h3 className="mt-4 text-2xl font-black leading-8 text-[#F8FAFC]">
            {course.title}
          </h3>

          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#94A3B8]">
            {course.description ||
              course.shortDescription ||
              "Develop practical skills with structured lessons and guided learning."}
          </p>

          <div className="mt-5 rounded-2xl border border-[#243047] bg-[#0B1120]/90 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Instructor
            </p>

            <p className="mt-1 font-bold text-[#F8FAFC]">
              {course.instructor?.name ||
                "SkillHub Instructor"}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#243047] bg-[#111827] p-3">
              <div className="flex items-center gap-2 text-[#A78BFA]">
                <BookOpen size={17} />

                <span className="text-xs font-bold">
                  Lessons
                </span>
              </div>

              <p className="mt-2 text-lg font-black text-[#F8FAFC]">
                {lessonCount}
              </p>
            </div>

            <div className="rounded-xl border border-[#243047] bg-[#111827] p-3">
              <div className="flex items-center gap-2 text-[#A78BFA]">
                <Clock3 size={17} />

                <span className="text-xs font-bold">
                  Duration
                </span>
              </div>

              <p className="mt-2 text-lg font-black text-[#F8FAFC]">
                {totalDuration || 0} min
              </p>
            </div>
          </div>

          <Link
            to={`/courses/${course._id}`}
            className="primary-button mt-5 flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-bold"
          >
            Start Course
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;