import Link from 'next/link';
import { getSiteContent } from '@/lib/content/get-page';
export default async function Footer() {
  const { contact } = await getSiteContent();
  return <footer><div className="footer-top"><div><p className="eyebrow">A considered beginning</p><Link href="/contact/" className="footer-invitation">It all begins with<br/><em>a conversation.</em> <span>↗</span></Link></div><div className="footer-contact"><a href={'mailto:' + contact.email}>{contact.email}</a><a href={'tel:' + contact.phone.replace(/[^+\d]/g,'')}>{contact.phone}</a><p>{contact.address}</p><p>By appointment only</p></div></div><div className="footer-bottom"><Link href="/" className="footer-brand">RIVINGTON MARX</Link><div><Link href="/blog/">Journal</Link><Link href="/testimonials/">Testimonials</Link><Link href="/privacy/">Privacy</Link></div><p>© {new Date().getFullYear()} Rivington Marx Interiors, LLC</p></div></footer>;
}
