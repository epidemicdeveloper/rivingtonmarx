import Link from 'next/link';
import {
  getSiteContent,
  getPages,
  getHomepage,
  pageHref,
} from '@/lib/content/get-page';
import HomeHero from '@/components/HomeHero';
import ContactForm from '@/components/ContactForm';
import './homepage.css';
export default async function Home() {
  const { home, contact } = await getSiteContent();
  const content = await getHomepage();
  const projects = await getPages('project');
  const services = await getPages('service');
  const featured = content.featuredSlugs.map(
    (slug) => projects.find((p) => p.slug === slug)!,
  );
  const stone = projects.find((p) => p.slug === 'project/tailored-in-stone')!;
  const studio = projects.find((p) => p.slug === 'project/in-the-studio')!;
  return (
    <main id="main" className="editorial-home">
      <HomeHero
        projects={[stone, featured[0], featured[2]]}
        title={content.title}
        location={content.location}
      />
      <section className="home-intro home-margin" id="introduction">
        <p className="eyebrow">○ &nbsp; Design done differently</p>
        <div>
          <h2>
            We believe a home should <br />
            do more than impress. <br />
            <em>It should reveal something true.</em>
          </h2>
          <p>{content.introduction}</p>
          <Link className="home-link" href="/about/">
            About the studio <span>↗</span>
          </Link>
        </div>
        <p className="intro-aside">
          Denver based.
          <br />
          Projects nationwide.
        </p>
      </section>
      <section className="home-work home-margin" id="work">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">01 / The portfolio</p>
            <h2>
              Design. <em>Deeply personal.</em>
            </h2>
          </div>
          <Link className="home-link" href="/portfolio/">
            All nine projects <span>↗</span>
          </Link>
        </div>
        <div className="home-work-label">
          <span>Selected work</span>
          <span className="eyebrow">Rivington Marx Interiors</span>
        </div>
        <div className="home-project-grid">
          {featured.map((project, i) => (
            <article key={project.slug}>
              <Link className="home-project-photo" href={pageHref(project)}>
                <img
                  src={project.images[0].src}
                  alt={project.images[0].alt}
                  width="1200"
                  height="1000"
                  loading="lazy"
                />
                <span aria-hidden="true">↗</span>
              </Link>
              <div className="home-project-caption">
                <div>
                  <p className="eyebrow">0{i + 1} / Selected interiors</p>
                  <h3>
                    <Link href={pageHref(project)}>{project.title}</Link>
                  </h3>
                </div>
                <Link
                  href={pageHref(project)}
                  aria-label={'Explore ' + project.title}
                >
                  Explore ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="home-work-label">
          <span className="eyebrow">Explore the full portfolio</span>
          <Link className="home-link" href="/portfolio/">
            View all projects ↗
          </Link>
        </div>
      </section>
      <section className="home-detail home-margin">
        <div>
          <p className="eyebrow">Bespoke design intelligence</p>
          <h2>
            Considered. Enduring.
            <br />
            <em>Quietly confident.</em>
          </h2>
          <p>{home.paragraphs[10]}</p>
        </div>
        <figure>
          <img
            src={home.images[0].src}
            alt={home.images[0].alt}
            width="700"
            height="900"
            loading="lazy"
          />
          <figcaption className="eyebrow">
            Every line, material, and proportion — chosen with purpose.
          </figcaption>
        </figure>
      </section>
      <section className="home-approach" id="approach">
        <div className="home-margin approach-layout">
          <img
            className="approach-photo"
            src={featured[2].images[0].src}
            alt={featured[2].images[0].alt}
            width="1000"
            height="1300"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">02 / Our approach</p>
            <h2>
              Rivington Marx.
              <br />
              <em>Design done differently.</em>
            </h2>
            <div className="home-accordion">
              {content.principles.map((principle, i) => (
                <details key={principle.title} open={i === 0}>
                  <summary>
                    <span className="eyebrow">0{i + 1}</span>
                    <h3>{principle.title}</h3>
                    <span className="expand-symbol" aria-hidden="true" />
                  </summary>
                  <div>
                    {principle.paragraphs.map((paragraph, j) => (
                      <p key={j}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
            <p className="approach-conclusion">{content.conclusion}</p>
            <Link className="home-link" href="#inquiry">
              Tell us what you have in mind ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="home-services home-margin">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Our expertise</p>
            <h2>
              Every detail. <em>Connected.</em>
            </h2>
          </div>
          <Link className="home-link" href="/services/">
            Explore our services ↗
          </Link>
        </div>
        <div className="home-service-list">
          {services.map((service, i) => (
            <Link key={service.slug} href={pageHref(service)}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{service.navigationTitle}</h3>
              <span>↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="home-studio home-margin" id="studio">
        <div>
          <p className="eyebrow">03 / The studio</p>
          <h2>
            Interior architecture.
            <br />
            <em>A personal point of view.</em>
          </h2>
          <p>{content.introduction}</p>
          <Link className="home-link" href="/about/">
            Meet Rivington Marx ↗
          </Link>
        </div>
        <figure>
          <img
            src={studio.images[0].src}
            alt={studio.images[0].alt}
            width="1100"
            height="1000"
            loading="lazy"
          />
          <figcaption>
            <span className="eyebrow">In the studio</span>
            <span className="eyebrow">Denver, Colorado</span>
          </figcaption>
        </figure>
      </section>
      <section className="home-testimonial home-margin">
        <p className="eyebrow">In our clients’ words</p>
        <blockquote>“{content.testimonial.quote}”</blockquote>
        <p className="eyebrow">{content.testimonial.author}</p>
        <Link href="/testimonials/" className="home-link">
          Read more client testimonials ↗
        </Link>
      </section>
      <section className="home-closing home-margin">
        <img
          src={featured[0].images[0].src}
          alt={featured[0].images[0].alt}
          width="1600"
          height="1000"
          loading="lazy"
        />
        <p className="eyebrow">A new chapter</p>
        <div>
          <h2>
            It all begins with
            <br />
            <em>a conversation.</em>
          </h2>
          <a href="#inquiry" aria-label="Begin your inquiry">
            ↗
          </a>
        </div>
        <div className="closing-contact">
          <a href={'mailto:' + contact.email}>{contact.email}</a>
          <a href={'tel:' + contact.phone.replace(/\D/g, '')}>
            {contact.phone}
          </a>
          <span className="eyebrow">By appointment / Denver & nationwide</span>
        </div>
      </section>
      <section className="home-inquiry home-margin" id="inquiry">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h2>
            Tell us about
            <br />
            <em>your home.</em>
          </h2>
          <p>{contact.address}</p>
          <p>{contact.hours}</p>
        </div>
        <ContactForm />
      </section>
      <div className="home-footer home-margin">
        <Link href="/" aria-label="Rivington Marx home">
          <img
            src={content.logo.src}
            alt="Rivington Marx Interiors"
            width="600"
            height="115"
          />
        </Link>
        <nav aria-label="Footer navigation">
          <Link href="/services/">Services</Link>
          <Link href="/portfolio/">Portfolio</Link>
          <Link href="/about/">About</Link>
          <Link href="/press/">Press</Link>
          <Link href="/blog/">Journal</Link>
          <Link href="/testimonials/">Testimonials</Link>
          <Link href="/privacy/">Privacy</Link>
        </nav>
        <a href="#main">Back to the top ↑</a>
        <p>© {new Date().getFullYear()} Rivington Marx Interiors, LLC</p>
      </div>
    </main>
  );
}
