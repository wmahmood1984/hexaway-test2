import { AbiCoder, parseEther } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { gameAdd, gameContract, gameContractR, HexaContract, HEXAContractR, priceOracleContractR } from '../../config'
import { useAppKitAccount } from '@reown/appkit/react'
import { useConfig } from 'wagmi'
import { executeContract } from '../../utils/contractExecutor'
import RoundCountdown from './Countdown'
import DepositModal from './Modal'

const colors = ['Red', 'Green', 'Purple', "black", "yellow", "blue", "pink", "grey", "orange"]

export default function Game() {
  const config = useConfig()
  const { address } = useAppKitAccount();
  const [slot, setSlots] = useState(3)
  const [time, setTime] = useState(1)
  const [amount, setAmount] = useState(0.1)
  const [hexaBalance, setHexaBalance] = useState(0.1)
  const [price, setPrice] = useState(0.01)
  const [Spent, setSpent] = useState(0)
  const [Won, setWon] = useState(0)
  const [depositBalance, setDepositBalance] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [showDeposit, setShowDeposit] = useState(false);
  const ROUND_BUFFER = 1; // safety buffer

  const [gameRan, setGameRan] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [predictionHistory, setPredictionHistory] = useState()
  const [loading, setLoading] = useState(false)


  const findGame = (slots, time) => {
    switch (true) {
      case slots === 3 && time === 1: return 0;
      case slots === 3 && time === 3: return 1;
      case slots === 3 && time === 5: return 2;
      case slots === 3 && time === 10: return 3;

      case slots === 6 && time === 1: return 4;
      case slots === 6 && time === 3: return 5;
      case slots === 6 && time === 5: return 6;
      case slots === 6 && time === 10: return 7;

      case slots === 9 && time === 1: return 8;
      case slots === 9 && time === 3: return 9;
      case slots === 9 && time === 5: return 10;
      case slots === 9 && time === 10: return 11;

      default:
        throw new Error("Invalid slots or time combination");
    }
  };



  useEffect(() => {
    abc()
  }, [address])


  const fetchGameRan = useCallback(async () => {
    const gameAddr = findGame(slot, time);

    const ran = await gameContractR.methods.gameRan(gameAddr).call();
       console.log("remaining", {gameAddr,ran})
    setGameRan(Number(ran));
  }, [slot, time]);


  useEffect(() => {
    fetchGameRan();
  }, [fetchGameRan]);


  useEffect(() => {
    if (!gameRan) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const end = gameRan + time * 60;
      const diff = Math.max(end - now, 0);

      setRemaining(diff);

      // 🔁 Round ended → refetch once
      if (diff === 0) {
        fetchGameRan();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameRan, time, fetchGameRan]);








  const abc = async () => {
    const _hexaBalance = await HEXAContractR.methods.balanceOf(address).call()
    setHexaBalance((_hexaBalance / 1e18).toFixed(0))
    const _price = await priceOracleContractR.methods.price().call()
    setPrice((_price / 1e18).toFixed(4))
    const _spent = await gameContractR.methods.totalSpent(address).call()
    setSpent((_spent / 1e18).toFixed(4))
    const _won = await gameContractR.methods.totalWon(address).call()
    setWon((_won / 1e18).toFixed(4))
    const _depositBalance = await gameContractR.methods.balance(address).call()
    setDepositBalance((_depositBalance / 1e18).toFixed(4))
    // const _game = await gameContractR.methods.getGame().call()
    
   
  
  }


  const handleClick1 = async (v) => {


    if (
      Number(hexaBalance) < amount
    ) {
      toast.error("Insufficient HEXA Balance")
      return
    }

    const value = amount / price;
    console.log("value", value)
    try {
      setLoading(true);
      await executeContract({
        config,
        functionName: "approve",
        args: [gameAdd, parseEther(value.toString())],
        contract: HexaContract,
        onSuccess: () => onStakeClick1(v),
        onError: () => {
          setLoading(false);
          toast.error("Approval failed");
        }
      });

    } catch (err) {
      setLoading(false);
      toast.error("Unexpected error occurred");
      console.error(err);
    }
  };




  const handleClick = async (v) => {

    let gameAddr = findGame(slot, time);
//    console.log("object", gameAddr)
    await executeContract({
      config,
      functionName: "placeBid",
      args: [gameAddr, parseEther(amount.toString()), colors.indexOf(v)],
      onSuccess: (txHash, receipt) => {
        console.log("🎉 Tx Hash:", txHash);
        console.log("🚀 Tx Receipt:", receipt);
        toast.success("Stake done successfully")

        setLoading(false)
      },
      contract: gameContract,
      onError: (err) => {
        console.error("🔥 Error in register:", err);
        toast.error("Transaction failed:", reason)
        setLoading(false)
      },
    });
  }



  const isLoading = false;
  const now = new Date().getTime() / 1000;

  const duration = ((Number(gameRan) + Number(time * 60)) - now).toFixed(0)


  if (isLoading) {
    // show a waiting/loading screen
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
      </div>
    );
  }

  // console.log("prediction", { duration, now, gameRan, time })

  return (
    <div>
      <div id="app" class="h-full w-full overflow-auto">

        <div id="gamePage" class="min-h-full w-full p-4 md:p-8" style={{ background: "linear-gradient(135deg, #f8fafc, #ddd6fe)" }}>
          <div class="max-w-6xl mx-auto">

            <div class="mb-8">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px", gap: "12px" }}>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <h1 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "28px", color: "#0f172a", fontWeight: 900, marginBottom: "8px", textShadow: "0 4px 20px #8b5cf6" }}>
                    Colour Prediction Game
                  </h1>
                  <p style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#06b6d4", fontWeight: 700 }}>
                    Win 2x Your Hexa!
                  </p>
                </div>
              </div>
            </div>

            <button 
            style={{ padding: "12px 8px", borderRadius: "10px", border: "2px solid #8b5cf6", background:   "#8b5cf6", color:  "white" , cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, transition: "all 0.2s" }}
            onClick={() => setShowDeposit(true)}>Deposit</button>


            <div style={{ background: "linear-gradient(135deg, #ffffff, #8b5cf630)", padding: "16px", borderRadius: "16px", marginBottom: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", border: "3px solid #8b5cf6" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>
                    💼 Balance
                  </div>
                  <div id="walletBalanceDisplay" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#0f172a", fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {depositBalance}H
                  </div>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>
                    📊 Price
                  </div>
                  <div id="tokenPriceDisplay" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#8b5cf6", fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    ${price}
                  </div>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>
                    💸 Spent
                  </div>
                  <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#06b6d4", fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {Spent}H
                  </div>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>
                    🏆 Won
                  </div>
                  <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#10b981", fontWeight: 900, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {Won}H
                  </div>
                </div>

              </div>
            </div>


            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>

              <h2 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "20px" }}>
                🎲 Make Your Prediction
              </h2>


              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 700, marginBottom: "8px" }}>
                  🎰 Select Color
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  <button
                    onClick={() => { setSlots(3) }}
                    id="slot3Btn"
                    class="slot-btn"
                    data-slots="3"
                    style={{ padding: "12px 8px", borderRadius: "10px", border: slot == 3 ? "2px solid #8b5cf6" : "2px solid #8b5cf640", background: slot == 3 ? "#8b5cf6" : "#f8fafc", color: slot == 3 ? "white" : "#0f172a", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, transition: "all 0.2s" }}
                  >
                    3 Colors
                  </button>
                  <button
                    onClick={() => { setSlots(6) }}
                    id="slot6Btn"
                    class="slot-btn"
                    data-slots="6"
                    style={{ padding: "12px 8px", borderRadius: "10px", border: slot == 6 ? "2px solid #8b5cf6" : "2px solid #8b5cf640", background: slot == 6 ? "#8b5cf6" : "#f8fafc", color: slot == 6 ? "white" : "#0f172a", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, transition: "all 0.2s" }}
                  >
                    6 Colors
                  </button>
                  <button
                    onClick={() => { setSlots(9) }}
                    id="slot9Btn"
                    class="slot-btn"
                    data-slots="9"
                    style={{ padding: "12px 8px", borderRadius: "10px", border: slot == 9 ? "2px solid #8b5cf6" : "2px solid #8b5cf640", background: slot == 9 ? "#8b5cf6" : "#f8fafc", color: slot == 9 ? "white" : "#0f172a", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, transition: "all 0.2s" }}
                  >
                    9 Colors
                  </button>
                </div>
              </div>


              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 700, marginBottom: "8px" }}>
                  ⏱️ Select Time
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  <button
                    onClick={() => { setTime(1) }}
                    id="time60Btn"
                    class="time-btn"
                    data-time="60"
                    style={{ padding: "10px", borderRadius: "10px", border: time == 1 ? "2px solid #06b6d4" : "2px solid #06b6d440", background: time == 1 ? "#06b6d4" : "#f8fafc", color: time == 1 ? "white" : "#0f172a", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, transition: "all 0.2s" }}
                  >
                    1 min
                  </button>
                  <button
                    onClick={() => { setTime(3) }}
                    id="time180Btn"
                    class="time-btn"
                    data-time="180"
                    style={{ padding: "10px", borderRadius: "10px", border: time == 3 ? "2px solid #06b6d4" : "2px solid #06b6d440", background: time == 3 ? "#06b6d4" : "#f8fafc", color: time == 3 ? "white" : "#0f172a", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, transition: "all 0.2s" }}
                  >
                    3 min
                  </button>
                  <button
                    onClick={() => { setTime(5) }}
                    id="time300Btn"
                    class="time-btn"
                    data-time="300"
                    style={{ padding: "10px", borderRadius: "10px", border: time == 5 ? "2px solid #06b6d4" : "2px solid #06b6d440", background: time == 5 ? "#06b6d4" : "#f8fafc", color: time == 5 ? "white" : "#0f172a", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, transition: "all 0.2s" }}
                  >
                    5 min
                  </button>
                  <button
                    onClick={() => { setTime(10) }}
                    id="time600Btn"
                    class="time-btn"
                    data-time="600"
                    style={{ padding: "10px", borderRadius: "10px", border: time == 10 ? "2px solid #06b6d4" : "2px solid #06b6d440", background: time == 10 ? "#06b6d4" : "#f8fafc", color: time == 10 ? "white" : "#0f172a", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, transition: "all 0.2s" }}
                  >
                    10 min
                  </button>
                </div>
              </div>


              {/* <div id="mainCountdownDisplay" style={{ display: "block", marginBottom: "16px", background: "linear-gradient(135deg, #06b6d420, #8b5cf620)", padding: "20px", borderRadius: "12px", border: "2px solid #06b6d4", textAlign: "center" }}>
                <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", opacity: 0.8, marginBottom: "8px", fontWeight: 600 }}>
                  ⏰ Round Countdown
                </div>
                <div id="mainCountdownTime" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "40px", color: "#06b6d4", fontWeight: 900, textShadow: "0 2px 10px #06b6d440" }}>
                  {seconds}
                </div>
                <div id="countdownWarning" style={{ display: "none", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#ef4444", fontWeight: 700, marginTop: "8px", animation: "pulse 1s ease-in-out infinite" }}>
                  ⚠️ Betting closes soon!
                </div>
              </div> */}

              <RoundCountdown seconds={remaining}

              />


              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 700, marginBottom: "12px" }}>
                  💰 Wager Amount (USDT)
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    onClick={() => {
                      if (amount <= 0.1) {
                        toast.error("Cannot set below 0.1 HEXA")
                      } else {
                        setAmount(amount - 0.1)
                      }
                    }}
                    id="decreaseWagerBtn"
                    style={{ background: "#8b5cf6", color: "white", border: "none", padding: 0, borderRadius: "10px", cursor: "pointer", fontSize: "20px", fontWeight: 900, width: "44px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px #8b5cf660", flexShrink: 0 }}
                  >▼</button>

                  <input
                    type="number"
                    id="wagerInput"
                    min="0.05"
                    max="100"
                    value={(amount).toFixed(2)}
                    step="0.1"
                    placeholder="Enter amount"
                    style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "2px solid #8b5cf6", background: "#f8fafc", color: "#0f172a", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", fontWeight: 900, height: "52px", textAlign: "center", minWidth: 0 }}
                  />

                  <button
                    onClick={() => {
                      if (amount >= 100) {
                        toast.error("Cannot set above 100 HEXA")
                      } else {
                        setAmount(amount + 0.1)
                      }
                    }}
                    id="increaseWagerBtn"
                    style={{ background: "#8b5cf6", color: "white", border: "none", padding: 0, borderRadius: "10px", cursor: "pointer", fontSize: "20px", fontWeight: 900, width: "44px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px #8b5cf660", flexShrink: 0 }}
                  >▲</button>
                </div>


                <div id="hexaTokenDisplay" style={{ marginTop: "12px", textAlign: "center", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#06b6d4", fontWeight: 700 }}>
                  💎 Spend: <span id="hexaAmount">0.6</span> HEXA
                </div>
              </div>


              <div id="nftSlotsContainer" style={{ marginBottom: "16px", display: "block", width: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                <h3 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#0f172a", fontWeight: 700, marginBottom: "12px", textAlign: "center" }}>
                  🎰 Select Your Colour
                </h3>
                <div id="nftSlotsGrid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", width: "100%", boxSizing: "border-box", maxWidth: "100%" }}>
                  {colors.map((v, e) => {
                    if (e <= slot - 1) {
                      return (
                        <div style={{ width: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                          <div class="nft-slot" id="nft-slot-0" style={{ background: `${v}`, border: `4px solid ${v}`, borderRadius: "12px", padding: "8px", textAlign: "center", minHeight: "140px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box", overflow: "hidden", width: "100%", boxShadow: "0 6px 20px rgba(239, 68, 68, 0.5)", transition: "all 0.3s ease", position: "relative" }}>


                            <div style={{ width: "100%", overflow: "hidden", marginBottom: "8px" }}>
                              <div style={{ width: "100%", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#ffffff", fontSize: "14px", textShadow: "0 2px 4px rgba(0,0,0,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}>
                                {v}
                              </div>
                            </div>


                            <div style={{ width: "50px", height: "50px", background: "rgba(255,255,255,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px 0", border: "3px solid rgba(255,255,255,0.4)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                              <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#ffffff", fontWeight: 900, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                                {e + 1}
                              </div>
                            </div>


                            <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "8px", color: "#ffffff", fontWeight: 700, opacity: 0.9, marginTop: "4px", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
                              Click to select
                            </div>

                            <button
                              disabled={duration <= 10}
                              onClick={() => { handleClick(v) }}
                              class="select-slot-btn"
                              data-slot-index="0"
                              style={{ width: "100%", background: "rgba(255,255,255,0.3)", color: "#ffffff", border: "2px solid rgba(255,255,255,0.5)", padding: "8px", borderRadius: "8px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", fontWeight: 900, marginTop: "8px", transition: "all 0.2s", boxSizing: "border-box", textShadow: "0 1px 2px rgba(0,0,0,0.2)", backdropFilter: "blur(10px)" }}
                            >
                              ✓ Select Color
                            </button>
                          </div>
                        </div>
                      )
                    }

                  }

                  )}



                  {/* <div style={{ width: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                    <div class="nft-slot" id="nft-slot-1" style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "4px solid #047857", borderRadius: "12px", padding: "8px", textAlign: "center", minHeight: "140px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box", overflow: "hidden", width: "100%", boxShadow: "0 6px 20px rgba(16, 185, 129, 0.5)", transition: "all 0.3s ease", position: "relative" }}>


                      <div style={{ width: "100%", overflow: "hidden", marginBottom: "8px" }}>
                        <div style={{ width: "100%", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#ffffff", fontSize: "14px", textShadow: "0 2px 4px rgba(0,0,0,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}>
                          Green
                        </div>
                      </div>


                      <div style={{ width: "50px", height: "50px", background: "rgba(255,255,255,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px 0", border: "3px solid rgba(255,255,255,0.4)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#ffffff", fontWeight: 900, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                          2
                        </div>
                      </div>


                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "8px", color: "#ffffff", fontWeight: 700, opacity: 0.9, marginTop: "4px", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
                        Click to select
                      </div>

                      <button
                        class="select-slot-btn"
                        data-slot-index="1"
                        style={{ width: "100%", background: "rgba(255,255,255,0.3)", color: "#ffffff", border: "2px solid rgba(255,255,255,0.5)", padding: "8px", borderRadius: "8px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", fontWeight: 900, marginTop: "8px", transition: "all 0.2s", boxSizing: "border-box", textShadow: "0 1px 2px rgba(0,0,0,0.2)", backdropFilter: "blur(10px)" }}
                      >
                        ✓ Select Slot
                      </button>
                    </div>
                  </div> */}


                  {/* <div style={{ width: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                    <div class="nft-slot" id="nft-slot-2" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", border: "4px solid #6d28d9", borderRadius: "12px", padding: "8px", textAlign: "center", minHeight: "140px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box", overflow: "hidden", width: "100%", boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)", transition: "all 0.3s ease", position: "relative" }}>


                      <div style={{ width: "100%", overflow: "hidden", marginBottom: "8px" }}>
                        <div style={{ width: "100%", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#ffffff", fontSize: "14px", textShadow: "0 2px 4px rgba(0,0,0,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}>
                          Purple
                        </div>
                      </div>


                      <div style={{ width: "50px", height: "50px", background: "rgba(255,255,255,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px 0", border: "3px solid rgba(255,255,255,0.4)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#ffffff", fontWeight: 900, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                          3
                        </div>
                      </div>


                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "8px", color: "#ffffff", fontWeight: 700, opacity: 0.9, marginTop: "4px", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
                        Click to select
                      </div>

                      <button
                        class="select-slot-btn"
                        data-slot-index="2"
                        style={{ width: "100%", background: "rgba(255,255,255,0.3)", color: "#ffffff", border: "2px solid rgba(255,255,255,0.5)", padding: "8px", borderRadius: "8px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", fontWeight: 900, marginTop: "8px", transition: "all 0.2s", boxSizing: "border-box", textShadow: "0 1px 2px rgba(0,0,0,0.2)", backdropFilter: "blur(10px)" }}
                      >
                        ✓ Select Slot
                      </button>
                    </div>
                  </div> */}

                </div>
              </div>


              {/* <button
                onClick={handleClick}
                id="confirmPredictionBtn"
                style={{ display: "block", width: "100%", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", padding: "16px", borderRadius: "12px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "18px", fontWeight: 900, boxShadow: "0 6px 20px #10b98160", marginBottom: "16px" }}
              >
                🎯 Confirm & Start Game
              </button> */}

            </div>


            <div id="liveOrdersSection" style={{ background: "#ffffff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "24px", display: "none" }}>
              <h2 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                📊 Live Order
              </h2>
              <div id="liveOrderContent" style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "2px solid #8b5cf6" }}>

                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "2px solid #8b5cf6", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ width: "48px", height: "48px", background: "#ef4444", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", fontSize: "20px" }}>
                      1
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>Wager</div>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#0f172a", fontWeight: 900 }}>1.5 USDT</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "2px solid #ef444440" }}>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", opacity: 0.7, fontWeight: 700 }}>Duration:</div>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#0f172a", fontWeight: 900 }}>1 min</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", opacity: 0.7, fontWeight: 700 }}>Status:</div>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#f59e0b", fontWeight: 900 }}>⏳ In Progress</div>
                  </div>
                </div>
              </div>
            </div>


            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "24px" }}>
              <h2 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                📜 Prediction History
              </h2>
              <div id="predictionHistoryContent">

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ background: "#10b98120", padding: "12px 16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "4px solid #10b981" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", background: "#10b98140", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#10b981" }}>
                        2
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>
                          Prediction #1
                        </div>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                          2.5 USDT
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#10b981", fontWeight: 900 }}>
                        WON
                      </div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#10b981", fontWeight: 700 }}>
                        +5.0 USDT
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "#ef444420", padding: "12px 16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "4px solid #ef4444" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", background: "#ef444440", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#ef4444" }}>
                        1
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>
                          Prediction #2
                        </div>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                          1.0 USDT
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#ef4444", fontWeight: 900 }}>
                        LOST
                      </div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#ef4444", fontWeight: 700 }}>
                        -1.0 USDT
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "#10b98120", padding: "12px 16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "4px solid #10b981" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", background: "#10b98140", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#10b981" }}>
                        3
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>
                          Prediction #3
                        </div>
                        <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                          3.0 USDT
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#10b981", fontWeight: 900 }}>
                        WON
                      </div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#10b981", fontWeight: 700 }}>
                        +6.0 USDT
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>


        <div id="adminPage" class="min-h-full w-full p-4 md:p-8" style={{ background: "linear-gradient(135deg, #f8fafc, #e0e7ff)", display: "none" }}>
          <div class="max-w-7xl mx-auto">

            <div class="mb-8">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px", gap: "12px" }}>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <h1 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "32px", color: "#0f172a", fontWeight: 900, marginBottom: "8px", textShadow: "0 4px 20px #8b5cf6" }}>
                    🎨 NFT Collection
                  </h1>
                  <p style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", opacity: 0.8 }}>
                    Select NFTs to transfer to your gaming wallet
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "400px" }}>
                  <button
                    id="backToGameBtnTop"
                    style={{ flex: 1, background: "#ffffff", color: "#0f172a", border: "2px solid #8b5cf6", padding: "12px 16px", borderRadius: "12px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  >
                    ← Back
                  </button>
                  <button
                    id="toggleHistoryBtn"
                    style={{ flex: 1, background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "white", border: "none", padding: "12px 16px", borderRadius: "12px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 12px #06b6d460" }}
                  >
                    📜 History
                  </button>
                </div>
              </div>
            </div>


            <div id="nftGrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 160px), 1fr))", gap: "12px", paddingBottom: "40px" }}>

              <div class="nft-card" onclick="showTransferPopup('Cosmic Ape #001')" style={{ background: "#ffffff", borderRadius: "16px", padding: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.3)", border: "4px solid #fbbf2460", cursor: "pointer" }}>

                <div style={{ width: "100%", height: "100px", background: "linear-gradient(135deg, #f8fafc, #fbbf2430)", borderRadius: "12px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#fbbf24", fontSize: "24px" }}>
                  NFT
                </div>


                <div style={{ marginBottom: "8px" }}>
                  <h3 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", fontWeight: 900, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Cosmic Ape #001
                  </h3>

                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", color: "#fbbf24", fontWeight: 700, background: "#fbbf2420", padding: "2px 8px", borderRadius: "6px", display: "inline-block", marginBottom: "4px" }}>
                      ✨ Legendary
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 900 }}>
                        $53.50
                      </span>
                      <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#06b6d4", fontWeight: 900 }}>
                        💎5
                      </span>
                    </div>
                  </div>
                </div>


                <button
                  style={{ width: "100%", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", fontWeight: 700, transition: "all 0.2s", boxShadow: "0 4px 12px #8b5cf640" }}
                >
                  🔄 Transfer
                </button>
              </div>

              <div class="nft-card" onclick="showTransferPopup('Cyber Punk #042')" style={{ background: "#ffffff", borderRadius: "16px", padding: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.3)", border: "4px solid #a855f760", cursor: "pointer" }}>

                <div style={{ width: "100%", height: "100px", background: "linear-gradient(135deg, #f8fafc, #a855f730)", borderRadius: "12px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#a855f7", fontSize: "24px" }}>
                  NFT
                </div>


                <div style={{ marginBottom: "8px" }}>
                  <h3 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", fontWeight: 900, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Cyber Punk #042
                  </h3>

                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", color: "#a855f7", fontWeight: 700, background: "#a855f720", padding: "2px 8px", borderRadius: "6px", display: "inline-block", marginBottom: "4px" }}>
                      ✨ Epic
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 900 }}>
                        $75.04
                      </span>
                      <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#06b6d4", fontWeight: 900 }}>
                        💎3
                      </span>
                    </div>
                  </div>
                </div>


                <button
                  style={{ width: "100%", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", fontWeight: 700, transition: "all 0.2s", boxShadow: "0 4px 12px #8b5cf640" }}
                >
                  🔄 Transfer
                </button>
              </div>

              <div class="nft-card" onclick="showTransferPopup('Dragon Soul #123')" style={{ background: "#ffffff", borderRadius: "16px", padding: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.3)", border: "4px solid #3b82f660", cursor: "pointer" }}>

                <div style={{ width: "100%", height: "100px", background: "linear-gradient(135deg, #f8fafc, #3b82f630)", borderRadius: "12px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#3b82f6", fontSize: "24px" }}>
                  NFT
                </div>


                <div style={{ marginBottom: "8px" }}>
                  <h3 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", fontWeight: 900, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Dragon Soul #123
                  </h3>

                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", color: "#3b82f6", fontWeight: 700, background: "#3b82f620", padding: "2px 8px", borderRadius: "6px", display: "inline-block", marginBottom: "4px" }}>
                      ✨ Rare
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 900 }}>
                        $57.24
                      </span>
                      <span style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#06b6d4", fontWeight: 900 }}>
                        💎4
                      </span>
                    </div>
                  </div>
                </div>


                <button
                  style={{ width: "100%", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "10px", fontWeight: 700, transition: "all 0.2s", boxShadow: "0 4px 12px #8b5cf640" }}
                >
                  🔄 Transfer
                </button>
              </div>

            </div>
          </div>
        </div>


        <div id="hexaHistoryPage" class="min-h-full w-full p-4 md:p-8" style={{ background: "linear-gradient(135deg, #f8fafc, #ddd6fe)", display: "none" }}>
          <div class="max-w-6xl mx-auto">

            <div class="mb-8">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px", gap: "12px" }}>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <h1 style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "32px", color: "#0f172a", fontWeight: 900, marginBottom: "8px", textShadow: "0 4px 20px #8b5cf6" }}>
                    💎 HEXA Transfer History
                  </h1>
                  <p style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#0f172a", opacity: 0.8 }}>
                    Track all your HEXA token movements
                  </p>
                </div>
                <button
                  id="backToGameFromHexaBtn"
                  style={{ background: "#ffffff", color: "#0f172a", border: "2px solid #8b5cf6", padding: "12px 24px", borderRadius: "12px", cursor: "pointer", fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "14px", fontWeight: 700, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "300px" }}
                >
                  ← Back to Game
                </button>
              </div>
            </div>


            <div id="hexaHistoryContent" style={{ background: "#ffffff", padding: "24px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                <div style={{ background: "#10b98120", padding: "16px", borderRadius: "12px", border: "2px solid #10b98140", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", background: "#10b981", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", fontSize: "18px" }}>
                      ↗
                    </div>
                    <div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#0f172a", fontWeight: 700, marginBottom: "2px" }}>
                        NFT Transfer (Cosmic Ape)
                      </div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                        2024-01-15 10:30 AM
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#10b981", fontWeight: 900 }}>
                      +5 HEXA
                    </div>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#10b981", fontWeight: 700 }}>
                      IN
                    </div>
                  </div>
                </div>


                <div style={{ background: "#ef444420", padding: "16px", borderRadius: "12px", border: "2px solid #ef444440", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", background: "#ef4444", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", fontSize: "18px" }}>
                      ↘
                    </div>
                    <div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#0f172a", fontWeight: 700, marginBottom: "2px" }}>
                        Game Wager
                      </div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                        2024-01-15 11:00 AM
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#ef4444", fontWeight: 900 }}>
                      -2.5 HEXA
                    </div>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#ef4444", fontWeight: 700 }}>
                      OUT
                    </div>
                  </div>
                </div>


                <div style={{ background: "#10b98120", padding: "16px", borderRadius: "12px", border: "2px solid #10b98140", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", background: "#10b981", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white", fontSize: "18px" }}>
                      ↗
                    </div>
                    <div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#0f172a", fontWeight: 700, marginBottom: "2px" }}>
                        Game Win
                      </div>
                      <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                        2024-01-15 11:01 AM
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#10b981", fontWeight: 900 }}>
                      +5 HEXA
                    </div>
                    <div style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "12px", color: "#10b981", fontWeight: 700 }}>
                      IN
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DepositModal
        isOpen={showDeposit}
        onClose={() => setShowDeposit(false)}
        executeContract={executeContract}
        config={config}
        gameContract={gameContract}
        hexaBalance={hexaBalance}
        price={price}
      />
    </div>
  )
}
