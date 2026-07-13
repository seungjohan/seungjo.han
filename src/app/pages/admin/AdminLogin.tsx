import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect
  useEffect(() => {
    fetch('/api/admin-check')
      .then(res => res.json())
      .then(data => {
        if (data.authorized) navigate('/nahojgnues/dashboard');
      })
      .catch(() => {});
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        navigate('/nahojgnues/dashboard');
      } else if (res.status === 401) {
        setError('Incorrect password.');
      } else {
        setError('Server error. Please try again later.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Admin</p>
          <h1
            className="text-gray-900"
            style={{ fontSize: '1.6rem', fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            Seungjo Han
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-gray-500 mb-6" style={{ fontSize: '0.9rem' }}>
            Enter your admin password to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                autoFocus
                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none
                            transition-colors placeholder:text-gray-300 pr-10
                            ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-gray-400'}`}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500" style={{ fontSize: '0.8rem' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gray-950 text-white rounded-xl py-3 text-sm
                         hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-xs text-gray-400 hover:text-black transition-colors underline underline-offset-4">
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
