import type { Post } from '../data/posts';
import type { Project } from '../data/projects';

const POSTS_KEY    = 'sj_draft_posts';
const PROJECTS_KEY = 'sj_draft_projects';

function readPosts(): Post[] {
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]'); } catch { return []; }
}
function readProjects(): Project[] {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]'); } catch { return []; }
}

export function getDraftPosts(): Post[] { return readPosts(); }

export function saveDraftPost(post: Post) {
  const existing = readPosts().filter(p => p.slug !== post.slug);
  localStorage.setItem(POSTS_KEY, JSON.stringify([post, ...existing]));
}

export function deleteDraftPost(slug: string) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(readPosts().filter(p => p.slug !== slug)));
}

export function getDraftProjects(): Project[] { return readProjects(); }

export function saveDraftProject(project: Project) {
  const existing = readProjects().filter(p => p.slug !== project.slug);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify([project, ...existing]));
}

export function deleteDraftProject(slug: string) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(readProjects().filter(p => p.slug !== slug)));
}

export function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
