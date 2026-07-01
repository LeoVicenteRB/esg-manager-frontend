import type { ComponentType } from 'react';
import * as HeroSectionModule from '@/components/marketing/hero-section';
import * as HomeContentModule from '@/components/marketing/home-content';
import * as PageHeroModule from '@/components/marketing/page-hero';
import * as SiteFooterModule from '@/components/marketing/site-footer';
import * as SiteHeaderModule from '@/components/marketing/site-header';

function resolveComponent(module: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    const component = module[name];
    if (component) return component as ComponentType;
  }

  return null;
}

const SiteHeader = resolveComponent(SiteHeaderModule, ['default', 'SiteHeader']);
const HeroSection = resolveComponent(HeroSectionModule, ['default', 'HeroSection']);
const PageHero = resolveComponent(PageHeroModule, ['default', 'PageHero']);
const HomeContent = resolveComponent(HomeContentModule, ['default', 'HomeContent']);
const SiteFooter = resolveComponent(SiteFooterModule, ['default', 'SiteFooter']);

export default function HomePage() {
  const Hero = HeroSection ?? PageHero;

  return (
    <>
      {SiteHeader ? <SiteHeader /> : null}
      {Hero ? <Hero /> : null}
      {HomeContent ? <HomeContent /> : null}
      {SiteFooter ? <SiteFooter /> : null}
    </>
  );
}
