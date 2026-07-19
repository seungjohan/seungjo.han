import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('components/Layout.tsx', [
    index('pages/Home.tsx'),
    route('about', 'pages/About.tsx'),
    route('blog', 'pages/Blog.tsx'),
    route('blog/:slug', 'pages/BlogPost.tsx'),
    route('projects', 'pages/Projects.tsx'),
    route('projects/:slug', 'pages/ProjectCase.tsx'),
    route('*', 'pages/NotFound.tsx'),
  ]),
] satisfies RouteConfig;
