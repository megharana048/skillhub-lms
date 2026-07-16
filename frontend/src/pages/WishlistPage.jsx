import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Heart
              size={24}
              fill="currentColor"
            />
          </span>

          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-indigo-600">
              Saved for later
            </p>

            <h1 className="mt-1 text-4xl font-black text-slate-900">
              My Wishlist
            </h1>
          </div>
        </div>

        <p className="mt-5 text-slate-600">
          Save interesting courses and enroll when
          you are ready.
        </p>

        {wishlist.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Your wishlist is empty"
              description="Click the heart icon on a course card to save it."
              action={
                <Link
                  to="/courses"
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
                >
                  Explore Courses
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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