import type { Stat } from "@shared/content";
import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function Counter({ value }: { value: string }) {
  const match = value.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  const target = match ? Number(match[1].replace(",", ".")) : 0;
  const suffix = match?.[2] ?? "";
  const decimals = match?.[1].split(",")[1]?.length ?? 0;
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || !match) return;
    let frame = 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, match]);

  if (!match) return <span ref={ref}>{value}</span>;

  const formatted = current
    .toFixed(decimals)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative border-y border-white/8 bg-[#070b0c]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(46,230,214,0.08),transparent)]" />
      <div className="container-x relative grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="flex flex-col items-center gap-2 border-white/8 px-4 text-center md:border-r md:last:border-r-0"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-none text-white">
              <Counter value={stat.value} />
            </span>
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
