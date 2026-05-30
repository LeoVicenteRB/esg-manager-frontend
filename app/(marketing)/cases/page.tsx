import { PageHero } from '@/components/marketing/page-hero';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const cases = [
  {
    title: 'Governança ESG',
    items: [
      'Implementação de governança ESG fortalecendo politicas e diretrizes ambientais, sociais e de conformidade.',
      'Conducao de comites estrategicos para pegada de carbono e impacto socioambiental.',
      'ESG e Governança em clinicas de saude e cooperativas.',
    ],
    featured: true,
  },
  {
    title: 'Descarbonização	o e Estratégia Climática',
    items: [
      'Estruturação de metricas e estratégias para neutralização de carbono alinhadas a metas corporativas.',
      'Desenvolvimento de um projeto piloto para engajar parceiros na reducao de emissoes do escopo 3.',
      'Lancamento de um edital para consolidar dados de escopo 3 via API, com startup selecionada para piloto.',
    ],
  },
  {
    title: 'Certificações e Resíduos',
    items: [
      '18 anos de experiência em FSC, incluindo auditorias e transição de certificações.',
      'Lideranca no gerenciamento de residuos, incluindo compostagem e otimização de processos logisticos.',
    ],
  },
  {
    title: 'Impacto Comunitario e Politicas Publicas',
    items: [
      'Desenvolvimento de politicas publicas para hortas comunitarias em Mogi das Cruzes.',
      'Lideranca no CRSMA, impactando 3 mil alunos por ano com educação ambiental.',
    ],
  },
];

export default function CasesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resultados"
        title="Casos de Sucesso"
        description="Projetos reais que traduzem estratégia ESG em impacto mensuravel para empresas e comunidades."
      />
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-8 sm:pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          {cases.map((item) => (
            <Card
              key={item.title}
              className={cn(
                'marketing-card-hover rounded-2xl border-accent/40 bg-white/90 p-6 sm:p-8',
                item.featured && 'md:col-span-2',
              )}
            >
              <h2 className="font-serif text-xl font-semibold text-florence-text">{item.title}</h2>
              <ul className="mt-4 space-y-3 text-florence-text/80">
                {item.items.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
