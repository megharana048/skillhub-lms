import {
  BookOpen,
  Code2,
  Sparkles,
} from "lucide-react";
import {
  Link,
  Outlet,
} from "react-router-dom";

function AuthLayout() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/50">
        <section className="relative hidden w-1/2 overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute left-[-100px] top-[-100px] h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

          <div className="absolute bottom-[-100px] right-[-100px] h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

          <Link
            to="/"
            className="relative flex items-center gap-3 text-2xl font-black"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-950/50">
              <BookOpen size={23} />
            </span>

            Skill
            <span className="gradient-text">
              Hub
            </span>
          </Link>

          <div className="relative">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">
              <Sparkles size={17} />

              Learn. Build. Grow.
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-[-0.04em]">
              Build skills that move your{" "}
              <span className="gradient-text">
                career forward.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              Join structured courses, practical
              lessons and a focused learning
              experience.
            </p>

            <div className="mt-9 flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                <Code2 size={23} />
              </span>

              <div>
                <p className="font-bold">
                  Practical learning
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Learn by building real projects
                </p>
              </div>
            </div>
          </div>

          <p className="relative text-sm text-slate-600">
            © {new Date().getFullYear()} SkillHub
          </p>
        </section>

        <section className="flex w-full items-center justify-center bg-slate-900/80 p-6 sm:p-10 lg:w-1/2">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-8 flex items-center gap-2 text-2xl font-black text-white lg:hidden"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600">
                <BookOpen size={20} />
              </span>

              Skill
              <span className="gradient-text">
                Hub
              </span>
            </Link>

            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;