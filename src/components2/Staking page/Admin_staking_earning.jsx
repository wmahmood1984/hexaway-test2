import React, { useEffect, useState } from 'react'
import { stakinvV2ContractR } from '../../config'
import { formatEther } from 'ethers'
import { copyToClipboard, formatAddress, formatWithCommas, secondsToDMY } from '../../utils/contractExecutor'

export default function Admin_staking_earning() {
        const [stake, setStake] = useState()
    
        useEffect(() => {
    
    
    
            abc()
        }, [])
    
    
        const abc = async () => {
    
    
            const _mystake = await stakinvV2ContractR.methods.getClaimsByUser("0x0000000000000000000000000000000000000000").call()
         
  
            setStake(_mystake)
        }
    
    
    
    
    
        const isLoading = !stake;
    
            console.log("claim",stake)
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
    
    
        const now = new Date().getTime() / 1000
        const totalVolume = stake.reduce(
            (acc, t) => acc + Number(formatEther(t.amountClaimed)), 0
        )

     
    
    return (
        <div>

            <div id="app" class="h-full w-full overflow-auto">

                <nav style={{ background: "#f8fafc", padding: "20px 0", borderBottom: "2px solid rgba(99, 102, 241, 0.3)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                                🎨
                            </div>
                            <span style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#1e293b", fontWeight: 700 }}>
                                HEXA
                            </span>
                        </div>

                    </div>
                </nav>


                <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 20px" }}>
                    <div style={{ marginBottom: "32px" }}>
                        <h1 style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "32px", color: "#1e293b", fontWeight: 700, marginBottom: "8px" }}>
                            Staking Earning Detail
                        </h1>
                        <button class="transfer-btn" onclick="window.location.href='Admin_staking.html'">
                            <i class="fas fa-exchange-alt"></i>
                            Go to Staking
                        </button>
                        <button class="transfer-btn" onclick="window.location.href='Admin_staking_earning.html'">
                            <i class="fas fa-exchange-alt"></i>
                            Go to Staking Earning
                        </button>
                        <p style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#1e293b", opacity: 0.7 }}>
                            Overview of  Staking and analytics
                        </p>
                    </div>


                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "40px" }}>
                        <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "2px solid rgba(99, 102, 241, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", opacity: 0.7, marginBottom: "8px" }}>
                                Total Transaction
                            </div>
                            <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "40px", color: "#6366f1", fontWeight: 700 }}>
                                {stake.length}
                            </div>
                        </div>



                        <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "2px solid rgba(139, 92, 246, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", opacity: 0.7, marginBottom: "8px" }}>
                                Earned HEXA
                            </div>
                            <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "40px", color: "#8b5cf6", fontWeight: 700 }}>
                                {totalVolume}
                            </div>
                        </div>
                    </div>


                    <div style={{ background: "#f8fafc", padding: "32px", borderRadius: "12px", border: "2px solid rgba(99, 102, 241, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "24px", color: "#1e293b", fontWeight: 700 }}>
                                Recent Transfers
                            </h2>

                        </div>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>S.No</th>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>User Address</th>


                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>Token Received</th>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>Date</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {stake.map((v,e)=>
                                <tr>
                                        <td style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span>{e+1}</span>
                                                <button class="copy-btn" onclick="copyAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', event)" style={{ color: "#6366f1" }} title="Copy full address">
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>{formatAddress(v.user)}</td>

                                        <td style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#8b5cf6", fontWeight: 600 }}>{formatWithCommas(formatEther(v.amountClaimed))}</td>
                                        <td style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>{secondsToDMY(v.time)}</td>

                                    </tr>
                                      
                                
                                )

                                    }
                                     
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
