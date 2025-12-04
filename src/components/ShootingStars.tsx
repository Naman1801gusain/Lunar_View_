const starPositions = [
  { top: "10%", left: "80%", delay: "0s" },
  { top: "25%", left: "60%", delay: "1s" },
  { top: "5%", left: "30%", delay: "2.5s" },
  { top: "35%", left: "90%", delay: "3.2s" },
  { top: "50%", left: "70%", delay: "4.5s" },
  { top: "60%", left: "40%", delay: "5.2s" },
  { top: "20%", left: "15%", delay: "6.4s" },
];

const ShootingStars = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {starPositions.map((star, idx) => (
        <span
          key={`shooting-star-${idx}`}
          className="shooting-star mix-blend-screen"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

export default ShootingStars;

