import React, { useEffect, useState } from 'react'
import { HexaContract, stakingContractV2, stakingV2Add, stakinvV2ContractR, USDTContract, USDTContractR } from '../../config'
import { useSelector } from 'react-redux'
import { executeContract, formatWithCommas, secondsToDHMSDiff, secondsToDMY } from '../../utils/contractExecutor'
import { formatEther, parseEther } from 'ethers'
import { useAppKitAccount } from '@reown/appkit/react'
import { useStake } from './Stakehook'
import toast from 'react-hot-toast'
import { useConfig } from 'wagmi'



export default function Staking() {
    const config = useConfig()
    const [todayStaked, setTodayStaked] = useState(0)
    const [hexaPrice, setHexaPrice] = useState(0.01)
    const [totalStaked, setTotalStaked] = useState(0)
    const [totalEarned, setTotalEarned] = useState(0)
    const [mystake, setMyStake] = useState()
    const [stakeAmount, setStakeAmount] = useState(0)
    const [loading, setLoading] = useState(false)

    const [myClaims, setMyClaims] = useState()
    const [USDTBalance, setUSDTBalance] = useState(0)
    const [show, setShow] = useState("history")
    const { walletBalance } = useSelector((state) => state.contract);
    const { address } = useAppKitAccount();

    useEffect(() => {



        abc()
    }, [address])


    const abc = async () => {
        const _todayStaked = await stakinvV2ContractR.methods.stakeDone().call()
        setTodayStaked(_todayStaked)
        const _totalStaked = await stakinvV2ContractR.methods.totalStaked().call()
        setTotalStaked(formatWithCommas(formatEther(_totalStaked)))
        const _totalEarned = await stakinvV2ContractR.methods.totalEarned().call()
        setTotalEarned(formatWithCommas(formatEther(_totalEarned)))
        const _usdtBalance = await USDTContractR.methods.balanceOf(address).call()
        setUSDTBalance(formatWithCommas(formatEther(_usdtBalance)))

        const _mystake = await stakinvV2ContractR.methods.getTicketsByUser(address).call()
        const _myClaims = await stakinvV2ContractR.methods.getClaimsByUser(address).call()
        setMyStake(_mystake)
        setMyClaims(_myClaims)

        const _stakeAmount = await stakinvV2ContractR.methods.stakeAmount().call()
        setStakeAmount(formatWithCommas(formatEther(_stakeAmount)))
    }


    const onStakeClick = async (trade, id) => {
        const stakeAmount = 50

        if (
            Number(USDTBalance) < stakeAmount
        ) {
            toast.error("Insufficient USDT Balance")
            return
        }

        try {
            setLoading(true);
            await executeContract({
                config,
                functionName: "approve",
                args: [stakingV2Add, parseEther(stakeAmount.toString())],
                contract: USDTContract,
                onSuccess: () => onStakeClick1(),
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




    const onStakeClick1 = async () => {
        await executeContract({
            config,
            functionName: "stake",
            args: [],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                toast.success("Stake done successfully")

                setLoading(false)
            },
            contract: stakingContractV2,
            onError: (err) => {
                console.error("🔥 Error in register:", err);
                toast.error("Transaction failed:", reason)
                setLoading(false)
            },
        });
    }


    const handleClaim = async (id) => {

        await executeContract({
            config,
            functionName: "claim",
            args: [id],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                toast.success("Package Bought Succes")

                setLoading(false)
            },
            contract: stakingContractV2,
            onError: (err) => {
                console.error("🔥 Error in register:", err);
                toast.error("Transaction failed:", reason)
                setLoading(false)
            },
        });
    };



    const isLoading = !mystake || !myClaims;


    const icon = '💰';





    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

    console.log("staked", mystake)

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
                                        {10 - Number(todayStaked)}
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
                                                ${hexaPrice}
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
                                            {formatWithCommas(walletBalance)} HEXA
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
                                    {totalStaked} HEXA
                                </div>
                            </div>

                            <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(6, 182, 212, 0.4)" }}>
                                <div style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>
                                    💰 Total Earned
                                </div>
                                <div id="totalEarnedDisplay" style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#06b6d4", fontWeight: 900 }}>
                                    {totalEarned} HEXA
                                </div>
                            </div>

                            <div style={{ background: "#ffffff", padding: "16px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", border: "2px solid rgba(16, 185, 129, 0.4)" }}>
                                <div style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600 }}>
                                    💵 Wallet Balance in (USDT)
                                </div>
                                <div id="walletBalanceUsdt" style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#10b981", fontWeight: 900 }}>
                                    ${USDTBalance}
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
                                            <span style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#0f172a", fontWeight: 700 }}>{stakeAmount / hexaPrice} HEXA</span>
                                        </div>
                                        {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7 }}>Duration:</span>
                                            <span style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#0f172a", fontWeight: 700 }}>150 Days</span>
                                        </div> */}
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: "clamp(11px, 2.5vw, 12px)", color: "#0f172a", opacity: 0.7 }}>Est. Reward:</span>
                                            <span style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#06b6d4", fontWeight: 900 }}>50%</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onStakeClick}
                                        id="stakeNowBtn" style={{ width: "100%", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "14px", borderRadius: "10px", cursor: "pointer", fontSize: "clamp(14px, 3.5vw, 16px)", fontWeight: 700, boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)" }}>
                                        Stake Now
                                    </button>
                                </div>
                            </div>
                        </div>


                        <div style={{ textAlign: "center", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                            <button
                                onClick={() => { setShow("history") }}
                                id="viewHistoryBtn" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(139, 92, 246, 0.4)", minWidth: "180px" }}>
                                View Staking History
                            </button>
                            <button
                                onClick={() => { setShow("reward") }}
                                id="viewRewardsBtn" style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "white", border: "none", padding: "14px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 700, boxShadow: "0 8px 20px rgba(6, 182, 212, 0.4)", minWidth: "180px" }}>
                                Staking Reward
                            </button>
                        </div>

                        {show == "history" ?

                            <div id="stakingHistory" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px" }}>
                                <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                                    Your Staking History
                                </h2>

                                {mystake.map((v, e) => {
                                    return (
                                        <div id="historyContent">
                                            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #8b5cf6" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        <span style={{ fontSize: "32px" }}>{icon}</span>
                                                        <div>
                                                            <div style={{ fontSize: "16px", color: "#0f172a", fontWeight: "900" }}>
                                                                $ {formatWithCommas(formatEther(v.amount))} Staking
                                                            </div>
                                                            <div style={{ fontSize: "12px", color: "#0f172a", opacity: "0.7" }}>
                                                                {150} days
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: "right", marginTop: "8px" }}>
                                                        <div style={{ fontSize: "18px", color: "#8b5cf6", fontWeight: "900" }}>
                                                            {formatWithCommas(formatEther(v.amount))} HEXA
                                                        </div>

                                                    </div>
                                                </div>

                                                {/* Stats Section with Claim Button in Available to Claim column */}
                                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "12px" }}>
                                                    {/* Total Earned */}
                                                    <div style={{ background: "rgba(139, 92, 246, 0.1)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                                                        <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>Total Earned</div>
                                                        <div style={{ fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>{formatWithCommas(formatEther(v.claimable))} HEXA</div>
                                                    </div>

                                                    {/* Total Claimed */}
                                                    <div style={{ background: "rgba(139, 92, 246, 0.1)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                                                        <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>Total Claimed</div>
                                                        <div style={{ fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>{formatWithCommas(formatEther(v.amountClaimed))} HEXA</div>
                                                    </div>

                                                    {/* Available to Claim with Button */}
                                                    <div style={{ background: "rgba(139, 92, 246, 0.15)", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
                                                        <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>Available to Claim</div>
                                                        <div style={{ fontSize: "14px", color: "#10b981", fontWeight: "700", marginBottom: "8px" }}>{Number(formatEther(v.claimable)) - Number(formatEther(v.amountClaimed))} HEXA</div>

                                                        {/* Claim Button inside the Available to Claim box */}
                                                        <button
                                                            style={{
                                                                background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                                                                color: "white",
                                                                border: "none",
                                                                padding: "6px 12px",
                                                                borderRadius: "6px",
                                                                fontSize: "11px",
                                                                fontWeight: "700",
                                                                cursor: "pointer",
                                                                transition: "all 0.3s ease",
                                                                boxShadow: "0 2px 4px rgba(139, 92, 246, 0.3)",
                                                                width: "100%"
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.target.style.opacity = '0.9';
                                                                e.target.style.transform = 'translateY(-2px)';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.target.style.opacity = '1';
                                                                e.target.style.transform = 'translateY(0)';
                                                            }}
                                                            onClick={() => handleClaim(v.id)}
                                                        >
                                                            Claim Now
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{ background: "rgba(139, 92, 246, 0.2)", padding: "8px 12px", borderRadius: "8px", marginBottom: "8px" }}>
                                                    <div style={{ fontSize: "12px", color: "#8b5cf6", fontWeight: "700", textAlign: "center" }}>
                                                        ⏱️ {secondsToDHMSDiff(Number(v.time) + (60 * 60 * 24 * 150) - new Date().getTime() / 1000)}
                                                    </div>
                                                </div>

                                                {/* Staked Date at bottom */}
                                                <div style={{ fontSize: "10px", color: "#0f172a", opacity: "0.6", textAlign: "center" }}>
                                                    Staked on: {secondsToDMY(v.time)}
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })}

                            </div>

                            :
                            <div id="stakingRewards" style={{ background: "#ffffff", padding: "16px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.4)", marginTop: "16px" }}>
                                <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#0f172a", fontWeight: 900, textAlign: "center", marginBottom: "16px" }}>
                                    💰 Staking Earnings History
                                </h2>


                                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                                    <button
                                        onClick={handleClaim}
                                        id="claimRewardsBtn" style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", padding: "16px 32px", borderRadius: "12px", cursor: "pointer", fontSize: "clamp(16px, 3.5vw, 18px)", fontWeight: 900, boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)", minWidth: "240px", marginBottom: "8px" }}>
                                        🎁 Claim All Rewards
                                    </button>
                                    <div id="claimableAmount" style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#0f172a", opacity: 0.8, marginTop: "8px" }}>
                                        Available to claim: <span style={{ color: "#10b981", fontWeight: 700 }}>0 HEXA</span>
                                    </div>


                                </div>

                                <div id="rewardsContent">
                                    {myClaims.map((v, e) =>
                                        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #06b6d4" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                    <span style={{ fontSize: "32px" }}>${icon}</span>
                                                    <div>
                                                        <div style={{ fontSize: "16px", color: "#0f172a", fontWeight: 900 }}>
                                                            ${"tierName"} Staking
                                                        </div>
                                                        <div style={{ fontSize: "12px", color: "#0f172a", opacity: 0.7 }}>
                                                            5000 HEXA staked •
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right", marginTop: "8px" }}>
                                                    <div style={{ fontSize: "18px", color: "#06b6d4", fontWeight: 900 }}>
                                                        +${formatWithCommas(formatEther(v.amountClaimed))} HEXA
                                                    </div>
                                                    <div style={{ fontSize: "12px", color: "${statusColor}", fontWeight: 700 }}>
                                                        ${"statusText"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: "10px", color: "#0f172a", opacity: 0.6 }}>
                                                Started: ${secondsToDMY(v.time)}
                                            </div>
                                        </div>

                                    )

                                    }
                                </div>
                            </div>}


                    </div>
                </div>
            </div>
        </div>
    )
}
