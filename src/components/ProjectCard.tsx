import Link from 'next/link';
import type { ContentPage } from '@/lib/content/types';
import { pageHref } from '@/lib/content/get-page';
export default function ProjectCard({ page, index = 0 }: { page: ContentPage; index?: number }) {
  return <Link className="project-card" href={pageHref(page)}><div className="project-image">{page.images[0] && <img src={page.images[0].src} alt={page.images[0].alt || page.title} loading="lazy" width="1200" height="900"/>}<span className="image-arrow" aria-hidden="true">↗</span></div><div className="project-caption"><h3>{page.title}</h3><span>{String(index + 1).padStart(2,'0')}</span></div></Link>;
}
