export default function MainHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-primary font-bold text-4xl italic">{title}</h2>
      <p className="uppercase text-accent font-semibold leading-4">
        {description}
      </p>
    </div>
  );
}
