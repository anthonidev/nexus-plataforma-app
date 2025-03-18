"use client";
const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000000_70%,transparent_100%)]" />
      <div className="absolute inset-0">
        <svg
          className="w-full h-full opacity-[0.2] dark:opacity-[0.15]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dotted-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" className="fill-primary/40" />
            </pattern>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#dotted-pattern)"
          />
        </svg>
      </div>
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,var(--primary)_50%,transparent_100%)] opacity-[0.03]"
            style={{
              animation: `slide ${20 + i * 5}s linear infinite`,
              transform: `translateX(-50%) rotate(${30 * i}deg)`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0">
        <svg
          className="w-full h-full opacity-[0.15] dark:opacity-[0.1]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="geometric-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 50h100M50 0v100"
              className="stroke-primary/30"
              strokeWidth="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="20"
              className="stroke-primary/30 fill-none"
              strokeWidth="0.5"
            />
            <rect
              x="40"
              y="40"
              width="20"
              height="20"
              className="stroke-primary/30 fill-none"
              strokeWidth="0.5"
              transform="rotate(45 50 50)"
            />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#geometric-pattern)"
          />
        </svg>
      </div>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ccc' stroke-width='0.5'%3E%3Cpath d='M0 0L60 60M60 0L0 60'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, var(--background) 80%)",
        }}
      />
    </div>
  );
};
export default BackgroundPattern;
