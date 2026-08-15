"use client";

export function BarChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  const rows = Array.isArray(data) ? data : [];
  const max = Math.max(...rows.map((d) => d.count), 1);
  const w = 360;
  const h = 160;
  const pad = { top: 16, right: 12, bottom: 28, left: 28 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const gap = 10;
  const barW =
    rows.length > 0 ? (innerW - gap * (rows.length - 1)) / rows.length : innerW;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full">
      {[0, 0.5, 1].map((t) => {
        const y = pad.top + innerH * (1 - t);
        return (
          <g key={t}>
            <line
              x1={pad.left}
              x2={w - pad.right}
              y1={y}
              y2={y}
              stroke="var(--admin-chart-grid, #f0f0f0)"
              strokeWidth={1}
            />
            <text
              x={pad.left - 8}
              y={y + 3}
              textAnchor="end"
              className="fill-neutral-400"
              style={{ fontSize: 10 }}
            >
              {Math.round(max * t)}
            </text>
          </g>
        );
      })}
      {rows.map((d, i) => {
        const barH = (d.count / max) * innerH;
        const x = pad.left + i * (barW + gap);
        const y = pad.top + innerH - barH;
        return (
          <g key={d.label + i}>
            <defs>
              <linearGradient id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fc03a1" />
                <stop offset="100%" stopColor="#ff5aad" stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(barH, 2)}
              rx={4}
              fill={`url(#barGrad${i})`}
            />
            {d.count > 0 && (
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                className="fill-neutral-700"
                style={{ fontSize: 10, fontWeight: 600 }}
              >
                {d.count}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={h - 8}
              textAnchor="middle"
              className="fill-neutral-500"
              style={{ fontSize: 11 }}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const rows = Array.isArray(segments) ? segments : [];
  const total = rows.reduce((s, x) => s + x.value, 0) || 1;
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 54;
  const stroke = 22;
  const circ = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-36 w-36 shrink-0">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--admin-chart-grid, #f3f3f3)"
          strokeWidth={stroke}
        />
        {rows.map((seg) => {
          const len = (seg.value / total) * circ;
          const el = (
            <circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += len;
          return el;
        })}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="fill-neutral-900"
          style={{ fontSize: 22, fontWeight: 700 }}
        >
          {rows.reduce((s, x) => s + x.value, 0)}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          className="fill-neutral-400"
          style={{ fontSize: 10 }}
        >
          Nachrichten
        </text>
      </svg>
      <div className="space-y-2">
        {rows.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: seg.color }}
            />
            <span className="text-neutral-600">{seg.label}</span>
            <span className="ml-auto font-semibold text-neutral-900">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContentMixBars({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const rows = Array.isArray(data) ? data : [];
  const max = Math.max(...rows.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {rows.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-neutral-600">{d.label}</span>
            <span className="font-semibold text-neutral-900">{d.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-pink to-[#ff5aad] transition-all"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
