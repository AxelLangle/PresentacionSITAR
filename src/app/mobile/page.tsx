import type { Metadata } from 'next';
import MobileCommitteeView from '@/components/MobileCommitteeView';

export const metadata: Metadata = {
  title: 'SITAR · Comité Científico (Vista Móvil)',
  description:
    'Síntesis técnica y ejecutiva del Sistema Integrado de Telemetría Remota (SITAR) con audioguía multilingüe (ES, EN, SK, PL).',
};

export default function MobilePage() {
  return <MobileCommitteeView />;
}
