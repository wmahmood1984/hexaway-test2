import React, { useState } from 'react'
import History from './History';
import { rewardTypeKeys } from '../../config';
import { secondsToDHMSDiff, secondsToDMY, tn } from '../../utils/contractExecutor';

export default function Stake(
    {
        textShadow,

        setActiveTab,
        activeTab, days, earn, border, color,
        background,
        price,
        totalStaked,
        totalEarned,
        hexaBalance,
        usdtBalance,
        ticket, onClick,
        clickClaim,stakeDone,stakeDoneTime
    }
) {

    const buttonConfig = {
        10: {
            id: "stake10Btn",
            gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
            shadow: "0 8px 20px rgba(245,158,11,0.4)"
        },
        20: {
            id: "stake20Btn",
            gradient: "linear-gradient(135deg,#10b981,#059669)",
            shadow: "0 8px 20px rgba(16,185,129,0.4)"
        },
        30: {
            id: "stake30Btn",
            gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
            shadow: "0 8px 20px rgba(139,92,246,0.4)"
        }
    };


    const config = buttonConfig[days] || buttonConfig[30];
    const [tab, setTab] = useState("history")
    const now = new Date().getTime()/1000
    const stakeDoneRevised = now>stakeDoneTime+(60*60*24) ?15 :  15-Number(stakeDone)

    console.log("object", { stakeDone })

    return (
        <div>
            <div id="app" class="h-full w-full overflow-auto">
                <div class="min-h-full w-full p-4 md:p-8">
                    <div class="max-w-6xl mx-auto">


                        <div class="mb-6 md:mb-8 text-center">
                            <h1 style={{ fontSize: "clamp(24px,5vw,32px)", color: "#0f172a", fontWeight: 900, marginBottom: "6px", textShadow }}>
                                HEXA Grow Fund · {days} Days
                            </h1>
                            <p style={{ fontSize: "clamp(14px,3vw,16px)", color: "#0f172a", opacity: 0.8 }}>
                                Stake 1000 HEXA · earn {earn} HEXA · 15 slots
                            </p>

                            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px", flexWrap: "wrap" }}>
                                <a ><button
                                    onClick={() => { setActiveTab("1") }}
                                    style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px,3vw,16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(245,158,11,0.4)", minWidth: "140px" }}>10 Days Plan</button></a>
                                <a ><button
                                    onClick={() => { setActiveTab("2") }}
                                    style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px,3vw,16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(16,185,129,0.4)", minWidth: "140px" }}>20 Days Plan</button></a>
                                <a ><button
                                    onClick={() => { setActiveTab("3") }}
                                    style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px,3vw,16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(139,92,246,0.4)", minWidth: "140px" }}>30 Days Plan</button></a>
                            </div>

                            <div style={{ marginTop: "12px" }}>
                                <span style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "white", padding: "6px 24px", borderRadius: "40px", fontWeight: 700, display: "inline-block" }}>{days} Days Plan · 1000 HEXA</span>
                            </div>
                        </div>


                        <div style={{ background, padding: "16px", borderRadius: "20px", marginBottom: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", border }}>
                            <div style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between", gap: "16px", flexDirection: "column" }}>
                                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
                                    <div style={{ fontSize: "clamp(12px,3vw,14px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>Today Grow Board</div>
                                    <div id="todayStakeBoard" style={{ fontSize: "clamp(48px,15vw,96px)", color, fontWeight: 900, lineHeight: 1 }}>{stakeDoneRevised}</div>
                                    <div style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#0f172a", opacity: 0.6, marginTop: "6px", fontWeight: 500 }}>Pending Slots (20D)</div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }} class="mobile-responsive-flex">
                                    <div style={{ flex: 1, minWidth: "140px" }}>
                                        <div style={{ fontSize: "clamp(11px,2.5vw,12px)", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>📊 HEXA Live Price</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <div id="liveHexaPrice" style={{ fontSize: "clamp(16px,4vw,24px)", color: "#0f172a", fontWeight: 900 }}>${price}</div>
                                            <div id="priceChangeIndicator" style={{ fontSize: "clamp(14px,3.5vw,20px)", fontWeight: 900 }}>→</div>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: "140px", textAlign: "right" }}>
                                        <div style={{ fontSize: "clamp(11px,2.5vw,12px)", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>💼 wallet balance</div>
                                        <div id="walletBalanceDisplay" style={{ fontSize: "clamp(16px,4vw,24px)", color, fontWeight: 900 }}>{hexaBalance} HEXA</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "12px", marginBottom: "20px" }} class="mobile-responsive-grid">
                            <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(16,185,129,0.4)" }}>
                                <div style={{ fontSize: "clamp(11px,2.5vw,12px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>🔒 Total Staked</div>
                                <div id="totalStakedDisplay" style={{ fontSize: "clamp(16px,4vw,24px)", color, fontWeight: 900 }}>{totalStaked} HEXA</div>
                            </div>
                            <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(6,182,212,0.4)" }}>
                                <div style={{ fontSize: "clamp(11px,2.5vw,12px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>💰 Total Earned</div>
                                <div id="totalEarnedDisplay" style={{ fontSize: "clamp(16px,4vw,24px)", color: "#06b6d4", fontWeight: 900 }}>{totalEarned} HEXA</div>
                            </div>
                            <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(139,92,246,0.4)" }}>
                                <div style={{ fontSize: "clamp(11px,2.5vw,12px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>💵 Wallet (USDT)</div>
                                <div id="walletBalanceUsdt" style={{ fontSize: "clamp(16px,4vw,24px)", color: "#8b5cf6", fontWeight: 900 }}>${usdtBalance}</div>
                            </div>
                        </div>


                        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginBottom: "16px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
                            <h2 style={{ fontSize: "clamp(18px,4vw,20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>🌱 {days} Days Grow</h2>
                            <div class="stake-card" style={{ background, padding: "20px", borderRadius: "16px", border }}>
                                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                                        <img width="200" src="image.png" alt="Hexa Coin" style={{ maxWidth: "100%", height: "auto" }} class="mobile-responsive-image" />
                                    </div>
                                    <h3 style={{ fontSize: "clamp(18px,4vw,22px)", color: "#0f172a", fontWeight: 900, marginBottom: "6px" }}>HEXA · {days}D</h3>
                                    <div style={{ fontSize: "clamp(18px,4vw,26px)", color, fontWeight: 900, marginBottom: "4px" }}>1000 HEXA</div>
                                </div>
                                <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}><span style={{ fontSize: "clamp(12px,2.5vw,14px)", color: "#0f172a", opacity: 0.7 }}>Stake:</span><span style={{ fontSize: "clamp(14px,3vw,16px)", color: "#0f172a", fontWeight: 700 }}>1000 HEXA</span></div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}><span style={{ fontSize: "clamp(12px,2.5vw,14px)", color: "#0f172a", opacity: 0.7 }}>Duration:</span><span style={{ fontSize: "clamp(14px,3vw,16px)", color: "#0f172a", fontWeight: 700 }}>{days} Days</span></div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "clamp(12px,2.5vw,14px)", color: "#0f172a", opacity: 0.7 }}>Est. Reward:</span><span style={{ fontSize: "clamp(16px,3.5vw,18px)", color: "#10b981", fontWeight: 900 }}>+{earn} HEXA</span></div>
                                </div>
                                <button
                                    onClick={onClick}
                                    id={config.id}
                                    style={{
                                        width: "100%",
                                        background: config.gradient,
                                        color: "white",
                                        border: "none",
                                        padding: "16px",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "clamp(16px,3.5vw,18px)",
                                        fontWeight: 700,
                                        boxShadow: config.shadow
                                    }}
                                >
                                    Grow Now ({days}D)
                                </button>
                            </div>
                        </div>


                        <div style={{ textAlign: "center", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "24px" }}>
                            <button
                                onClick={() => { setTab("history") }}
                                id="viewHistoryBtn" style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px,3vw,16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(139,92,246,0.4)", minWidth: "180px" }}>View Grow History</button>
                            {/* <button
                                onClick={() => { setTab("reward") }}
                                id="viewRewardsBtn" style={{ background: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px,3vw,16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(6,182,212,0.4)", minWidth: "180px" }}>Grow Reward</button> */}
                        </div>


                        {tab == "history" ? <div id="stakingHistory" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px" }}>
                            <h2 style={{ fontSize: "clamp(18px,4vw,20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>Your Staking History ({days}D)</h2>
                            <div id="historyContent">
                                {ticket.length == 0 ?
                                    <div style={{ textAlign: "center", padding: "24px", opacity: "0.6" }}>No history.</div>
                                    :
                                    [...ticket].reverse().map((v, e) => {
                                        const duration =
                                            v.stakeType === "1" ? 10 :
                                                v.stakeType === "2" ? 20 :
                                                    30;

                                        // current time in seconds (integer)
                                        const now = Math.floor(Date.now() / 1000);

                                        // stake start time (ensure integer)
                                        const startTime = Number(v.time);

                                        // stake end time
                                        const endTime = startTime + duration * 60;

                                        // remaining time
                                        const timeRemaining = Math.max(endTime - now, 0);

                                        console.log("time", {
                                            timeRemaining,
                                            startTime,
                                            endTime,
                                            now,
                                            duration,v
                                        });

                                        return (
                                            <History
                                                plan={rewardTypeKeys[v.stakeType]}
                                                duration={rewardTypeKeys[v.stakeType]}
                                                amount={tn(v.amount)}
                                                statusText={timeRemaining>0? "Active": timeRemaining==0 && !v.amountClaimed ? "Completed" : "Claimed"}
                                                timeRemaining={secondsToDHMSDiff(timeRemaining)}
                                                timestamp={secondsToDMY(v.time)}
                                                clickClaim={clickClaim}
                                                id={v.id}


                                                statusColor={timeRemaining>0  || timeRemaining==0 && !v.amountClaimed ?'#10b981' : '#6b7280'}
                                            />
                                        )
                                    })

                                }



                            </div>
                        </div>

                            :
                            <div id="stakingRewards" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px" }}>
                                <h2 style={{ fontSize: "clamp(18px,4vw,20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>💰 20D Earnings History</h2>
                                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                    <button id="claimRewardsBtn" style={{ background: "linear-gradient(135deg,#10b981,#059669)", color: "white", border: "none", padding: "16px 32px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(16px,3.5vw,18px)", fontWeight: 900, boxShadow: "0 8px 20px rgba(16,185,129,0.4)", minWidth: "240px", marginBottom: "8px" }}>🎁 Claim All Rewards</button>
                                    <div id="claimableAmount" style={{ fontSize: "clamp(14px,3vw,16px)", color: "#0f172a", opacity: 0.8 }}>Available to claim: <span style={{ color: "#10b981", fontWeight: 700 }}>0 HEXA</span></div>
                                </div>
                                <div id="rewardsContent"></div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
