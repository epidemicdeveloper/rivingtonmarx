import local from '@/content/site.json';
import homeDesign from '@/content/home-design.json';
import type { SiteContent, ContentPage } from './types';

// The presentation layer depends only on this contract. A future WPGraphQL
// adapter can map API responses here without changing page components.
export async function getSiteContent(): Promise<SiteContent> { return local as SiteContent; }
export async function getHomeDesign() { return homeDesign; }
export async function getPages(kind?: ContentPage['kind']) { const { pages } = await getSiteContent(); return kind ? pages.filter(page => page.kind === kind) : pages; }
export async function getPage(slug: string) { return (await getPages()).find(page => page.slug.replace(/^\/+|\/+$/g, '') === slug); }
export function pageHref(page: ContentPage) { return '/' + page.slug.replace(/^\/+|\/+$/g, '') + '/'; }
