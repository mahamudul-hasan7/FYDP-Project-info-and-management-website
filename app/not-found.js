import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="app-shell" style={{ display: 'grid', placeItems: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div className="content-card" style={{ maxWidth: 480, padding: 36 }}>
        <h1 style={{ fontSize: 64, margin: '0 0 12px 0', color: 'var(--accent)' }}>404</h1>
        <h2>Page Not Found</h2>
        <p style={{ color: 'var(--muted)', margin: '12px 0 24px 0' }}>
          The page or member profile you are looking for does not exist or may have been moved.
        </p>
        <Link href="/" className="primary-action" style={{ display: 'inline-flex', justifyContent: 'center' }}>
          <ArrowLeft size={16} />
          <span>Back to Team Random</span>
        </Link>
      </div>
    </main>
  );
}
