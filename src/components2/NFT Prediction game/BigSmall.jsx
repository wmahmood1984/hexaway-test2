import React, { useState } from 'react'
import './BigSmall.css'
import RoundCountdown from './Countdown2'
import toast from 'react-hot-toast'
import { formatEther } from 'ethers'
import { formatAddress, secondsToDMY } from '../../utils/contractExecutor'
import DepositModal from './Modal'
import { gameContract } from '../../config'

export default function BigSmall({ config, allResults, depositHistory, onSuccess, colors, executeContract, hexaBalance, showDeposit, price, myBids, time, setShowDeposit, depositBalance, remaining, serverStatus, setTime, amount, setAmount, handleClick }) {
    const [page, setPage] = useState(1)
    const [showLive, setShowLive] = useState(false)
    const [showList, setShowList] = useState("my")
    const pageSize = 5;
    const totalPages = showList == "my" ? Math.ceil(myBids.length / pageSize) : Math.ceil(allResults.length / pageSize)
    const pending = myBids.filter(bid => !bid.settled)
    const reversed = [...myBids].reverse();

    const allResultsReversed = [...allResults].reverse();
    return (
        <div>
            <div class="game-wrapper">

                <div style={{ marginBottom: "12px", textAlign: "center" }}>
                    <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", color: "#1e293b" }}>
                        <span style={{ color: "#8b5cf6" }}>TOM </span>· JERRY
                    </h1>
                    <p style={{ color: "#0891b2", fontWeight: 600, fontSize: "12px" }}><i class="fas fa-bolt"></i> instant bid · 1.8x win</p>

                </div>


                <div class="deposit-wallet-row">
                    <button
                        onClick={() => setShowDeposit(true)}
                        id="depositBtn" class="deposit-btn">
                        <i class="fas fa-plus-circle"></i> Deposit
                    </button>
                    <div class="hexa-wallet">
                        <span class="hexa-label"><i class="fas fa-gem"></i> HEXA</span>
                        <span class="hexa-balance" id="walletHexaBalance">{depositBalance}</span>
                    </div>
                </div>


                <div class="light-card">

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
                        <div style={{ color: "#475569", fontWeight: 600, marginBottom: "8px" }}><i class="fas fa-coins"></i> wager</div>
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
                            <span style={{ color: "#64748b", fontSize: "13px" }}><i class="fas fa-gem" style={{ color: "#8b5cf6" }}></i> <span id="hexaAmount">{Number(amount / price).toFixed(0)}</span> HEXA</span>
                            <span style={{ color: "#8b5cf6", fontSize: "13px" }}>1.8x win</span>
                        </div>
                    </div>


                    <div>
                        <div
                            style={{ color: "#475569", fontWeight: 600, marginBottom: "8px" }}
                        >
                            <i className="fas fa-arrows-up-down"></i> type
                        </div>

                        <div className="slots-grid1">
                            <button
                                disabled={remaining <= 10}
                                onClick={() => handleClick("Red")}
                                className="big-slot"
                                id="big-slot"
                            >
                                <div className="slot-emoji"><img src="/2.png" alt="TOM" width="200" height="200" /></div>
                                <div className="slot-label">BIG</div>
                            </button>

                            <button
                                disabled={remaining <= 10}
                                onClick={() => handleClick("Green")}
                                className="small-slot"
                                id="small-slot"
                            >
                                <div className="slot-emoji"><img src="/1.png" alt="JERRY" width="150" height="150" /></div>
                                <div className="slot-label">SMALL</div>
                            </button>
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
                                    <div><div style={{ color: "#64748b", fontSize: "12px" }}>{bid.color === "0" ? "BIG" : "SMALL"}</div><div style={{ color: "#1e293b", fontSize: "20px", fontWeight: 800 }}>{Number(formatEther(bid.amount)).toFixed(2)} HEXA</div></div>
                                    <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ color: "#f97316" }}>⏳ {time} min</div><div style={{ color: "#64748b", fontSize: "12px" }}>in progress</div></div>
                                </div>
                            </div>)}

                </div>


                <div class="light-card" style={{ padding: "18px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h3 style={{ color: "#1e293b", fontSize: "18px", fontWeight: 800 }}><i className="fas fa-history" style={{ color: "#8b5cf6" }}></i> history</h3>
                        <div className="history-tabs">
                            <button
                                id="myHistoryTab" className={showList === "my" ? "tab-btn active" : "tab-btn"} onClick={() => setShowList("my")}>My</button>
                            <button id="gameHistoryTab" className={showList === "game" ? "tab-btn active" : "tab-btn"} onClick={() => setShowList("game")}>Game</button>
                                                    <button id="depositHistoryTab" className={showList === "deposit" ? "tab-btn active" : "tab-btn"} onClick={() => setShowList("deposit")}>Deposit</button>
                        </div>
                    </div>


                    <div id="myHistoryList" style={{ display: showList === "my" ? "block" : "none" }}>
                        <div class="history-header">
                            <span>SNo</span><span>Time</span><span>Type</span><span>Spent</span><span>Earn</span>
                        </div>

                        {reversed.map((bid, index) => {
                            const startIndex = (page - 1) * pageSize;
                            const endIndex = startIndex + pageSize;
                            if (index < startIndex || index >= endIndex) return null;
                            let result = bid.settled && bid.won ? "WON" : bid.settled && !bid.won ? "LOST" : "PENDING"
                            return (
                                <div className="history-row"><span>#{index + 1}</span>
                                    <span>{secondsToDMY(bid.time)}</span>
                                    <span style={{ color: bid.color === "Red" ? "#b91c1c" : bid.color === "Green" ? "#166534" : "#6b21a5" }}>
                                        {bid.color == 0 ? "BIG" : "SMALL"}</span>
                                    <span>{Number(formatEther(bid.amount)).toFixed(2)}</span><span className={result === "WON" ? "badge-win" : result === "LOST" ? "badge-loss" : ""}>{result === "WON" ? `+${Number(formatEther(bid.amount) * 1.8).toFixed(2)}` : result === "LOST" ? "0" : "-"}</span></div>
                            )
                        })}
                    </div>


                    <div id="gameHistoryList" style={{ display: showList === "game" ? "block" : "none" }}>
                        <div class="game-header"><span>SNo</span><span>Time</span><span>Result</span></div>
                        {allResults && allResultsReversed.map((result, index) => {

                            const startIndex = (page - 1) * pageSize;
                            const endIndex = startIndex + pageSize;
                            if (index < startIndex || index >= endIndex) return null;
                            return (
                                <div className="game-row"><span>#{index + 1}</span>
                                    <span>{secondsToDMY(result.future1)}</span>
                                    <span style={{ color: result.winningColor }}>{result.winningColor == 0 ? "BIG" : "SMALL"}
                                    </span></div>
                            )
                        })}
                    </div>


                    <div id="depositHistoryList" style={{ display: showList === "deposit" ? "block" : "none" }}>
                        <div className="history-header2"><span>SNo</span><span>Time</span><span>Amount</span>
                            <span>Sender</span><span>%</span><span>Status</span>
                        </div>
                        {depositHistory && depositHistory.map((deposit, index) => {
                            const startIndex = (page - 1) * pageSize;
                            const endIndex = startIndex + pageSize;
                            if (index < startIndex || index >= endIndex) return null;
                            return (

                                <div className="history-row2"><span>#{index + 1}</span>
                                    <span>{secondsToDMY(deposit.time)}</span>
                                    <span>{Number(formatEther(deposit.amount)).toFixed(2)}</span>
                                    <span>{formatAddress(deposit.depositor)}</span>
                                    <span>{deposit.percentage}</span>
                                    <span>{deposit.eventType == "0" ? "Deposit" :
                                    deposit.eventType == "1" ? "Bonus" : "R-Bonus" }</span>
                                </div>
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
                        <>
                            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
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

                            {totalPages > 5 && (
                                <div
                                    className={`page-dot ${page === totalPages ? "active-page" : ""}`}
                                    onClick={() => setPage(totalPages)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {totalPages}
                                </div>
                            )}
                        </>
                    </div>
                </div>
            </div>


            <DepositModal
                isOpen={showDeposit}
                onClose={() => {
                    setShowDeposit(false)

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
