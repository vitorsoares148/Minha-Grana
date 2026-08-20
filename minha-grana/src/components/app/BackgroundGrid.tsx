export default function BackgroundGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 min-h-screen opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 0.8px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 0.8px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
}
