'use client';

import { IndividualPublicForm } from '@/components/individual/individual-public-form';
import { useParams } from 'next/navigation';

export default function IndividualFormPage() {
  const params = useParams<{ slug: string }>();
  return <IndividualPublicForm slug={String(params.slug)} />;
}
