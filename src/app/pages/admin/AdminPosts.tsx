import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye, Pencil, Trash2, ExternalLink, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { POSTS, type Post } from '../../data/posts';
import { POST_ANALYTICS } from '../../data/analytics';
import { getDraftPosts, saveDraftPost, deleteDraftPost, slugify } from '../../utils/draftStore';
import { getViews } from '../../utils/viewTracker';

type SortKey = 'title' | 'date' | 'views' | 'modified';
type SortDir = 'asc' | 'desc';

const EMPTY_FORM = {
  title: '', subtitle: '', excerpt: '', date: '',
  tags: '', coverImage: '', body: '',
};

export default function AdminPosts() {
  const [sort, setSort]           = useState<SortKey>('views');
  const [dir, setDir]             = useState<SortDir>('desc');
  const [editSlug, setEditSlug]   = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [allPosts, setAllPosts]   = useState<Post[]>([]);

  const reload = () => {
    const drafts = getDraftPosts();
    const draftSlugs = new Set(drafts.map(d => d.slug));
    setAllPosts([...POSTS.filter(p => !draftSlugs.has(p.slug)), ...drafts]);
  };

  useEffect(() => { reload(); }, []);

  const rows = [...allPosts]
    .map(p => ({
      ...p,
      analytics: POST_ANALYTICS[p.slug],
      liveViews: getViews(p.slug),
      isDraft: !POSTS.find(sp => sp.slug === p.slug),
    }))
    .sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      if (sort === 'title')    { av = a.title;                       bv = b.title; }
      if (sort === 'date')     { av = a.date;                        bv = b.date; }
      if (sort === 'views')    { av = a.liveViews;                   bv = b.liveViews; }
      if (sort === 'modified') { av = a.analytics?.modifiedAt ?? ''; bv = b.analytics?.modifiedAt ?? ''; }
      return dir === 'asc'
        ? (av < bv ? -1 : av > bv ? 1 : 0)
        : (av > bv ? -1 : av < bv ? 1 : 0);
    });

  const toggleSort = (key: SortKey) => {
    if (sort === key) setDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSort(key); setDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sort === k
      ? (dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
      : <ChevronDown size={12} className="text-gray-300" />;

  const totalViews = rows.reduce((s, r) => s + r.liveViews, 0);

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const slug = slugify(form.title);
    const post: Post = {
      slug,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      excerpt: form.excerpt.trim(),
      date: form.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      coverImage: form.coverImage.trim() || undefined,
      body: form.body.trim() || undefined,
    };
    saveDraftPost(post);
    setForm(EMPTY_FORM);
    setShowCreate(false);
    reload();
  };

  const handleDelete = (slug: string, isDraft: boolean) => {
    if (!isDraft) { alert('Static posts can only be removed by editing the source file.'); return; }
    if (!confirm('Delete this post?')) return;
    deleteDraftPost(slug);
    reload();
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-0.02em' }}>
            Posts
          </h1>
          <p className="text-gray-400" style={{ fontSize: '0.85rem' }}>
            {allPosts.length} posts · {totalViews.toLocaleString()} total views
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 text-sm bg-gray-950 text-white rounded-lg px-3 py-1.5 hover:bg-gray-800 transition-colors"
          >
            <Plus size={13} /> New Post
          </button>
          <Link
            to="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
          >
            View blog <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_140px_90px_120px_80px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
          {[
            { key: 'title' as SortKey,    label: 'Title' },
            { key: 'date' as SortKey,     label: 'Written' },
            { key: 'views' as SortKey,    label: 'Views' },
            { key: 'modified' as SortKey, label: 'Modified' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className="flex items-center gap-1 text-left text-xs text-gray-400 uppercase tracking-wider hover:text-gray-700 transition-colors"
            >
              {label} <SortIcon k={key} />
            </button>
          ))}
          <span className="text-xs text-gray-400 uppercase tracking-wider">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {rows.map(post => (
            <div
              key={post.slug}
              className="grid grid-cols-[1fr_140px_90px_120px_80px] gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
            >
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm text-gray-900">{post.title}</p>
                  {post.isDraft && (
                    <span className="text-xs text-amber-600 border border-amber-100 bg-amber-50 rounded px-1.5 py-0.5">
                      draft
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.slice(0, 2).map(t => (
                    <span key={t} className="text-xs text-gray-400 border border-gray-100 rounded px-1.5 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Written */}
              <p className="text-xs text-gray-500">{post.analytics?.createdAt ?? post.date}</p>

              {/* Views */}
              <div className="flex items-center gap-1.5">
                <Eye size={12} className="text-gray-300" />
                <span className="text-sm text-gray-700">{post.liveViews.toLocaleString()}</span>
              </div>

              {/* Modified */}
              <p className="text-xs text-gray-500">{post.analytics?.modifiedAt ?? '—'}</p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditSlug(post.slug)}
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="Edit"
                >
                  <Pencil size={13} />
                </button>
                <Link
                  to={`/blog/${post.slug}`}
                  target="_blank"
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="View post"
                >
                  <ExternalLink size={13} />
                </Link>
                <button
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                  onClick={() => handleDelete(post.slug, post.isDraft)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 400 }}>New Post</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Enter post title"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Subtitle</label>
                <input
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Short subtitle"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Brief description shown on the blog list"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Date</label>
                <input
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  placeholder="May 28, 2026"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
                <input
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="Startup, Technology, Product"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                <input
                  value={form.coverImage}
                  onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Body</label>
                <textarea
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Write your post content here. Separate paragraphs with a blank line."
                  rows={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none font-mono"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreate}
                  disabled={!form.title.trim()}
                  className="flex-1 bg-gray-950 text-white rounded-xl py-2.5 text-sm hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Publish Post
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-5 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editSlug && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={() => setEditSlug(null)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 w-full max-w-lg p-8"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-gray-900 mb-1" style={{ fontSize: '1.1rem', fontWeight: 400 }}>Edit Post</h2>
            <p className="text-gray-400 mb-6" style={{ fontSize: '0.8rem' }}>
              {POSTS.find(p => p.slug === editSlug)
                ? 'Static posts are edited in the source file (src/app/data/posts.ts).'
                : 'Editing localStorage draft.'}
            </p>
            {(() => {
              const post = allPosts.find(p => p.slug === editSlug)!;
              const isDraft = !POSTS.find(p => p.slug === editSlug);
              if (!isDraft) {
                return (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      This is a static post. Edit <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">src/app/data/posts.ts</code> to modify it.
                    </p>
                    <button
                      onClick={() => setEditSlug(null)}
                      className="w-full border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                );
              }
              return (
                <EditDraftPost post={post} onSave={(updated) => { saveDraftPost(updated); setEditSlug(null); reload(); }} onCancel={() => setEditSlug(null)} />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function EditDraftPost({ post, onSave, onCancel }: { post: Post; onSave: (p: Post) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: post.title,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    tags: post.tags.join(', '),
    body: post.body ?? '',
  });
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Excerpt</label>
        <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
        <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Body</label>
        <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none font-mono" />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave({ ...post, ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })}
          className="flex-1 bg-gray-950 text-white rounded-xl py-2.5 text-sm hover:bg-gray-800 transition-colors"
        >
          Save changes
        </button>
        <button onClick={onCancel} className="px-5 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
