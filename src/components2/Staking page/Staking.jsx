import React from 'react'

export default function Staking() {
    return (
        <div>

            <div id="app" class="h-full w-full overflow-auto">

                <div class="min-h-full w-full p-4 md:p-8">
                    <div class="max-w-6xl mx-auto">


                        <div class="mb-6 md:mb-8 text-center">
                            <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", color: "#0f172a", fontWeight: 900, marginBottom: "6px", textShadow: "0 4px 20px #8b5cf6" }}>
                                HEXA Staking Platform
                            </h1>
                            <p style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#0f172a", opacity: 0.8 }}>
                                Earn passive rewards by staking your HEXA Coins
                            </p>
                        </div>


                        <div style={{ background: "linear-gradient(135deg, #ffffff, rgba(6, 182, 212, 0.3))", padding: "16px", borderRadius: "20px", marginBottom: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", border: "3px solid #06b6d4" }}>

                            <div style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between", gap: "16px", flexDirection: "column" }}>


                                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
                                    <div style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>
                                        Today Stake Board
                                    </div>
                                    <div id="todayStakeBoard" style={{ fontSize: "clamp(48px, 15vw, 96px)", color: "#8b5cf6", fontWeight: 900, lineHeight: 1 }}>
                                        10
                                    </div>
                                    <div style={{ fontSize: "clamp(10px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.6, marginTop: "6px", fontWeight: 500 }}>
                                        Pending Stakers
                                    </div>
                                </div>


                                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }} class="mobile-responsive-flex">
                                    <div style={{ flex: 1, minWidth: "140px" }}>
                                        <div style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>
                                            📊 HEXA Live Price
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <div id="liveHexaPrice" style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#0f172a", fontWeight: 900 }}>
                                                $6500.00
                                            </div>
                                            <div id="priceChangeIndicator" style={{ fontSize: "clamp(14px, 3.5vw, 20px)", fontWeight: 900 }}>
                                                →
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ flex: 1, minWidth: "140px", textAlign: "right" }}>
                                        <div style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7, marginBottom: "4px", fontWeight: 600 }}>
                                            💼 wallet balance
                                        </div>
                                        <div id="walletBalanceDisplay" style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#8b5cf6", fontWeight: 900 }}>
                                            6000.00 HEXA
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "20px" }} class="mobile-responsive-grid tablet-responsive-grid">
                            <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(139, 92, 246, 0.4)" }}>
                                <div style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>
                                    🔒 Total Staked
                                </div>
                                <div id="totalStakedDisplay" style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#8b5cf6", fontWeight: 900 }}>
                                    0.00 HEXA
                                </div>
                            </div>

                            <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(6, 182, 212, 0.4)" }}>
                                <div style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>
                                    💰 Total Earned
                                </div>
                                <div id="totalEarnedDisplay" style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#06b6d4", fontWeight: 900 }}>
                                    0.00 HEXA
                                </div>
                            </div>

                            <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(16, 185, 129, 0.4)" }}>
                                <div style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>
                                    💵 Wallet Balance in (USDT)
                                </div>
                                <div id="walletBalanceUsdt" style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#10b981", fontWeight: 900 }}>
                                    $39000000.00
                                </div>
                            </div>
                        </div>


                        <div style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginBottom: "16px" }}>
                            <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                                🎯 Staking
                            </h2>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", maxWidth: "600px", margin: "0 auto" }}>
                                <div class="stake-card" style={{ background: "linear-gradient(135deg, #f8fafc, rgba(139, 92, 246, 0.2))", padding: "20px", borderRadius: "16px", border: "3px solid rgba(139, 92, 246, 0.4)" }}>

                                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                                            <img width="200" src="image.png" alt="Hexa Coin" style={{ maxWidth: "100%", height: "auto" }} class="mobile-responsive-image" />
                                        </div>

                                        <h3 style={{ fontSize: "clamp(16px, 3.5vw, 18px)", color: "#0f172a", fontWeight: 900, marginBottom: "6px" }}>
                                            HEXA
                                        </h3>
                                        <div style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#8b5cf6", fontWeight: 900, marginBottom: "4px" }}>
                                            Staking
                                        </div>
                                        <div style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#8b5cf6", fontWeight: 900, marginBottom: "4px" }}>
                                            $50 (USDT)
                                        </div>
                                    </div>

                                    <div style={{ background: "#ffffff", padding: "12px", borderRadius: "12px", marginBottom: "16px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7 }}>Stake:</span>
                                            <span style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#0f172a", fontWeight: 700 }}>5000 HEXA</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7 }}>Duration:</span>
                                            <span style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#0f172a", fontWeight: 700 }}>150 Days</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7 }}>Est. Reward:</span>
                                            <span style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#06b6d4", fontWeight: 900 }}>+2500 HEXA</span>
                                        </div>
                                    </div>

                                    <button id="stakeNowBtn" style={{ width: "100%", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "14px", borderRadius: "10px", cursor: "pointer", fontSize: "clamp(14px, 3.5vw, 16px)", fontWeight: 700, boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)" }}>
                                        Stake Now
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div style={{ textAlign: "center", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                            <button id="viewHistoryBtn" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(139, 92, 246, 0.4)", minWidth: "180px" }}>
                                View Staking History
                            </button>
                            <button id="viewRewardsBtn" style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(6, 182, 212, 0.4)", minWidth: "180px" }}>
                                Staking Reward
                            </button>
                        </div>


                        <div id="stakingHistory" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px", display: "none" }}>
                            <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                                Your Staking History
                            </h2>
                            <div id="historyContent">

                            </div>
                        </div>


                        <div id="stakingRewards" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px", display: "none" }}>
                            <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                                💰 Staking Earnings History
                            </h2>


                            <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                <button id="claimRewardsBtn" style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", padding: "16px 32px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(16px, 3.5vw, 18px)", fontWeight: 900, boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)", minWidth: "240px", marginBottom: "8px" }}>
                                    🎁 Claim All Rewards
                                </button>
                                <div id="claimableAmount" style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#0f172a", opacity: 0.8, marginTop: "8px" }}>
                                    Available to claim: <span style={{ color: "#10b981", fontWeight: 700 }}>0 HEXA</span>
                                </div>
                            </div>

                            <div id="rewardsContent">

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
