export type Spec = { label: string; value: string };

/**
 * label ─────── value, on a hairline. The spec-sheet motif.
 *
 * Reads entirely off --ink / --ink-38 / --rule-dark, which resolve to navy on
 * light grounds and to white inside .on-dark or .hero-scope. There is no
 * `light` prop: the component asks its surroundings what colour it should be
 * rather than being told, so it can never be dropped into a section with the
 * wrong variant set — which is exactly what happened when the body palette
 * flipped and these rows went invisible on white.
 */
export function SpecList({ specs }: { specs: Spec[] }) {
  return (
    <dl className="flex flex-col">
      {specs.map((s) => (
        <div
          key={s.label}
          className="flex items-baseline gap-4 border-b border-[color:var(--rule-dark)] py-3 last:border-b-0"
        >
          <dt className="mi text-[color:var(--ink-38)]">{s.label}</dt>
          <dd className="mi ml-auto text-right text-[color:var(--ink)]">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
