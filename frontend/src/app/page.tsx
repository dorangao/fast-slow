'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'auto' | 'fast' | 'slow'>('auto');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/think', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || '');
    } catch {
      setAnswer('Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h1>Ask the AI</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question..."
          rows={4}
          style={{ padding: '0.5rem' }}
        />
        <select value={mode} onChange={(e) => setMode(e.target.value as 'auto' | 'fast' | 'slow')}>
          <option value="auto">Auto</option>
          <option value="fast">Fast</option>
          <option value="slow">Slow</option>
        </select>
        <button type="submit" disabled={loading} style={{ padding: '0.5rem' }}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
      {answer && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <h2>Response:</h2>
          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}
