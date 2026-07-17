import {
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../components/CourseCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";

const initialFilters = {
  search: "",
  category: "",
  level: "",
};

function CoursesPage() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [courses, setCourses] =
    useState([]);

  const [filters, setFilters] =
    useState({
      search:
        searchParams.get("search") || "",
      category:
        searchParams.get("category") || "",
      level:
        searchParams.get("level") || "",
    });

  const [page, setPage] =
    useState(1);

  const [
    pagination,
    setPagination,
  ] = useState({
    pages: 1,
    total: 0,
  });

  const [status, setStatus] =
    useState({
      loading: true,
      error: "",
    });

  useEffect(() => {
    setFilters({
      search:
        searchParams.get("search") || "",
      category:
        searchParams.get("category") || "",
      level:
        searchParams.get("level") || "",
    });

    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(
      async () => {
        try {
          setStatus({
            loading: true,
            error: "",
          });

          const { data } =
            await api.get(
              "/courses",
              {
                params: {
                  ...filters,
                  page,
                  limit: 9,
                },
              },
            );

          setCourses(data.courses);

          setPagination(
            data.pagination,
          );

          setStatus({
            loading: false,
            error: "",
          });
        } catch (error) {
          setStatus({
            loading: false,
            error:
              error.response?.data
                ?.message ||
              "Unable to load courses.",
          });
        }
      },
      250,
    );

    return () =>
      clearTimeout(timer);
  }, [filters, page]);

  function updateUrl(nextFilters) {
    const params = {};

    Object.entries(
      nextFilters,
    ).forEach(
      ([key, value]) => {
        if (value) {
          params[key] = value;
        }
      },
    );

    setSearchParams(params);
  }

  function changeFilter(event) {
    const nextFilters = {
      ...filters,
      [event.target.name]:
        event.target.value,
    };

    setFilters(nextFilters);
    setPage(1);
    updateUrl(nextFilters);
  }

  function clearFilters() {
    setFilters(initialFilters);
    setPage(1);
    setSearchParams({});
  }

  const hasFilters =
    Object.values(filters).some(Boolean);

  return (
    <section className="min-h-screen bg-[#070A16] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#243047] bg-[#0B1120] px-8 py-12">
          <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-[#6366F1]/10 blur-3xl" />

          <div className="relative">
            <p className="font-bold uppercase tracking-[0.2em] text-[#6366F1]">
              Course library
            </p>

            <h1 className="mt-4 text-4xl font-black text-[#F8FAFC] sm:text-5xl">
              Find your next skill
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#94A3B8]">
              Explore structured courses created for
              practical and career-focused learning.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#243047] bg-[#111827] p-6">
          <div className="mb-5 flex items-center gap-2 font-bold text-[#F8FAFC]">
            <SlidersHorizontal
              size={20}
              className="text-[#A78BFA]"
            />

            Filter courses
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              name="search"
              type="search"
              value={filters.search}
              onChange={changeFilter}
              placeholder="Search courses or instructors"
              className="rounded-2xl border border-[#243047] bg-[#0B1120] px-4 py-3.5 text-[#F8FAFC] outline-none placeholder:text-[#64748B] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
            />

            <select
              name="category"
              value={filters.category}
              onChange={changeFilter}
              className="rounded-2xl border border-[#243047] bg-[#0B1120] px-4 py-3.5 text-[#F8FAFC] outline-none focus:border-[#6366F1]"
            >
              <option value="">
                All categories
              </option>
              <option>
                Web Development
              </option>
              <option>JavaScript</option>
              <option>UI/UX Design</option>
              <option>Data Science</option>
              <option>Business</option>
            </select>

            <select
              name="level"
              value={filters.level}
              onChange={changeFilter}
              className="rounded-2xl border border-[#243047] bg-[#0B1120] px-4 py-3.5 text-[#F8FAFC] outline-none focus:border-[#6366F1]"
            >
              <option value="">
                All levels
              </option>
              <option>Beginner</option>
              <option>
                Intermediate
              </option>
              <option>Advanced</option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-[#64748B]">
              {pagination.total || 0}{" "}
              courses found
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-[#243047] bg-[#0B1120] px-4 py-2.5 text-sm font-bold text-[#94A3B8] hover:border-[#6366F1] hover:text-[#A78BFA]"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {status.loading && (
          <Loader label="Loading courses..." />
        )}

        {status.error && (
          <EmptyState
            title="Could not load courses"
            description={status.error}
          />
        )}

        {!status.loading &&
          !status.error &&
          courses.length === 0 && (
            <EmptyState
              title="No courses found"
              description="Try a different keyword or clear the selected filters."
            />
          )}

        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
            />
          ))}
        </div>

        {!status.loading &&
          courses.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      current - 1,
                  )
                }
                className="rounded-xl border border-[#243047] bg-[#111827] px-5 py-2.5 font-bold text-[#94A3B8] hover:border-[#6366F1] hover:text-[#A78BFA]"
              >
                Previous
              </button>

              <span className="font-semibold text-[#94A3B8]">
                Page {page} of{" "}
                {pagination.pages}
              </span>

              <button
                type="button"
                disabled={
                  page >= pagination.pages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      current + 1,
                  )
                }
                className="rounded-xl border border-[#243047] bg-[#111827] px-5 py-2.5 font-bold text-[#94A3B8] hover:border-[#6366F1] hover:text-[#A78BFA]"
              >
                Next
              </button>
            </div>
          )}
      </div>
    </section>
  );
}

export default CoursesPage;