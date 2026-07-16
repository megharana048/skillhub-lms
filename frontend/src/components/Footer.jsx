import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-black text-white"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-lg shadow-indigo-950/50">
              S
            </span>

            <span>
              Skill
              <span className="gradient-text">
                Hub
              </span>
            </span>
          </Link>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-500">
            Learn practical coding, design and
            professional skills through focused
            courses and structured lessons.
          </p>

          <div className="mt-7 flex gap-3">
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-sm font-black text-slate-400 hover:-translate-y-1 hover:border-indigo-500/50 hover:text-indigo-300"
            >
              in
            </a>

            <a
              href="mailto:hello@skillhub.com"
              aria-label="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-sm font-black text-slate-400 hover:-translate-y-1 hover:border-violet-500/50 hover:text-violet-300"
            >
              @
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
            Explore
          </h3>

          <div className="mt-6 space-y-3 text-sm">
            <Link
              className="block hover:translate-x-1 hover:text-indigo-300"
              to="/courses"
            >
              Browse Courses
            </Link>

            <Link
              className="block hover:translate-x-1 hover:text-indigo-300"
              to="/wishlist"
            >
              Wishlist
            </Link>

            <Link
              className="block hover:translate-x-1 hover:text-indigo-300"
              to="/register"
            >
              Become an Instructor
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
            Account
          </h3>

          <div className="mt-6 space-y-3 text-sm">
            <Link
              className="block hover:translate-x-1 hover:text-violet-300"
              to="/login"
            >
              Login
            </Link>

            <Link
              className="block hover:translate-x-1 hover:text-violet-300"
              to="/register"
            >
              Register
            </Link>

            <Link
              className="block hover:translate-x-1 hover:text-violet-300"
              to="/profile"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} SkillHub.
        Built for focused learning.
      </div>
    </footer>
  );
}

export default Footer;