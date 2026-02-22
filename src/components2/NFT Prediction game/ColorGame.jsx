import React, { useState } from 'react'
import './ColorGame.css'
import RoundCountdown from './Countdown2'
import toast from 'react-hot-toast'
import { formatEther } from 'ethers'
import { secondsToDMY } from '../../utils/contractExecutor'
import DepositModal from './Modal'
import { gameContract } from '../../config'


export default function ColorGame({colors,onSuccess,allResults, config, executeContract, hexaBalance, showDeposit, price, myBids, time, setShowDeposit, depositBalance, remaining, serverStatus, setTime, amount, setAmount, handleClick }) {
    const [page, setPage] = useState(1)
    const [showLive, setShowLive] = useState(false)
    const [showList, setShowList] = useState("my")
    const pageSize = 5;
    const totalPages = Math.ceil(myBids.length / pageSize);
    const pending = myBids.filter(bid => !bid.settled)

    return (
        <div>
            <div className="game-wrapper">

                <div style={{ marginBottom: "12px", textAlign: "center" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", color: "#1e293b" }}>
                        <span style={{ color: "#8b5cf6" }}>COLOUR</span> GAME
                    </h1>
                    <p style={{ color: "#0891b2", fontWeight: 600, fontSize: "12px" }}><i className="fas fa-bolt"></i> instant bid · 2x win</p>

                </div>


                <div className="deposit-wallet-row">
                    <button
                        onClick={() => setShowDeposit(true)}
                        id="depositBtn" className="deposit-btn">
                        <i className="fas fa-plus-circle"></i> Deposit
                    </button>
                    <div className="hexa-wallet">
                        <span className="hexa-label"><i className="fas fa-gem"></i> HEXA</span>
                        <span className="hexa-balance" id="walletHexaBalance">{depositBalance}</span>
                    </div>
                </div>


                <div className="light-card">

                    <RoundCountdown seconds={remaining} serverStatus={serverStatus} />


                    <div className="time-selector">
                        <button
                            onClick={() => { setTime(1) }}
                            id="time60Btn" className={time == 1 ? "time-option active" : "time-option"}>1 min</button>
                        <button
                            onClick={() => { setTime(3) }}
                            id="time180Btn" className={time == 3 ? "time-option active" : "time-option"}>3 min</button>
                    </div>


                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ color: "#475569", fontWeight: 600, marginBottom: "8px" }}><i className="fas fa-coins"></i> wager</div>
                        <div className="wager-control">
                            <button
                                onClick={() => {
                                    if (amount <= 0.1) {
                                        toast.error("Cannot set below 0.1 HEXA")
                                    } else {
                                        setAmount(amount - 0.1)
                                    }
                                }}

                                id="decreaseWagerBtn" className="wager-btn">−</button>
                            <input type="number" id="wagerInput"

                                onChange={(e) => { setAmount(e.target.value) }}
                                value={Number(amount).toFixed(2)}


                                step="0.1" min="0.1" max="100" className="wager-input" />
                            <button

                                onClick={() => {
                                    if (amount >= 100) {
                                        toast.error("Cannot set above 100 HEXA")
                                    } else {
                                        setAmount(amount + 0.1)
                                    }
                                }}
                                id="increaseWagerBtn" className="wager-btn">+</button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", padding: "0 8px" }}>
                            <span style={{ color: "#64748b", fontSize: "13px" }}><i className="fas fa-gem" style={{ color: "#8b5cf6" }}></i> <span id="hexaAmount">{Number(amount / price).toFixed(0)}</span> HEXA</span>
                            <span style={{ color: "#8b5cf6", fontSize: "13px" }}>2x win</span>
                        </div>
                    </div>


                    <div>
                        <div style={{ color: "#475569", fontWeight: 600, marginBottom: "8px" }}><i className="fas fa-palette"></i> tap colour</div>
                        <div className="slots-grid">
                            <div
                                disabled={remaining <= 10}
                                onClick={() => { handleClick("Red") }}
                                className="color-slot slot-red" id="nft-slot-0">
                                <div className="slot-emoji">🔴</div>
                                <div className="slot-label">RED</div>
                                <div className="slot-number">1</div>
                            </div>
                            <div
                                disabled={remaining <= 10}
                                onClick={() => { handleClick("Green") }}
                                className="color-slot slot-green" id="nft-slot-1">
                                <div className="slot-emoji">🟢</div>
                                <div className="slot-label">GREEN</div>
                                <div className="slot-number">2</div>
                            </div>
                            <div disabled={remaining <= 10}
                                onClick={() => { handleClick("Purple") }}
                                className="color-slot slot-purple" id="nft-slot-2">
                                <div className="slot-emoji">🟣</div>
                                <div className="slot-label">PURPLE</div>
                                <div className="slot-number">3</div>
                            </div>
                        </div>
                    </div>
                </div>


                <div style={{ display: "flex", justifyContent: "flex-end", margin: "6px 0 8px" }}>
                    <button
                        onClick={() => setShowLive(!showLive)}
                        id="toggleLiveOrderBtn" style={{ background: "#f97316", color: "white", border: "none", padding: "10px 22px", borderRadius: "40px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 5px 0 #c2410c" }}>
                        <i className="fas fa-chart-line"></i> Live order
                    </button>
                </div>


                <div id="liveOrdersSection" style={{ display: showLive ? "block" : "none", marginBottom: "16px" }}>
                    {pending.length > 0 &&
                        pending.map((bid, index) =>
                            <div className="light-card" style={{ padding: "16px" }}>
                                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <div style={{ width: "48px", height: "48px", background: "#fee2e2", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "#991b1b" }}>1</div>
                                    <div><div style={{ color: "#64748b", fontSize: "12px" }}>wager</div><div style={{ color: "#1e293b", fontSize: "20px", fontWeight: 800 }}>{formatEther(bid.amount)} HEXA</div></div>
                                    <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ color: "#f97316" }}>⏳ {time} min</div><div style={{ color: "#64748b", fontSize: "12px" }}>in progress</div></div>
                                </div>
                            </div>)}

                </div>


                <div className="light-card" style={{ padding: "18px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h3 style={{ color: "#1e293b", fontSize: "18px", fontWeight: 800 }}><i className="fas fa-history" style={{ color: "#8b5cf6" }}></i> history</h3>
                        <div className="history-tabs">
                            <button
                            onClick={()=>{setShowList("my")}}
                            id="myHistoryTab" className="tab-btn active">My</button>
                            <button onClick={()=>{setShowList("game")}} id="gameHistoryTab" className="tab-btn">Game</button>
                        </div>
                    </div>


                    <div id="myHistoryList" style={{ display: showList === "my" ? "block" : "none" }}>
                        <div className="history-header">
                            <span>SNo</span><span>Time</span><span>Colour</span><span>Spent</span><span>Earn</span>
                        </div>
                        {myBids.map((bid, index) => {
                            const startIndex = (page - 1) * pageSize;
                            const endIndex = startIndex + pageSize;
                            if (index < startIndex || index >= endIndex) return null;
                            let result = bid.settled && bid.won ? "WON" : bid.settled && !bid.won ? "LOST" : "PENDING"
                            return (
                                <div className="history-row"><span>#{index + 1}</span>
                                    <span>{secondsToDMY(bid.time)}</span>
                                    <span style={{ color: bid.color }}>
                                        {colors[bid.color]} </span>
                                        <span>{formatEther(bid.amount)}</span><span className={result === "WON" ? "badge-win" : result === "LOST" ? "badge-loss" : ""}>{result === "WON" ? `+${formatEther(bid.amount) * 2}` : result === "LOST" ? "0" : "-"}</span></div>
                            )
                        })}
                    </div>


                    <div id="gameHistoryList" style={{ display: showList === "game" ? "block" : "none" }}>
                        <div className="game-header"><span>SNo</span><span>Time</span><span>Colour</span></div>
                            {allResults && allResults.map((result, index) => {
                                return (
                                    <div className="game-row"><span>#{index + 1}</span>
                                    <span>{secondsToDMY(result.time)}</span>
                                    <span style={{ color: result.color }}>{colors[result.color]}
                                    </span></div>
                                )
                            })}
                    </div>


                    <div
                        id="paginationContainer"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "6px",
                            marginTop: "16px",
                        }}
                    >
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <div
                                    key={pageNumber}
                                    className={`page-dot ${page === pageNumber ? "active-page" : ""}`}
                                    onClick={() => setPage(pageNumber)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {pageNumber}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>


            <DepositModal
                isOpen={showDeposit}
                onClose={() => {
                    setShowDeposit(false)
                    abc()
                }}
                onSuccess={onSuccess}
                executeContract={executeContract}
                config={config}
                gameContract={gameContract}
                hexaBalance={hexaBalance}
                price={price}
            />
        </div>
    )
}
