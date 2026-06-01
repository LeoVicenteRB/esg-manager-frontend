'use client';

import { useParams } from 'next/navigation';
import { OperationalDiagnosisForm } from '@/components/operational/diagnosis-form';

export default function Page() {
  const { token } = useParams<{ token: string }>();
  return <OperationalDiagnosisForm token={token} />;
}
