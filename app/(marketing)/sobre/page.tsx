import { DiagnosisCtaSection } from '@/components/marketing/diagnosis-cta-section';
import { PageHero } from '@/components/marketing/page-hero';
import { Card } from '@/components/ui/card';

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title="Quem Somos"
        description="Consultoria especializada em soluções sustentáveis e estratégias ESG para empresas que buscam performance com responsabilidade."
      />
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-8 sm:pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="marketing-card-hover rounded-2xl border-accent/40 bg-white/90 p-6 sm:p-8">
            <blockquote className="font-serif text-xl italic leading-relaxed text-florence-text">
              Ajudamos empresas a resolver problemas e alcancar melhores resultados, unindo responsabilidade e estratégia para um crescimento sólido e confiável.
            </blockquote>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-florence-text/60">Ana Vieira</p>
            <p className="mt-1 text-sm text-florence-text/75">Engenheira ambiental · Fundadora Florescencia</p>
          </Card>
          <Card className="marketing-card-hover space-y-5 rounded-2xl border-accent/40 bg-white/90 p-6 text-florence-text/85 sm:p-8">
            <p>
              A Florescencia e uma consultoria especializada em soluções sustentáveis e estratégias ESG. Fundada e liderada por Ana Vieira, engenheira ambiental com mais de 18 anos de experiência, a consultoria nasceu do proposito de integrar sustentabilidade e resultados empresariais de forma pratica e eficiente.
            </p>
            <p>
              Com uma trajetoria solida em multinacional americana de grande porte, Ana coordenou projetos estrategicos em gestao ambiental, mudanças climáticas, governança, certificações e impacto social. Ao longo de sua carreira, ela vem apoiando empresas a se adequarem as exigencias regulatorias e de mercado, com foco em governança ESG e performance sustentavel.
            </p>
            <p>
              A atuação da Florescencia e embasada em metodologias proprias e Sistemas de Gestao Integrados (SGI), com serviços que envolvem desde diagnóstico ESG, descarbonização e circularidade, ate projetos em politicas publicas, inventarios ambientais, educação socioambiental e treinamentos.
            </p>
            <p className="font-semibold text-florence-text">
              Acreditamos que sustentabilidade não é um custo, mas sim um diferencial competitivo que gera valor para negócios e para a sociedade.
            </p>
          </Card>
        </div>
      </section>
      <DiagnosisCtaSection />
    </>
  );
}
