import { cn } from "@/lib/utils";
import {
  Apple,
  Instagram,
  Linkedin,
  MessageCircle,
  Mic,
  Music2,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Animação de entrada ao rolar                                        */
/* ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
};

export function Reveal({ children, delay = 0, className, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Brilho que segue o mouse                                            */
/* ------------------------------------------------------------------ */

export function useSpotlight() {
  return {
    onMouseMove: (event: MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
    },
  };
}

/* ------------------------------------------------------------------ */
/* Título de seção                                                     */
/* ------------------------------------------------------------------ */

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
        align === "center" && "items-center text-center lg:flex-col lg:items-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="display-title mt-4 text-[clamp(2.2rem,4.6vw,3.9rem)] text-white">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ondas de áudio                                                      */
/* ------------------------------------------------------------------ */

type WaveformProps = {
  bars?: number;
  className?: string;
  barClassName?: string;
  color?: string;
  playing?: boolean;
};

export function Waveform({
  bars = 36,
  className,
  barClassName,
  color = "currentColor",
  playing = true,
}: WaveformProps) {
  const heights = Array.from({ length: bars }, (_, index) => {
    const wave = Math.sin(index * 0.62) * 0.5 + 0.5;
    const secondary = Math.sin(index * 0.21 + 1.3) * 0.28 + 0.28;
    return Math.max(0.16, Math.min(1, wave * 0.7 + secondary * 0.55));
  });

  return (
    <div className={cn("flex h-14 items-center gap-[3px]", className)} aria-hidden="true">
      {heights.map((height, index) => (
        <span
          key={index}
          className={cn("w-[3px] flex-1 rounded-full", barClassName)}
          style={{
            height: `${Math.round(height * 100)}%`,
            backgroundColor: color,
            transformOrigin: "center",
            animation: playing
              ? `wave ${1.1 + (index % 7) * 0.16}s ease-in-out ${(index % 9) * 0.08}s infinite`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ícones de redes                                                     */
/* ------------------------------------------------------------------ */

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  YouTube: Youtube,
  Instagram: Instagram,
  Spotify: Music2,
  TikTok: Music2,
  LinkedIn: Linkedin,
  "Apple Podcasts": Apple,
  WhatsApp: MessageCircle,
};

export function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const Icon = SOCIAL_ICONS[platform] ?? Mic;
  return <Icon className={className} aria-hidden="true" />;
}
