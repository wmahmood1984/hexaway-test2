import { AbiCoder, formatEther, parseEther } from 'ethers'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { gameAbi, gameAdd, gameContract, gameFetcherContractR, HexaContract, HEXAContractR, priceOracleContractR, rpc1 } from '../../config'
import { useAppKitAccount } from '@reown/appkit/react'
import { useConfig, useShowCallsStatus } from 'wagmi'
import { executeContract } from '../../utils/contractExecutor'
import ColorGame from './ColorGame'
import BigSmall from './BigSmall'
import ResultModal from './ResultModal'
import Web3 from 'web3'

const colors = ['Red', 'Green', 'Purple', "black", "yellow", "blue", "pink", "grey", "orange"]

export default function Game() {
  const config = useConfig()
  const { address } = useAppKitAccount();
  const [slot, setSlots] = useState(3)
  const [time, setTime] = useState(1)
  const [serverStatus, setServerStatus] = useState(true)
  const [amount, setAmount] = useState("0.1")
  const [hexaBalance, setHexaBalance] = useState(0)
  const [price, setPrice] = useState(0.01)
  const [Spent, setSpent] = useState(0)
  const [Won, setWon] = useState(0)
  const [depositBalance, setDepositBalance] = useState(0)
  const [showDeposit, setShowDeposit] = useState(false);
  const ROUND_BUFFER = 1; // safety buffer
  const [allResults, setAllResults] = useState()
  const [gameRan, setGameRan] = useState(0);
  const [myBids, setMyBids] = useState();
  const [remaining, setRemaining] = useState(0);
  const [predictionHistory, setPredictionHistory] = useState()
  const [loading, setLoading] = useState(false)
  const [depositHistory, setDepositHistory] = useState([])

  const [activeTab, setActiveTab] = useState("bigsmall");
  const [showResultModal, setShowResultModal] = useState({
    show: false,
    result: { resultEmoji: "", resultText: "", resultColor: "", selectedType: "", wagerVal: 0, payout: 0, won: false }
  })

  const findGame = (slots, time) => {
    switch (true) {
      case activeTab === "color" && slots === 3 && time === 1: return 0;
      case activeTab === "color" && slots === 3 && time === 3: return 1;
      case activeTab === "color" && slots === 3 && time === 5: return 2;
      case activeTab === "color" && slots === 3 && time === 10: return 3;

      case activeTab === "color" && slots === 6 && time === 1: return 4;
      case activeTab === "color" && slots === 6 && time === 3: return 5;
      case activeTab === "color" && slots === 6 && time === 5: return 6;
      case activeTab === "color" && slots === 6 && time === 10: return 7;

      case activeTab === "color" && slots === 9 && time === 1: return 8;
      case activeTab === "color" && slots === 9 && time === 3: return 9;
      case activeTab === "color" && slots === 9 && time === 5: return 10;
      case activeTab === "color" && slots === 9 && time === 10: return 11;

      case activeTab === "bigsmall" && slots === 3 && time === 1: return 12;
      case activeTab === "bigsmall" && slots === 3 && time === 3: return 13;

      default:
        throw new Error("Invalid slots or time combination");
    }
  };


  const newWeb3 = new Web3(new Web3.providers.HttpProvider(rpc1))
  const gameContractR = new newWeb3.eth.Contract(gameAbi, gameAdd)


  const countdownAudioRef = useRef(null);

  useEffect(() => {
    countdownAudioRef.current = new Audio("/sound.mp3");
    countdownAudioRef.current.loop = true; // if you want continuous sound

    return () => {
      countdownAudioRef.current?.pause();
    };
  }, []);



  useEffect(() => {
    abc()
  }, [address])


  const fetchGameRan = useCallback(async () => {
    const gameAddr = findGame(slot, time);

    const ran = await gameContractR.methods.gameRan(gameAddr).call();
    setGameRan(Number(ran));

    // 🔁 Reset winner check for new round

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


      if(diff>0){
      setRemaining(diff);
      }


      // 🔊 Start sound at 10 seconds
      if (diff === 10) {
        const audio = countdownAudioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {
            console.log("Autoplay blocked until user interaction");
          });
        }
      }

      // 🔇 Stop sound at 0
      if (diff === 0) {
        const audio = countdownAudioRef.current;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }

        fetchGameRan();
        abc();
        checkHealth();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameRan, time, fetchGameRan]);


  const checkHealth = async () => {
    try {
      const response = await fetch(
        "https://api.hexaway.org/health"
        //"http://localhost:4000/health"  
      );
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      // Validate status
      const isStatusOk = data.status === "ok";

      // Validate all health checks are true
      const allHealthy =
        data.healthy &&
        Object.values(data.healthy).every(value => value === true);

      if (isStatusOk && allHealthy) {
        setServerStatus(true);
        checkWinner();
      } else {
        setServerStatus(false);
        //    console.warn("Server unhealthy:", data.healthy);
      }

    } catch (err) {
      console.error("Health check failed:", err);
      setServerStatus(false);
    }
  };



  //console.log("addres",address)

  const checkWinner = async () => {

    const gameId = findGame(slot, time);

    try {
      // if (!address || !gameId) return { won: false };

      // Fetch winners list from contract
      const _result = await gameFetcherContractR.methods
        .getUserWinningAmount(gameId, address)
        .call();



      if (!_result[1]) {
        setShowResultModal({
          show: true,
          result: { resultEmoji: '😞', resultText: "You Have Missed it!", resultColor: '#dc2626', selectedType: "Nothing", wagerVal: 0, payout: 0, won: false }
        });
      } else if (_result[1] && _result[4] === "2") {
        setShowResultModal({
          show: true,
          result: { resultEmoji: '😞', resultText: "YOU LOST", resultColor: '#dc2626', selectedType: _result[2], wagerVal: formatEther(_result[3]), payout: 0, won: false }
        });
      }else if (_result[1] && _result[4]=="1") {
        const amountWei = _result[0].toString() // Convert to string if it's a BigNumber;
        const amountHexa = formatEther(amountWei.toString());

        setShowResultModal({
          show: true,
          result: { resultEmoji: '🎉', resultText: "YOU WON", resultColor: '#10b981', selectedType: _result[2], wagerVal: formatEther(_result[3]), payout: amountHexa, won: true }
        });


        // return {
        //   won: true,
        //   amount: amountHexa,
        // };
      } else if(_result[1] && _result[4]=="3") {
        setShowResultModal({
          show: true,
          result: { resultEmoji: '🪙', resultText: "YOU WERE ONLY IN THE GAME, WE REFUNDED YOUR MONEY BACK", resultColor: '#10b981', selectedType: _result[2], wagerVal: formatEther(_result[3]), payout: formatEther(_result[3]), won: false }
        });
      }

      return { won: false };

    } catch (error) {
      console.error("Winner check failed:", error);
      return { won: false };
    }
  };




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
    const _myBids = await gameFetcherContractR.methods.getBidsByUser(address).call()
    setMyBids(_myBids)

    const _allResults = await gameContractR.methods.getGameResult().call()
    setAllResults(_allResults)

    const _depositHistory = await gameContractR.methods.getUserDepositArray(address).call()
    setDepositHistory(_depositHistory)

    const gameresult = await gameContractR.methods.getBids().call()
    
  }




  const handleClick = async (v) => {

    if (
      Number(depositBalance) < amount
    ) {
      toast.error("Insufficient Deposit Balance")
      return
    }

    let gameAddr = findGame(slot, time);

    const value = amount / price;
        console.log("object", {value,contract:gameContract.address,gameAddr})
    await executeContract({
      config,
      functionName: "placeBid",
      args: [gameAddr, parseEther(value.toString()), colors.indexOf(v)],
      onSuccess: (txHash, receipt) => {
        console.log("🎉 Tx Hash:", txHash);
        console.log("🚀 Tx Receipt:", receipt);
        toast.success("Bid done successfully")
        abc()
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



  const isLoading = !myBids || !allResults;
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

  //   console.log("prediction", { allResults })

  return (
    <div>
      <div>
        <div className="flex gap-4 mb-6">

          <button
            onClick={() => setActiveTab("color")}
            className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "color"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            Color
          </button>

          <button
            onClick={() => setActiveTab("bigsmall")}
            className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "bigsmall"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            Tom & Jerry
          </button>





        </div>

        {activeTab === "color" && <ColorGame
          setShowDeposit={setShowDeposit}
          allResults={allResults}
          showDeposit={showDeposit}
          colors={colors}
          depositBalance={depositBalance}
          remaining={duration}
          serverStatus={serverStatus}
          setTime={setTime}
          time={time}
          amount={amount}
          executeContract={executeContract}
          setAmount={setAmount}
          handleClick={handleClick}
          myBids={myBids}
          price={price}
          config={config}
          onSuccess={abc}
          depositHistory={depositHistory}

          hexaBalance={hexaBalance}
        />}
        {activeTab === "bigsmall" && <BigSmall
          setShowDeposit={setShowDeposit}
          allResults={allResults}
          depositHistory={depositHistory}
          depositBalance={depositBalance}
          remaining={duration}
          colors={colors}
          onSuccess={abc}
          serverStatus={serverStatus}
          setTime={setTime}
          amount={amount}
          executeContract={executeContract}
          showDeposit={showDeposit}
          setAmount={setAmount}
          handleClick={handleClick}
          price={price}
          myBids={myBids}
          time={time}
          hexaBalance={hexaBalance}
          config={config}

        />}



        {/* <div id="adminPage" class="min-h-full w-full p-4 md:p-8" style={{ background: "linear-gradient(135deg, #f8fafc, #e0e7ff)", display: "none" }}>
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
        </div> */}


        {/* <div id="hexaHistoryPage" class="min-h-full w-full p-4 md:p-8" style={{ background: "linear-gradient(135deg, #f8fafc, #ddd6fe)", display: "none" }}>
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
        </div> */}
      </div>
      <ResultModal
        show={showResultModal.show}
        result={showResultModal.result}
        activeTab={activeTab}
        colors={colors}
        onClose={() =>
          setShowResultModal({
            show: false,
            result: { resultEmoji: "", resultText: "", resultColor: "", selectedType: "", wagerVal: 0, payout: 0, won: false }
          })
        }
      />

    </div>
  )
}
