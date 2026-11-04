'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
const links = [['Portfolio', '/portfolio/'], ['About', '/about/'], ['Services', '/services/'], ['Press', '/press/'], ['Contact', '/contact/']];
export default function Header() {
  const [open, setOpen] = useState(false); const path = usePathname(); const button = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [path]);
  return <header className="site-header" onKeyDown={event => { if(event.key === 'Escape') { setOpen(false); button.current?.focus(); } }}>
    <Link href="/" className="wordmark" aria-label="Rivington Marx Interiors home">RIVINGTON <span>MARX</span><small>INTERIORS</small></Link>
    <button ref={button} className="menu-button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button>
    <nav id="main-navigation" aria-label="Main navigation" className={open ? 'navigation is-open' : 'navigation'}>{links.map(([label, href]) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}{label === 'Contact' && <span aria-hidden="true"> ↗</span>}</Link>)}</nav>
  </header>;
}
