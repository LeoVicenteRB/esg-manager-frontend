'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  delay?: number;
};

export function FeatureCard({ icon: Icon, title, description, className, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        className={cn(
          'marketing-card-hover flex h-full flex-col rounded-2xl border-accent/40 bg-white/90 p-6 text-left shadow-card backdrop-blur-sm',
          className,
        )}
      >
        <span className="icon-ring mb-5 h-12 w-12">
          <Icon size={22} />
        </span>
        <h3 className="font-serif text-lg font-semibold text-florence-text">{title}</h3>
        {description ? <p className="mt-3 text-sm leading-relaxed text-florence-text/75">{description}</p> : null}
      </Card>
    </motion.div>
  );
}
