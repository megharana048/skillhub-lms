import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  BookOpen,
  ChevronDown,
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
    function closeDropdowns(event) {
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
      closeDropdowns,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeDropdowns,
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

  function openCategory(category) {
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
        ? "bg-[#6366F1]/15 text-[#A78BFA]"
        : "text-[#94A3B8] hover:bg-[#172033] hover:text-[#F8FAFC]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#243047] bg-[#070A16]/95 shadow-xl shadow-black/20 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[72px] items-center gap-4">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex shrink-0 items-center gap-3 text-xl font-black text-[#F8FAFC]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6366F1] shadow-lg shadow-indigo-950/40">
              <BookOpen
                size={21}
                strokeWidth={2.5}
              />
            </span>

            <span>
              Skill
              <span className="text-[#A78BFA]">
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
                  (current) => !current,
                )
              }
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#94A3B8] hover:bg-[#172033] hover:text-[#F8FAFC]"
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
              <div className="absolute left-0 top-12 w-64 rounded-2xl border border-[#243047] bg-[#111827] p-2 shadow-2xl shadow-black/60">
                <p className="px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#64748B]">
                  Browse categories
                </p>

                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      openCategory(category)
                    }
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#94A3B8] hover:bg-[#6366F1]/10 hover:text-[#A78BFA]"
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
            <div className="flex w-full items-center rounded-full border border-[#243047] bg-[#0B1120] px-4 focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20">
              <Search
                size={18}
                className="shrink-0 text-[#64748B]"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search courses, skills or instructors"
                className="w-full bg-transparent px-3 py-3 text-sm text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
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
                `relative flex h-10 w-10 items-center justify-center rounded-xl ${
                  isActive
                    ? "bg-[#6366F1]/15 text-[#A78BFA]"
                    : "text-[#94A3B8] hover:bg-[#172033] hover:text-[#F8FAFC]"
                }`
              }
              aria-label="Saved courses"
              title="Saved courses"
            >
              <Bookmark size={20} />

              {wishlist.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6366F1] px-1 text-[11px] font-bold text-white">
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
                      (current) => !current,
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-[#243047] bg-[#111827] px-3 py-2 text-sm font-bold text-[#F8FAFC] hover:bg-[#172033]"
                >
                  <UserCircle
                    size={20}
                    className="text-[#A78BFA]"
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
                  <div className="absolute right-0 top-12 w-64 rounded-2xl border border-[#243047] bg-[#111827] p-2 shadow-2xl shadow-black/60">
                    <div className="border-b border-[#243047] px-4 py-3">
                      <p className="font-bold text-[#F8FAFC]">
                        {user?.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#64748B]">
                        {user?.email}
                      </p>
                    </div>

                    <NavLink
                      to="/profile"
                      onClick={() =>
                        setProfileDropdownOpen(false)
                      }
                      className="mt-2 block rounded-xl px-4 py-3 text-sm font-semibold text-[#94A3B8] hover:bg-[#172033] hover:text-[#F8FAFC]"
                    >
                      My Profile
                    </NavLink>

                    <NavLink
                      to={dashboardLink.path}
                      onClick={() =>
                        setProfileDropdownOpen(false)
                      }
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#94A3B8] hover:bg-[#172033] hover:text-[#F8FAFC]"
                    >
                      {dashboardLink.label}
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#F43F5E] hover:bg-[#F43F5E]/10"
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
                  className="primary-button rounded-xl px-5 py-2.5 text-sm font-bold"
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
                (current) => !current,
              )
            }
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#243047] text-[#94A3B8] hover:border-[#6366F1] hover:text-[#A78BFA] md:hidden"
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
          <div className="space-y-3 border-t border-[#243047] py-4 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="flex items-center rounded-xl border border-[#243047] bg-[#0B1120] px-3">
                <Search
                  size={18}
                  className="text-[#64748B]"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search courses"
                  className="w-full bg-transparent px-3 py-3 text-[#F8FAFC] outline-none"
                />
              </div>
            </form>

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
              Saved Courses ({wishlist.length})
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
                  className="w-full rounded-xl border border-[#F43F5E]/30 px-4 py-3 text-left font-bold text-[#F43F5E]"
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
                  className="primary-button block rounded-xl px-4 py-3 text-center font-bold"
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