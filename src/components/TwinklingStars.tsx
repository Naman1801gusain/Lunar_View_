import type { CSSProperties } from "react";

type TwinkleStar = {
  top: string;
  left: string;
  delay: string;
  size: string;
  duration: string;
  opacity: number;
};

const twinkleStars: TwinkleStar[] = Array.from({ length: 42 }).map(() => {
  const isLarge = Math.random() > 0.75;
  const baseSize = Math.random() * 2 + 1; // 1px - 3px
  const size = isLarge ? baseSize + Math.random() * 3 + 1 : baseSize;

  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
    size: `${size.toFixed(2)}px`,
    duration: `${3 + Math.random() * 4}s`,
    opacity: isLarge ? 0.55 : 0.3,
  };
});

const TwinklingStars = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {twinkleStars.map((star, idx) => {
        const style: CSSProperties & { "--twinkle-opacity"?: number } = {
          top: star.top,
          left: star.left,
          width: star.size,
          height: star.size,
          animationDelay: star.delay,
          animationDuration: star.duration,
          "--twinkle-opacity": star.opacity,
        };

        return <span key={`twinkle-${idx}`} className="twinkle-star" style={style} />;
      })}
    </div>
  );
};

export default TwinklingStars;

