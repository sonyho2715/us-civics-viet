import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ locale: string; category: string }>;
}

export default async function StudyCategoryPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/study`);
}
