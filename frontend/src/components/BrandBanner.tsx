import { Logo } from "./Logo";

export function BrandBanner({ websiteUrl }: { websiteUrl?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-pink-light via-[#ffe0ef] to-[#ffd6ea] py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="pink-swoosh absolute -left-10 top-24 h-10 w-[70%] rotate-[-8deg] opacity-95" />
        <div className="pink-swoosh absolute left-[15%] top-40 h-10 w-[80%] rotate-[-8deg] opacity-90" />
        <span className="absolute left-[20%] top-10 text-2xl text-white/80">✦</span>
        <span className="absolute right-[18%] top-16 text-xl text-white/70">✦</span>
        <span className="absolute bottom-16 left-[40%] text-lg text-white/70">✦</span>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-3 px-6 md:px-10">
        {websiteUrl && (
          <p className="mb-4 w-full rounded bg-[#ffd0e6] px-4 py-2 text-center text-sm font-semibold text-brand-pink md:absolute md:left-0 md:top-0 md:mb-0">
            {websiteUrl}
          </p>
        )}
        <Logo className="mt-4 h-28 w-28 md:h-36 md:w-36" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-pink md:text-5xl">
            Sophea Naildesign
          </h1>
          <div className="mt-2 h-[3px] w-28 bg-brand-pink" />
        </div>
      </div>
    </section>
  );
}
