import type { Metadata } from 'next';
import MobileCommitteeView from '@/components/MobileCommitteeView';

export const metadata: Metadata = {
  title: 'SITAR · Dossier Comité Científico',
  description:
    'Vista móvil ejecutiva del proyecto SITAR para el Comité Científico con soporte de audio en español, inglés, eslovaco y polaco.',
};

export default function ComitePage() {
  return <MobileCommitteeView />;
}
