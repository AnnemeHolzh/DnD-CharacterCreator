// components/section-divider.tsx
export default function SectionDivider() {
  return (
    <div className="relative w-full h-[44px] -mt-[22px] z-10">
      {/* Divider */}
      <div
        className="w-full h-[44px]"
        style={{
          backgroundImage: "url('/images/divider.png')",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "0px 0px", // Top row
          backgroundSize: "auto 88px",   // 88px = 2 rows of 44px (doubled)
          pointerEvents: "none", // so it doesn't block clicks
        }}
        aria-hidden="true"
      />
      {/* Shadow below divider */}
      <div
        className="absolute left-0 right-0 -bottom-0 h-2 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))",
          filter: "blur(6px)",
        }}
        aria-hidden="true"
      />
    </div>
  )
}