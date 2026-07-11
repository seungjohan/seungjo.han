import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Eye, Pencil, Trash2, ExternalLink, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { PROJECTS, type Project } from '../../data/projects';
import { PROJECT_ANALYTICS } from '../../data/analytics';
import { getDraftProjects, saveDraftProject, deleteDraftProject, slugify } from '../../utils/draftStore';
import { getViews } from '../../utils/viewTracker';

type SortKey = 'title' | 'year' | 'views' | 'modified';
type SortDir = 'asc' | 'desc';

const EMPTY_FORM = {
  title: '', client: '', year: '', description: '', tags: '',
  coverImage: '', role: '', team: '', duration: '', techStack: '',
  impact: '', whatIDid: '', outcome: '',
};

export default function AdminProjects() {
  const [sort, setSort]             = useState<SortKey>('views');
  const [dir, setDir]               = useState<SortDir>('desc');
  const [editSlug, setEditSlug]     = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const reload = () => {
    const drafts = getDraftProjects();
    const draftSlugs = new Set(drafts.map(d => d.slug));
    setAllProjects([...PROJECTS.filter(p => !draftSlugs.has(p.slug)), ...drafts]);
  };

  useEffect(() => { reload(); }, []);

  const rows = [...allProjects]
    .map(p => ({
      ...p,
      analytics: PROJECT_ANALYTICS[p.slug],
      liveViews: getViews(p.slug),
      isDraft: !PROJECTS.find(sp => sp.slug === p.slug),
    }))
    .sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      if (sort === 'title')    { av = a.title;                         bv = b.title; }
      if (sort === 'year')     { av = a.year;                          bv = b.year; }
      if (sort === 'views')    { av = a.liveViews;                     bv = b.liveViews; }
      if (sort === 'modified') { av = a.analytics?.modifiedAt ?? '';   bv = b.analytics?.modifiedAt ?? ''; }
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
    const project: Project = {
      slug,
      title: form.title.trim(),
      client: form.client.trim() || 'Personal',
      year: form.year.trim() || String(new Date().getFullYear()),
      description: form.description.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      coverImage: form.coverImage.trim() || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
      images: form.coverImage.trim() ? [form.coverImage.trim()] : [],
      color: '#f4f4f5',
      role: form.role.trim() || 'Product Manager',
      team: form.team.trim() || '—',
      timeline: form.year.trim() || '—',
      duration: form.duration.trim() || '—',
      platform: '—',
      techStack: form.techStack.trim() || '—',
      impact: form.impact.trim(),
      whatIDid: form.whatIDid.trim(),
      whatIDidBullets: [],
      outcome: form.outcome.trim(),
    };
    saveDraftProject(project);
    setForm(EMPTY_FORM);
    setShowCreate(false);
    reload();
  };

  const handleDelete = (slug: string, isDraft: boolean) => {
    if (!isDraft) { alert('Static projects can only be removed by editing the source file.'); return; }
    if (!confirm('Delete this project?')) return;
    deleteDraftProject(slug);
    reload();
  };

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-0.02em' }}>
            Projects
          </h1>
          <p className="text-gray-400" style={{ fontSize: '0.85rem' }}>
            {allProjects.length} projects · {totalViews.toLocaleString()} total views
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 text-sm bg-gray-950 text-white rounded-lg px-3 py-1.5 hover:bg-gray-800 transition-colors"
          >
            <Plus size={13} /> New Project
          </button>
          <Link
            to="/projects"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
          >
            View projects <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {rows.map(p => (
          <div key={p.slug} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <img src={p.coverImage} alt={p.title} className="w-full aspect-[16/9] object-cover" />
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-sm text-gray-900 leading-snug">{p.title}</p>
                {p.isDraft && (
                  <span className="text-xs text-amber-600 border border-amber-100 bg-amber-50 rounded px-1 py-0.5 flex-shrink-0">
                    draft
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{p.client} · {p.year}</p>
              <div className="flex items-center gap-1 mt-2">
                <Eye size={11} className="text-gray-300" />
                <span className="text-xs text-gray-600">{p.liveViews.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_120px_90px_130px_80px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
          {[
            { key: 'title' as SortKey,    label: 'Project' },
            { key: 'year' as SortKey,     label: 'Year' },
            { key: 'modified' as SortKey, label: 'Modified' },
            { key: 'views' as SortKey,    label: 'Views' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className="flex items-center gap-1 text-left text-xs text-gray-400 uppercase tracking-wider hover:text-gray-700 transition-colors"
            >
              {label} <SortIcon k={key} />
            </button>
          ))}
          <span className="text-xs text-gray-400 uppercase tracking-wider">Tags</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">Actions</span>
        </div>

        <div className="divide-y divide-gray-50">
          {rows.map(project => (
            <div
              key={project.slug}
              className="grid grid-cols-[1fr_100px_120px_90px_130px_80px] gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
            >
              {/* Title */}
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm text-gray-900">{project.title}</p>
                  <p className="text-xs text-gray-400">{project.client}</p>
                </div>
                {project.isDraft && (
                  <span className="text-xs text-amber-600 border border-amber-100 bg-amber-50 rounded px-1.5 py-0.5 flex-shrink-0">
                    draft
                  </span>
                )}
              </div>

              {/* Year */}
              <p className="text-xs text-gray-500">{project.year}</p>

              {/* Modified */}
              <p className="text-xs text-gray-500">{project.analytics?.modifiedAt ?? '—'}</p>

              {/* Views */}
              <div className="flex items-center gap-1.5">
                <Eye size={12} className="text-gray-300" />
                <span className="text-sm text-gray-700">{project.liveViews.toLocaleString()}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 2).map(t => (
                  <span key={t} className="text-xs text-gray-400 border border-gray-100 rounded px-1.5 py-0.5">
                    {t}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditSlug(project.slug)}
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="Edit"
                >
                  <Pencil size={13} />
                </button>
                <Link
                  to={`/projects/${project.slug}`}
                  target="_blank"
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="View project"
                >
                  <ExternalLink size={13} />
                </Link>
                <button
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                  onClick={() => handleDelete(project.slug, project.isDraft)}
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
              <h2 className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 400 }}>New Project</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Project name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Client / Company</label>
                  <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                    placeholder="Company name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Year</label>
                  <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                    placeholder="2026"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief project description"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="Product Management, Mobile, Payments"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                <input value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Your Role</label>
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="Product Manager"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Duration</label>
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="6 months"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Impact</label>
                <textarea value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))}
                  placeholder="What was the measurable impact?"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">What I Did</label>
                <textarea value={form.whatIDid} onChange={e => setForm(f => ({ ...f, whatIDid: e.target.value }))}
                  placeholder="Describe your work and contributions"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Outcome</label>
                <textarea value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}
                  placeholder="Key result or takeaway"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreate}
                  disabled={!form.title.trim()}
                  className="flex-1 bg-gray-950 text-white rounded-xl py-2.5 text-sm hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add Project
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
            <h2 className="text-gray-900 mb-1" style={{ fontSize: '1.1rem', fontWeight: 400 }}>Edit Project</h2>
            <p className="text-gray-400 mb-6" style={{ fontSize: '0.8rem' }}>
              {PROJECTS.find(p => p.slug === editSlug)
                ? 'Static projects are edited in the source file (src/app/data/projects.ts).'
                : 'Editing localStorage draft.'}
            </p>
            {(() => {
              const isDraft = !PROJECTS.find(p => p.slug === editSlug);
              const proj = allProjects.find(p => p.slug === editSlug)!;
              if (!isDraft) {
                return (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      This is a static project. Edit <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">src/app/data/projects.ts</code> to modify it.
                    </p>
                    <button onClick={() => setEditSlug(null)}
                      className="w-full border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors">
                      Close
                    </button>
                  </div>
                );
              }
              return (
                <EditDraftProject
                  project={proj}
                  onSave={updated => { saveDraftProject(updated); setEditSlug(null); reload(); }}
                  onCancel={() => setEditSlug(null)}
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function EditDraftProject({ project, onSave, onCancel }: {
  project: Project; onSave: (p: Project) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: project.title,
    client: project.client,
    description: project.description,
    tags: project.tags.join(', '),
    impact: project.impact,
    whatIDid: project.whatIDid,
    outcome: project.outcome,
  });
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Title</label>
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Client</label>
        <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors resize-none" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
        <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors" />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave({ ...project, ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })}
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
