import type { Player, PlayerTint } from "@/lib/engine/types";
import { cn, initials } from "@/lib/utils";

const TINT: Record<PlayerTint, string> = {
  p1: "bg-p1 text-accent-fg",
  p2: "bg-p2 text-accent-fg",
  p3: "bg-p3 text-accent-fg",
  p4: "bg-p4 text-accent-fg",
  p5: "bg-p5 text-fg",
  p6: "bg-p6 text-fg",
};

export function Token({
  tint = "p1",
  name,
  symbol,
  size = "md",
}: {
  tint?: PlayerTint;
  name?: string;
  symbol?: string;
  size?: "sm" | "md";
}) {
  const displayName = name ?? symbol ?? "Agent";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium",
        TINT[tint] ?? TINT.p1,
        size === "sm" ? "size-5 text-[9px]" : "size-7 text-[11px]",
      )}
      title={displayName}
    >
      {initials(displayName)}
    </span>
  );
}

export function PlayerChip({
  player,
  active,
  extra,
}: {
  player: Player;
  active?: boolean;
  extra?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-[12px] border px-3 py-2",
        active ? "border-accent/40 bg-raised" : "border-border bg-surface",
      )}
    >
      <Token tint={player.tint} name={player.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-medium">{player.name}</p>
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" title="Active" />
        </div>
        <p className="truncate text-[11px] text-muted">
          {extra || "Autonomous Agent"}
        </p>
      </div>
    </div>
  );
}
