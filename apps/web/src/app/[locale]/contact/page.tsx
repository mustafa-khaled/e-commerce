import type { Metadata } from "next";
import { Locale } from "@/i18n.config";
import Container from "@/components/container";
import getTrans from "@/lib/translation";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTrans(locale);
  return {
    title: t.metaTitleContact,
    description: t.metaDescriptionContact,
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTrans(locale);

  return (
    <main className="p-6">
      <Container>
        <section className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">{t.contactTitle}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">{t.contactDescription}</p>
        </section>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">{t.contactInfoTitle}</h2>
            <div className="space-y-3 text-gray-600">
              <p><span className="font-semibold">Email:</span> {t.contactInfoEmail}</p>
              <p><span className="font-semibold">Phone:</span> {t.contactInfoPhone}</p>
              <p><span className="font-semibold">Address:</span> {t.contactInfoAddress}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <form
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("name");
                const email = formData.get("email");
                const message = formData.get("message");
                console.log("Contact form submission:", { name, email, message });
              }}
              className="space-y-4"
            >
              <input
                name="name"
                className="w-full border p-2 rounded"
                placeholder={t.contactName}
                required
              />
              <input
                name="email"
                type="email"
                className="w-full border p-2 rounded"
                placeholder={t.contactEmail}
                required
              />
              <textarea
                name="message"
                rows={4}
                className="w-full border p-2 rounded"
                placeholder={t.contactMessage}
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
              >
                {t.contactSubmit}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
}
