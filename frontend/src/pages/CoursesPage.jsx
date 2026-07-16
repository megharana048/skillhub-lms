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
              "Unable to load courses. Check that both servers are running.",
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
    <section className="min-h-screen bg-slate-950 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/80 px-8 py-12 text-white shadow-2xl shadow-black/30 sm:px-12">
          <div className="absolute right-[-100px] top-[-100px] h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

          <div className="absolute bottom-[-120px] left-[30%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative">
            <p className="font-bold uppercase tracking-[0.2em] text-indigo-400">
              Explore courses
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.03em] sm:text-5xl">
              Learn skills that help you grow
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Search by skill, category or difficulty
              and choose a course that matches your goals.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/75 p-6 shadow-xl shadow-black/15 backdrop-blur">
          <div className="mb-5 flex items-center gap-2 font-bold text-white">
            <SlidersHorizontal
              size={20}
              className="text-indigo-300"
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
              className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            <select
              name="category"
              value={filters.category}
              onChange={changeFilter}
              className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-white outline-none focus:border-indigo-500"
            >
              <option value="">
                All categories
              </option>

              <option>
                Web Development
              </option>

              <option>
                JavaScript
              </option>

              <option>
                UI/UX Design
              </option>

              <option>
                Data Science
              </option>

              <option>
                Business
              </option>
            </select>

            <select
              name="level"
              value={filters.level}
              onChange={changeFilter}
              className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3.5 text-white outline-none focus:border-indigo-500"
            >
              <option value="">
                All levels
              </option>

              <option>
                Beginner
              </option>

              <option>
                Intermediate
              </option>

              <option>
                Advanced
              </option>
            </select>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-500">
              {pagination.total || 0}{" "}
              courses found
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm font-bold text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300"
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
              description="Try another keyword or clear the selected filters."
              action={
                hasFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 font-bold text-white"
                  >
                    Clear Filters
                  </button>
                ) : null
              }
            />
          )}

        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(
            (course) => (
              <CourseCard
                key={course._id}
                course={course}
              />
            ),
          )}
        </div>

        {!status.loading &&
          courses.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      currentPage - 1,
                  )
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 font-bold text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300"
              >
                Previous
              </button>

              <span className="font-semibold text-slate-400">
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
                    (currentPage) =>
                      currentPage + 1,
                  )
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 font-bold text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300"
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