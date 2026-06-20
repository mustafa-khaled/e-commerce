import type { Metadata } from "next";
import { Locale } from "@/i18n.config";
import Container from "@/components/container";
import getTrans from "@/lib/translation";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTrans(locale);
  return {
    title: t.metaTitleAbout,
    description: t.metaDescriptionAbout,
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTrans(locale);

  return (
    <main className="p-6">
      <Container>
        <section className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">{t.about}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.aboutHeroText}</p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-3">{t.aboutMissionTitle}</h2>
            <p className="text-gray-600">{t.aboutMissionText}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-3">{t.aboutVisionTitle}</h2>
            <p className="text-gray-600">{t.aboutVisionText}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-3">{t.aboutValuesTitle}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {t.aboutValuesList.split("|").map((v: string) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </section>
      </Container>
    </main>
  );
}
