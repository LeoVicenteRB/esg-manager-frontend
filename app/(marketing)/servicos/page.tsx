import { PageHero } from '@/components/marketing/page-hero';
import { Card } from '@/components/ui/card';

const services = [
  {
    title: 'Estratégia e Certificação de Produtos Sustentáveis',
    description:
      'Implementação de certificações como FSC, Carbono Neutro, ISO 14001, entre outras. Auditorias internas, apoio a cadeia de fornecimento e criterios de sustentabilidade.',
  },
  {
    title: 'Design Sustentavel e Economia Circular',
    description:
      'Consultoria para ecodesign de produtos e embalagens, reaproveitamento de materiais, planejamento de logistica reversa e praticas de economia circular.',
  },
  {
    title: 'Gestao de Pegada de Carbono e Recursos Naturais',
    description:
      'Calculo e mitigação de emissoes (Escopos 1, 2 e 3), uso eficiente da agua e energia, inventario de GEE, e estratégias de descarbonização e compensação.',
  },
  {
    title: 'Compliance ESG e Regulatorios',
    description:
      'Adequação a normas ambientais e ESG (CVM 217, GHG Protocol, LGPD, INMETRO), mapeamento de riscos e oportunidades, relatorios tecnicos e planos de conformidade.',
  },
  {
    title: 'Comunicação, Marketing Verde e Educação Ambiental',
    description:
      'Estratégias para marketing com proposito, storytelling sustentavel, selos ambientais, prevenção de greenwashing e programas de educação socioambiental.',
  },
];

export default function ServicosPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Nossos Serviços"
        description="Soluções completas para estruturar, operacionalizar e comunicar a jornada ESG da sua empresa."
      />
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-8 sm:pb-16">
        <div className="grid gap-5">
          {services.map((service, index) => (
            <Card key={service.title} className="marketing-card-hover rounded-2xl border-accent/40 bg-white/90 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="icon-ring h-10 w-10 shrink-0 text-sm font-bold">{index + 1}</span>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-florence-text">{service.title}</h2>
                  <p className="mt-3 leading-relaxed text-florence-text/80">{service.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
