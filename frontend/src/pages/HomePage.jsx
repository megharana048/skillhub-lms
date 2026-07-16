import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Code2,
  Palette,
  PlayCircle,
  Search,
  Sparkles,
  Terminal,
  Users,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const categories = [
  {
    title: "Web Development",
    description:
      "Frontend, backend and full-stack development",
    icon: Code2,
  },
  {
    title: "JavaScript",
    description:
      "Modern JavaScript and problem solving",
    icon: Terminal,
  },
  {
    title: "UI/UX Design",
    description:
      "Design systems and product design",
    icon: Palette,
  },
  {
    title: "Data Science",
    description:
      "Analytics, Python and machine learning",
    icon: BarChart3,
  },
  {
    title: "Business",
    description:
      "Marketing and entrepreneurship",
    icon: BriefcaseBusiness,
  },
];

function HomePage() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const query = searchTerm.trim();

    navigate(
      query
        ? `/courses?search=${encodeURIComponent(query)}`
        : "/courses",
    );
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 px-6 py-24 text-white">
        <div className="absolute left-[-100px] top-[-120px] h-[430px] w-[430px] rounded-full bg-indigo-600/15 blur-3xl" />

        <div className="absolute right-[-100px] top-[20px] h-[390px] w-[390px] rounded-full bg-violet-600/15 blur-3xl" />

        <div className="absolute bottom-[-220px] left-[35%] h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-bold text-indigo-300 shadow-lg shadow-indigo-950/20">
              <Sparkles size={16} />

              Learn smarter. Build faster.
            </p>

            <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Learn the skills that{" "}
              <span className="gradient-text">
                shape your future.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Learn coding, design and professional
              skills through structured courses,
              practical lessons and focused projects.
            </p>

            <form
              onSubmit={handleSearch}
              className="glass-panel mt-9 flex max-w-2xl overflow-hidden rounded-2xl p-2 focus-within:border-indigo-500"
            >
              <div className="flex flex-1 items-center px-3">
                <Search
                  size={21}
                  className="text-slate-500"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="What do you want to learn?"
                  className="w-full bg-transparent px-3 py-3.5 text-white outline-none placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                className="glow-button rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 font-bold text-white hover:-translate-y-0.5"
              >
                Search
              </button>
            </form>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/courses"
                className="glow-button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 font-bold text-white hover:-translate-y-0.5"
              >
                Explore Courses
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-7 py-3.5 font-bold text-slate-200 hover:border-violet-400/50 hover:bg-slate-800 hover:text-white"
              >
                Become an Instructor
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-slate-800 pt-8">
              <div>
                <p className="text-3xl font-black text-white">
                  10K+
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Learners
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-white">
                  50+
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Courses
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-white">
                  4.8
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Average rating
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rotate-3 rounded-[36px] bg-gradient-to-br from-indigo-600/20 to-violet-600/20 blur-xl" />

            <div className="glass-panel relative rounded-[32px] p-5">
              <div className="rounded-[26px] border border-slate-800 bg-slate-950/80 p-7 shadow-2xl shadow-black/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-indigo-300">
                      Continue learning
                    </p>

                    <h2 className="mt-3 text-3xl font-black leading-tight text-white">
                      MERN Stack Development
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Build production-ready full-stack
                      applications.
                    </p>
                  </div>

                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-950/50">
                    <PlayCircle size={29} />
                  </span>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <div className="flex justify-between text-sm font-semibold text-slate-300">
                    <span>Course progress</span>

                    <span className="text-indigo-300">
                      72%
                    </span>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/courses")
                    }
                    className="mt-6 w-full rounded-2xl bg-white px-4 py-3.5 font-bold text-slate-950 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-600 hover:text-white"
                  >
                    Continue Learning
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <Users
                      className="text-indigo-300"
                      size={24}
                    />

                    <p className="mt-4 text-2xl font-black text-white">
                      1,250
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Active learners
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <BookOpenCheck
                      className="text-violet-300"
                      size={24}
                    />

                    <p className="mt-4 text-2xl font-black text-white">
                      24
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Lessons included
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800/80 bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-bold uppercase tracking-[0.2em] text-indigo-400">
                Explore skills
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl">
                Choose your learning path
              </h2>

              <p className="mt-5 max-w-2xl text-lg text-slate-400">
                Start with the skill that matches your
                current goals.
              </p>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 font-bold text-indigo-300 hover:text-violet-300"
            >
              View all courses
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map(
              ({
                title,
                description,
                icon: Icon,
              }) => (
                <button
                  key={title}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/courses?category=${encodeURIComponent(
                        title,
                      )}`,
                    )
                  }
                  className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-left shadow-xl shadow-black/15 hover:-translate-y-2 hover:border-indigo-500/40 hover:bg-slate-900 hover:shadow-indigo-950/30"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white">
                    <Icon size={26} />
                  </span>

                  <h3 className="mt-6 text-lg font-black text-white">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-900/60 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-violet-400">
              <Sparkles size={17} />
              Why SkillHub
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl">
              Designed for focused learning
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Everything you need to build consistent
              learning habits and practical skills.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Structured courses",
                description:
                  "Follow organized lessons instead of random disconnected tutorials.",
                icon: BookOpenCheck,
              },
              {
                title: "Track your progress",
                description:
                  "Continue from where you stopped and build a consistent learning habit.",
                icon: BarChart3,
              },
              {
                title: "Practical learning",
                description:
                  "Build useful skills through focused lessons and real projects.",
                icon: Code2,
              },
            ].map(
              ({
                title,
                description,
                icon: Icon,
              }) => (
                <article
                  key={title}
                  className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-xl shadow-black/20 hover:-translate-y-1 hover:border-violet-500/30"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-300">
                    <Icon size={27} />
                  </span>

                  <h3 className="mt-6 text-2xl font-black text-white">
                    {title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    {description}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;