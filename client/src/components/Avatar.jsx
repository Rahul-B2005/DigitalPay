// A small set of brand-consistent duotone pairs so every person gets a
// stable, distinct-looking badge without needing real profile photos.
const PALETTE = [
  { bg: "bg-ink", text: "text-gold2" },
  { bg: "bg-moss", text: "text-paper" },
  { bg: "bg-rust", text: "text-paper" },
  { bg: "bg-ink2", text: "text-gold2" },
  { bg: "bg-gold", text: "text-ink" },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-14 w-14 text-lg",
};

export default function Avatar({ name = "?", size = "md" }) {
  const initial = name ? name[0].toUpperCase() : "?";
  const palette = PALETTE[hashString(name) % PALETTE.length];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-semibold ${palette.bg} ${palette.text} ${SIZES[size]}`}
    >
      {initial}
    </div>
  );
}
