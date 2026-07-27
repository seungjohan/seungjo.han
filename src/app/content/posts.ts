/**
 * Blog posts, loaded from src/content/blog/<slug>/index.md.
 *
 * The directory name IS the slug. There is no registry to keep in sync and no
 * separate metadata file: a post is one folder containing one markdown file with
 * YAML frontmatter. Adding a post is `mkdir` + write. Nothing else.
 *
 * This replaced a scheme where each post needed four identifiers that did not
 * match each other (slug, a SOURCE_MARKDOWN key, the .md filename, and an import
 * variable), and where forgetting the registration step published a blank page
 * with no error.
 */

export interface Post {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  /** Markdown body, everything after the frontmatter block. */
  markdown: string;
}

/** Fields every post must declare. Missing one fails the build. */
const REQUIRED = ['title', 'subtitle', 'date', 'tags', 'excerpt'] as const;

/** Fields parsed as `[a, b, c]` lists rather than scalars. */
const LIST_FIELDS = new Set(['tags', 'secondaryKeywords']);

/**
 * Deliberately strict parser for a small, known frontmatter subset:
 * `key: value` and `key: [a, b, c]`. It throws on anything it does not
 * recognise rather than guessing, because a frontmatter parser that silently
 * mis-reads is how content vanishes without an error. This is not general YAML
 * and should not grow into it — if a post needs richer structure, that is a
 * signal to reconsider the shape, not to extend this.
 */
function parseFrontmatter(raw: string, where: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`[content] ${where}: missing frontmatter. The file must start with a --- delimited block.`);
  }

  const [, block, body] = match;
  const data: Record<string, unknown> = {};

  for (const line of block.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;

    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) {
      throw new Error(`[content] ${where}: cannot parse frontmatter line: ${line.trim()}`);
    }

    const [, key, rawValue] = kv;
    const value = rawValue.trim();

    if (LIST_FIELDS.has(key)) {
      const list = value.match(/^\[(.*)\]$/);
      if (!list) {
        throw new Error(`[content] ${where}: "${key}" must be a list like [One, Two]. Got: ${value}`);
      }
      data[key] = list[1]
        .split(',')
        .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      continue;
    }

    data[key] = value.replace(/^['"]|['"]$/g, '');
  }

  return { data, body: body.trim() };
}

function toPost(slug: string, raw: string, where: string): Post {
  const { data, body } = parseFrontmatter(raw, where);

  for (const field of REQUIRED) {
    const value = data[field];
    const empty = value === undefined || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && !value.length);
    if (empty) throw new Error(`[content] ${where}: required frontmatter field "${field}" is missing or empty.`);
  }
  if (!body) throw new Error(`[content] ${where}: the post has frontmatter but no body.`);

  return {
    slug,
    title: data.title as string,
    subtitle: data.subtitle as string,
    date: data.date as string,
    tags: data.tags as string[],
    excerpt: data.excerpt as string,
    coverImage: (data.coverImage as string) || undefined,
    focusKeyword: (data.focusKeyword as string) || undefined,
    secondaryKeywords: (data.secondaryKeywords as string[]) || undefined,
    markdown: body,
  };
}

// Eager so posts are inlined at build time — every route is prerendered, so there
// is no runtime fetch and no loading state to design for.
const FILES = import.meta.glob('../../content/blog/*/index.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const POSTS: Post[] = Object.entries(FILES)
  .map(([path, raw]) => {
    const slug = path.match(/\/blog\/([^/]+)\/index\.md$/)?.[1];
    if (!slug) throw new Error(`[content] unexpected post path: ${path}`);
    return toPost(slug, raw, `src/content/blog/${slug}/index.md`);
  })
  // Newest first. Posts with an unparseable date sort last rather than throwing,
  // since the date is already validated as present above.
  .sort((a, b) => {
    const at = new Date(a.date).getTime();
    const bt = new Date(b.date).getTime();
    if (isNaN(at) && isNaN(bt)) return 0;
    if (isNaN(at)) return 1;
    if (isNaN(bt)) return -1;
    return bt - at;
  });
