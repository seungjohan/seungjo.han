import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Projects from "./pages/Projects";
import ProjectCase from "./pages/ProjectCase";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

export const router = createBrowserRouter([
  // ── Public site ──────────────────────────────────────────────────────────────
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,              Component: Home },
      { path: "about",            Component: About },
      { path: "blog",             Component: Blog },
      { path: "blog/:slug",       Component: BlogPost },
      { path: "projects",         Component: Projects },
      { path: "projects/:slug",   Component: ProjectCase },
      { path: "*",                Component: NotFound },
    ],
  },
  // ── Admin ─────────────────────────────────────────────────────────────────────
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true,           Component: AdminLogin },
      { path: "dashboard",     Component: AdminDashboard },
      { path: "posts",         Component: AdminPosts },
      { path: "projects",      Component: AdminProjects },
      { path: "analytics",     Component: AdminAnalytics },
    ],
  },
]);
