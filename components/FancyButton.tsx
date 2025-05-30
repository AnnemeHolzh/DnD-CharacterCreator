// components/FancyButton.tsx
import React from "react"

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  icon?: React.ReactNode
}

export default function FancyButton({ children, icon, ...props }: FancyButtonProps) {
  // Cap width and height based on your sprite
  const capWidth = 54
  const capHeight = 51

  return (
    <button
      {...props}
      className="relative flex items-center justify-center font-bold text-yellow-200 text-lg tracking-wider focus:outline-none group"
      style={{
        height: capHeight,
        minWidth: 120,
        paddingLeft: capWidth,
        paddingRight: capWidth,
        background: "none",
        border: "none",
      }}
    >
      {/* Button body */}
      <div
        className="absolute inset-0 z-0 transition-all duration-150"
        style={{
          backgroundImage: "url('/images/button-sprite.png')",
          backgroundPosition: "0px 0px",
          backgroundRepeat: "repeat-x",
          backgroundSize: `auto 204px`,
          height: capHeight,
        }}
      />
      {/* Button body hover/active */}
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-150"
        style={{
          backgroundImage: "url('/images/button-sprite.png')",
          backgroundPosition: "0px -51px",
          backgroundRepeat: "repeat-x",
          backgroundSize: `auto 204px`,
          height: capHeight,
        }}
      />
      {/* Left cap */}
      <img
        src="/images/button-sprite.png"
        alt=""
        className="absolute left-0 top-0 z-20 pointer-events-none"
        style={{
          width: capWidth,
          height: capHeight,
          objectFit: "none",
          objectPosition: `-4px -109px`,
        }}
        aria-hidden="true"
      />
      {/* Right cap */}
      <img
        src="/images/button-sprite.png"
        alt=""
        className="absolute right-0 top-0 z-20 pointer-events-none"
        style={{
          width: capWidth,
          height: capHeight,
          objectFit: "none",
          objectPosition: `6px -161px`,
        }}
        aria-hidden="true"
      />
      {/* Button content */}
      <span className="relative z-30 flex items-center gap-2">
        {children}
        {icon}
      </span>
    </button>
  )
}