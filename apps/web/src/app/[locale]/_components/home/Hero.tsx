import { getCurrentLocale } from "@/lib/getCurrentLocale";
import Container from "@/components/container";
import getTrans from "@/lib/translation";

export default async function Hero() {
  const locale = await getCurrentLocale();

  const { welcome } = await getTrans(locale);

  return (
    <section className="bg-gray-200 py-16 h-[50vh]">
      <Container>
        <h1 className="text-xl font-semibold mb-5">{welcome}</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
          quaerat quis vitae vel possimus ipsum, animi cum dignissimos debitis
          deserunt consectetur voluptatibus facere omnis sequi. Voluptates nobis
          reprehenderit voluptas doloremque?
        </p>
      </Container>
    </section>
  );
}
