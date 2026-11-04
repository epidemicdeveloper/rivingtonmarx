import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getPage,
  getPages,
  getSiteContent,
  pageHref,
} from '@/lib/content/get-page';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
const indexRoutes = [
  'portfolio',
  'services',
  'about',
  'press',
  'blog',
  'contact',
  'testimonials',
  'privacy',
];
export async function generateStaticParams() {
  const pages = await getPages();
  return [
    ...new Set([
      ...indexRoutes,
      ...pages.map((p) => p.slug.replace(/^\/+|\/+$/g, '')),
    ]),
  ]
    .filter(Boolean)
    .map((slug) => ({ slug: slug.split('/') }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug.join('/'));
  return {
    title: page?.seoTitle
      ? { absolute: page.seoTitle }
      : page?.title || slug[0].charAt(0).toUpperCase() + slug[0].slice(1),
    description: page?.description,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const route = slug.join('/');
  const page = await getPage(route);
  const pages = await getPages();
  if (!page && !indexRoutes.includes(route)) notFound();
  const indexKind =
    route === 'portfolio' || route === 'projects'
      ? 'project'
      : route === 'services'
        ? 'service'
        : route === 'blog'
          ? 'article'
          : null;
  const collection = indexKind ? pages.filter((p) => p.kind === indexKind) : [];
  const label =
    route === 'blog'
      ? 'Journal'
      : page?.kind === 'project'
        ? 'Selected work'
        : page?.kind === 'service'
          ? 'Our expertise'
          : 'Rivington Marx Interiors';
  const title =
    route === 'portfolio'
      ? 'Spaces with a story.'
      : route === 'services'
        ? 'A considered approach.'
        : route === 'blog'
          ? 'Notes from the studio.'
          : route === 'contact'
            ? 'Let’s begin a conversation.'
            : page?.title || route;
  if (route === 'contact') {
    const { contact } = await getSiteContent();
    return (
      <main id="main">
        <section className="section page-intro">
          <p className="eyebrow">Get in touch</p>
          <h1>{title}</h1>
        </section>
        <section className="section contact-layout">
          <div>
            <h2>Your next chapter.</h2>
            <p>Denver based. Projects nationwide.</p>
            <div className="contact-details">
              <a href={'mailto:' + contact.email}>{contact.email} ↗</a>
              <a href={'tel:' + contact.phone.replace(/[^+\d]/g, '')}>
                {contact.phone}
              </a>
              <p>{contact.address}</p>
              <p>{contact.hours}</p>
            </div>
          </div>
          <ContactForm />
        </section>
      </main>
    );
  }
  if (indexKind)
    return (
      <main id="main">
        <section className="section page-intro">
          <p className="eyebrow">{label}</p>
          <h1>{title}</h1>
          {page?.description && (
            <p className="page-description">{page.description}</p>
          )}
        </section>
        <section className="section collection-section">
          <div
            className={
              indexKind === 'service' ? 'service-grid' : 'portfolio-grid'
            }
          >
            {collection.map((p, i) =>
              indexKind === 'service' ? (
                <Link key={p.slug} href={pageHref(p)} className="service-card">
                  <span className="eyebrow">0{i + 1} / Expertise</span>
                  {p.images[0] && (
                    <img
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      loading="lazy"
                      width="1000"
                      height="800"
                    />
                  )}
                  <h2>{p.navigationTitle || p.title} ↗</h2>
                  <p>{p.description}</p>
                </Link>
              ) : (
                <ProjectCard key={p.slug} page={p} index={i} />
              ),
            )}
          </div>
        </section>
      </main>
    );
  if (route === 'press' && page)
    return (
      <main id="main">
        <section className="section page-intro">
          <p className="eyebrow">In good company</p>
          <h1>{page.title}</h1>
          <p className="page-description">{page.description}</p>
        </section>
        <section className="section press-list">
          {page.links?.map((link, i) => (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              key={link.url}
            >
              <span className="eyebrow">
                {new URL(link.url).hostname.replace('www.', '')}
              </span>
              <h2>{link.label}</h2>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </section>
      </main>
    );
  const isProject = page?.kind === 'project';
  const paragraphs = page?.paragraphs || [];
  const images = page?.images || [];
  return (
    <main id="main">
      <section className="section page-intro">
        <p className="eyebrow">{label}</p>
        <h1>{title}</h1>
        {page?.description && (
          <p className="page-description">{page.description}</p>
        )}
      </section>
      {images[0] && (
        <div className="detail-hero">
          <img
            src={images[0].src}
            alt={images[0].alt || title}
            fetchPriority="high"
            width="1600"
            height="1100"
          />
        </div>
      )}
      <section className="section editorial">
        <aside>
          <p className="eyebrow">
            {isProject
              ? 'The project'
              : route === 'about'
                ? 'The studio'
                : 'In detail'}
          </p>
          <Link
            href={isProject ? '/portfolio/' : '/contact/'}
            className="text-link"
          >
            {isProject ? 'All projects' : 'Get in touch'} ↗
          </Link>
        </aside>
        <div className="prose">
          {(
            page?.blocks ||
            paragraphs.map((text) => ({ type: 'paragraph', text }))
          )
            .filter(
              (block) =>
                block.text !== page?.description && block.text !== title,
            )
            .map((block, i) =>
              block.type === 'heading' ? (
                <h2 key={i}>{block.text}</h2>
              ) : (
                <p key={i}>{block.text}</p>
              ),
            )}
          {!paragraphs.length && <p>Explore Rivington Marx Interiors.</p>}
        </div>
      </section>
      {images.length > 1 && (
        <section className="section gallery" aria-label={title + ' gallery'}>
          {images.slice(1).map((image, i) => (
            <figure key={image.src + i}>
              <img
                src={image.src}
                alt={image.alt || title + ' — detail ' + (i + 1)}
                loading="lazy"
                width="1200"
                height="1000"
              />
            </figure>
          ))}
        </section>
      )}
      {isProject && (
        <section className="section next-project">
          <p className="eyebrow">Continue exploring</p>
          {(() => {
            const projects = pages.filter((p) => p.kind === 'project');
            const next =
              projects[
                (projects.findIndex((p) => p.slug === page.slug) + 1) %
                  projects.length
              ];
            return next ? (
              <Link href={pageHref(next)}>
                <h2>{next.title} ↗</h2>
              </Link>
            ) : null;
          })()}
        </section>
      )}
    </main>
  );
}
