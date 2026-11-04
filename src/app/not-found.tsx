import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="section page-intro">
      <p className="eyebrow">404</p>
      <h1>A different direction.</h1>
      <p>We couldn’t find that page.</p>
      <Link className="text-link" href="/">
        Return home ↗
      </Link>
    </main>
  );
}
