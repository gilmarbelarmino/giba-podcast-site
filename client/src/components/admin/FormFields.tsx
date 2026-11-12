import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BaseProps = {
  label: string;
  hint?: string;
  className?: string;
};

export function Field({
  label,
  hint,
  className,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8fa0a6]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        className="field py-2.5 text-[0.9rem]"
      />
      {hint ? <span className="text-[0.7rem] text-[#5f7178]">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  className,
  value,
  onChange,
  rows = 4,
  placeholder,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8fa0a6]">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        className="field resize-y py-2.5 text-[0.9rem] leading-relaxed"
      />
      {hint ? <span className="text-[0.7rem] text-[#5f7178]">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  hint,
  className,
  value,
  onChange,
  options,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8fa0a6]">
        {label}
      </span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className="field py-2.5 text-[0.9rem]"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="text-[0.7rem] text-[#5f7178]">{hint}</span> : null}
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        className="mt-0.5 size-4 accent-[#2ee6d6]"
      />
      <span>
        <span className="block text-[0.84rem] font-medium text-white">{label}</span>
        {hint ? <span className="mt-0.5 block text-[0.7rem] text-[#5f7178]">{hint}</span> : null}
      </span>
    </label>
  );
}

export function AdminSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/8 bg-[#0a0f11] p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg uppercase tracking-wide text-white">{title}</h3>
          {description ? (
            <p className="mt-1 max-w-2xl text-[0.8rem] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
