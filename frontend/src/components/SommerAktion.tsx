import Image from "next/image";

export function SommerAktion() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <h2 className="mb-6 text-center text-3xl font-extrabold uppercase tracking-[0.08em] text-brand-pink md:text-4xl">
          SOMMER-Aktion
        </h2>
        <div className="overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/images/aktionen/sommer-aktion.jpg"
            alt="Sommer-Aktion Sophea Naildesign"
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
