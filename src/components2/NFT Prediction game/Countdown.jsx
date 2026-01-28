import { useEffect, useState } from "react";

export default function RoundCountdown({
  initialSeconds,
  warningAt = 10, // seconds
  onComplete,
}) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  return (
    <div
      id="mainCountdownDisplay"
      style={{
        display: "block",
        marginBottom: "16px",
        background: "linear-gradient(135deg, #06b6d420, #8b5cf620)",
        padding: "20px",
        borderRadius: "12px",
        border: "2px solid #06b6d4",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          color: "#0f172a",
          opacity: 0.8,
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        ⏰ Round Countdown
      </div>

      <div
        id="mainCountdownTime"
        style={{
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          fontSize: "40px",
          color: "#06b6d4",
          fontWeight: 900,
          textShadow: "0 2px 10px #06b6d440",
        }}
      >
        {seconds}s
      </div>

      {seconds <= warningAt && seconds > 0 && (
        <div
          id="countdownWarning"
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: "12px",
            color: "#ef4444",
            fontWeight: 700,
            marginTop: "8px",
            animation: "pulse 1s ease-in-out infinite",
          }}
        >
          ⚠️ Betting closes soon!
        </div>
      )}
    </div>
  );
}
