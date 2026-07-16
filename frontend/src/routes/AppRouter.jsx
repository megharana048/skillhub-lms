import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import CourseDetailsPage from "../pages/CourseDetailsPage.jsx";
import CourseFormPage from "../pages/CourseFormPage.jsx";
import CoursesPage from "../pages/CoursesPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import InstructorPage from "../pages/InstructorPage.jsx";
import LearnPage from "../pages/LearnPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import MyLearningPage from "../pages/MyLearningPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import WishlistPage from "../pages/WishlistPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/courses"
            element={<CoursesPage />}
          />

          <Route
            path="/courses/:courseId"
            element={<CourseDetailsPage />}
          />

          <Route
            path="/wishlist"
            element={<WishlistPage />}
          />

          <Route
            element={
              <ProtectedRoute
                roles={[
                  "student",
                  "instructor",
                  "admin",
                ]}
              />
            }
          >
            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                roles={["student"]}
              />
            }
          >
            <Route
              path="/my-learning"
              element={<MyLearningPage />}
            />

            <Route
              path="/learn/:courseId"
              element={<LearnPage />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                roles={["instructor"]}
              />
            }
          >
            <Route
              path="/instructor"
              element={<InstructorPage />}
            />

            <Route
              path="/instructor/courses/new"
              element={<CourseFormPage />}
            />

            <Route
              path="/instructor/courses/:courseId/edit"
              element={<CourseFormPage />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                roles={["admin"]}
              />
            }
          >
            <Route
              path="/admin"
              element={<AdminPage />}
            />
          </Route>

          <Route
            path="/unauthorized"
            element={
              <NotFoundPage message="Access denied" />
            }
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>

        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;