import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------ CONFIG ------------------ */

const defaultConfig = {
  game_title: "Colour Prediction Game",
  win_multiplier_text: "Win 2x Your Hexa!",
  background_color: "#f8fafc",
  surface_color: "#ffffff",
  text_color: "#0f172a",
  primary_color: "#8b5cf6",
  secondary_color: "#06b6d4",
  font_family: "Inter",
  font_size: 16
};

const nftCollection = [
  { id: 1, name: "Cosmic Ape #001", image: "🦍", rarity: "HEXA" },
  { id: 2, name: "Cyber Punk #042", image: "🤖", rarity: "HEXA" },
  { id: 3, name: "Dragon Soul #123", image: "🐲", rarity: "HEXA" },
  { id: 4, name: "Moon Cat #777", image: "🐱", rarity: "HEXA" },
  { id: 5, name: "Phoenix Fire #999", image: "🔥", rarity: "HEXA" }
];

const slotColorSchemes = {
  3: ["bg-red-500", "bg-green-500", "bg-purple-500"],
  6: ["bg-orange-500", "bg-yellow-400", "bg-purple-500", "bg-pink-500", "bg-blue-500", "bg-gray-500"],
  9: ["bg-red-500", "bg-green-500", "bg-purple-500", "bg-black", "bg-yellow-400", "bg-blue-500", "bg-pink-500", "bg-gray-500", "bg-orange-500"]
};

/* ------------------ COMPONENT ------------------ */

export default function Game() {
  const [config] = useState(defaultConfig);
  const [walletBalance, setWalletBalance] = useState(100);
  const [slotsCount, setSlotsCount] = useState(3);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [wager, setWager] = useState(1);
  const [roundTime, setRoundTime] = useState(60);
  const [remainingTime, setRemainingTime] = useState(60);
  const [bettingLocked, setBettingLocked] = useState(false);
  const [orders, setOrders] = useState([]);
  const timerRef = useRef(null);

  /* ------------------ TIMER ------------------ */

  useEffect(() => {
    clearInterval(timerRef.current);
    setRemainingTime(roundTime);

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setBettingLocked(false);
          return roundTime;
        }

        if (prev <= 10) setBettingLocked(true);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [roundTime]);

  /* ------------------ HANDLERS ------------------ */

  const handleSelectSlot = index => {
    if (bettingLocked) return;
    setSelectedSlot(prev => (prev === index ? null : index));
  };

  const startGame = () => {
    if (bettingLocked) return alert("Betting locked");
    if (selectedSlot === null) return alert("Select a slot");
    if (walletBalance < wager) return alert("Insufficient balance");

    setWalletBalance(b => b - wager);

    const orderId = Date.now();
    const order = {
      id: orderId,
      slot: selectedSlot,
      wager,
      time: roundTime,
      remaining: roundTime
    };

    setOrders(o => [...o, order]);

    setSelectedSlot(null);

    setTimeout(() => resolveGame(orderId), roundTime * 1000);
  };

  const resolveGame = orderId => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;

        const won = Math.random() > 0.5;
        if (won) setWalletBalance(b => b + o.wager * 2);

        alert(won ? "🎉 YOU WON!" : "❌ YOU LOST");
        return { ...o, resolved: true, won };
      })
    );
  };

  /* ------------------ RENDER ------------------ */

  return (
    <div className="min-h-screen p-6 bg-slate-100">
      <h1 className="text-3xl font-bold mb-2">{config.game_title}</h1>
      <p className="text-slate-600 mb-6">{config.win_multiplier_text}</p>

      {/* STATUS */}
      <div className="flex gap-6 mb-6">
        <div>Balance: <b>{walletBalance} USDT</b></div>
        <div className={remainingTime <= 10 ? "text-red-500 font-bold" : ""}>
          Time: {remainingTime}s
        </div>
      </div>

      {/* SLOT COUNT */}
      <div className="flex gap-2 mb-4">
        {[3, 6, 9].map(n => (
          <button
            key={n}
            disabled={bettingLocked}
            onClick={() => setSlotsCount(n)}
            className={`px-4 py-2 rounded ${slotsCount === n ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            {n} Slots
          </button>
        ))}
      </div>

      {/* SLOTS GRID */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: slotsCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleSelectSlot(i)}
            className={`h-28 rounded-xl text-white font-bold transition transform ${
              slotColorSchemes[slotsCount][i]
            } ${
              selectedSlot === i ? "ring-4 ring-yellow-300 scale-105" : ""
            }`}
          >
            Slot {i + 1}
          </button>
        ))}
      </div>

      {/* WAGER */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="number"
          min="1"
          value={wager}
          onChange={e => setWager(+e.target.value)}
          className="border rounded px-3 py-2 w-32"
        />
        <span>USDT</span>
      </div>

      {/* CONFIRM */}
      <button
        onClick={startGame}
        disabled={selectedSlot === null || bettingLocked}
        className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold disabled:opacity-50"
      >
        Confirm Prediction
      </button>
    </div>
  );
}
