export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];

  return (
    <section
      aria-label="Temas do GIBA Podcast"
      className="relative overflow-hidden border-y border-white/8 bg-[#070b0c] py-5"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#070b0c] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#070b0c] to-transparent" />
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            <span className="font-display text-[1.6rem] uppercase tracking-[0.08em] text-white/85 sm:text-[2rem]">
              {item}
            </span>
            <span className="grid size-2.5 rotate-45 place-items-center bg-brand/80" aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  );
}
