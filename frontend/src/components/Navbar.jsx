import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Heart,
  Menu,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const categories = [
  "Web Development",
  "JavaScript",
  "UI/UX Design",
  "Data Science",
  "Business",
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [
    categoryDropdownOpen,
    setCategoryDropdownOpen,
  ] = useState(false);

  const [
    profileDropdownOpen,
    setProfileDropdownOpen,
  ] = useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const categoryRef = useRef(null);
  const profileRef = useRef(null);

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const { wishlist } = useWishlist();

  const navigate = useNavigate();

  const dashboardLink =
    user?.role === "admin"
      ? {
          label: "Admin Dashboard",
          path: "/admin",
        }
      : user?.role === "instructor"
        ? {
            label: "Instructor",
            path: "/instructor",
          }
        : {
            label: "My Learning",
            path: "/my-learning",
          };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target)
      ) {
        setCategoryDropdownOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    const query = searchTerm.trim();

    navigate(
      query
        ? `/courses?search=${encodeURIComponent(query)}`
        : "/courses",
    );

    setMobileMenuOpen(false);
  }

  function handleCategory(category) {
    navigate(
      `/courses?category=${encodeURIComponent(category)}`,
    );

    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  }

  function handleLogout() {
    logout();

    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);

    navigate("/");
  }

  const navLinkClasses = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold ${
      isActive
        ? "bg-indigo-500/15 text-indigo-300"
        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 shadow-xl shadow-black/20 backdrop-blur-2xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[72px] items-center gap-4">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex shrink-0 items-center gap-3 text-xl font-black text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-950/50">
              <BookOpen
                size={21}
                strokeWidth={2.5}
              />
            </span>

            <span>
              Skill
              <span className="gradient-text">
                Hub
              </span>
            </span>
          </NavLink>

          <div
            ref={categoryRef}
            className="relative hidden lg:block"
          >
            <button
              type="button"
              onClick={() =>
                setCategoryDropdownOpen(
                  (currentValue) => !currentValue,
                )
              }
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Categories

              <ChevronDown
                size={16}
                className={
                  categoryDropdownOpen
                    ? "rotate-180"
                    : ""
                }
              />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute left-0 top-12 w-64 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                <p className="px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Browse categories
                </p>

                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      handleCategory(category)
                    }
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-300"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 flex-1 md:flex"
          >
            <div className="flex w-full items-center rounded-full border border-slate-700/80 bg-slate-900/80 px-4 shadow-inner shadow-black/20 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <Search
                size={18}
                className="shrink-0 text-slate-500"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search courses, skills or instructors"
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </form>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            <NavLink
              to="/courses"
              className={navLinkClasses}
            >
              Courses
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to={dashboardLink.path}
                className={navLinkClasses}
              >
                {dashboardLink.label}
              </NavLink>
            )}

            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `relative flex h-10 w-10 items-center justify-center rounded-full ${
                  isActive
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart size={20} />

              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-1 text-[11px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </NavLink>

            {isAuthenticated ? (
              <div
                ref={profileRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setProfileDropdownOpen(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                  className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm font-bold text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800"
                >
                  <UserCircle
                    size={20}
                    className="text-indigo-300"
                  />

                  <span className="hidden xl:inline">
                    {user?.name?.split(" ")[0]}
                  </span>

                  <ChevronDown
                    size={15}
                    className={
                      profileDropdownOpen
                        ? "rotate-180"
                        : ""
                    }
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-12 w-64 rounded-2xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                    <div className="border-b border-slate-800 px-4 py-3">
                      <p className="font-bold text-white">
                        {user?.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>

                    <NavLink
                      to="/profile"
                      onClick={() =>
                        setProfileDropdownOpen(false)
                      }
                      className="mt-2 block rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      My Profile
                    </NavLink>

                    <NavLink
                      to={dashboardLink.path}
                      onClick={() =>
                        setProfileDropdownOpen(false)
                      }
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      {dashboardLink.label}
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-400 hover:bg-rose-500/10"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={navLinkClasses}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="glow-button rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:-translate-y-0.5"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (currentValue) => !currentValue,
              )
            }
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-slate-800 py-4 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-900 px-3 focus-within:border-indigo-500">
                <Search
                  size={18}
                  className="text-slate-500"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search courses"
                  className="w-full bg-transparent px-3 py-3 text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </form>

            <p className="px-3 pt-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Categories
            </p>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    handleCategory(category)
                  }
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-left text-sm font-semibold text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300"
                >
                  {category}
                </button>
              ))}
            </div>

            <NavLink
              to="/courses"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className={navLinkClasses}
            >
              Courses
            </NavLink>

            <NavLink
              to="/wishlist"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className={navLinkClasses}
            >
              Wishlist ({wishlist.length})
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to={dashboardLink.path}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={navLinkClasses}
                >
                  {dashboardLink.label}
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={navLinkClasses}
                >
                  Profile
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-rose-500/30 px-4 py-3 text-left font-bold text-rose-400 hover:bg-rose-500/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={navLinkClasses}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="block rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 text-center font-bold text-white"
                >
                  Create Account
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;