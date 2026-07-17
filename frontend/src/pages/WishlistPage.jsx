import {
  Bookmark,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <section className="min-h-screen bg-[#070A16] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#A78BFA]">
            <Bookmark
              size={26}
              fill="currentColor"
            />
          </span>

          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-[#6366F1]">
              Your learning list
            </p>

            <h1 className="mt-1 text-4xl font-black text-[#F8FAFC]">
              Saved Courses
            </h1>
          </div>
        </div>

        <p className="mt-5 max-w-2xl leading-7 text-[#94A3B8]">
          Save useful courses here so you can return
          to them and start learning later.
        </p>

        {wishlist.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-[#243047] bg-[#111827] px-6 py-20 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0B1120] text-[#A78BFA]">
              <BookOpen size={30} />
            </span>

            <h2 className="mt-6 text-2xl font-black text-[#F8FAFC]">
              No saved courses yet
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-[#94A3B8]">
              Use the bookmark button on a course card
              to save courses that interest you.
            </p>

            <Link
              to="/courses"
              className="primary-button mt-7 inline-block rounded-2xl px-6 py-3.5 font-bold"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WishlistPage;