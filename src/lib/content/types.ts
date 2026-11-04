export interface ContentImage { src: string; alt: string; sourceUrl: string }
export interface ContentPage {
  slug: string; title: string; description: string; paragraphs: string[];
  images: ContentImage[]; sourceUrl: string; kind: 'project' | 'service' | 'article' | 'page';
  seoTitle?: string;
  navigationTitle?: string;
  blocks?: { type: 'heading' | 'paragraph'; text: string }[];
  links?: { label: string; url: string }[];
}
export interface SiteContent {
  home: { title: string; description: string; paragraphs: string[]; images: ContentImage[]; sourceUrl: string };
  pages: ContentPage[];
  contact: { phone: string; email: string; address: string; hours: string; sourceUrl: string };
}
