import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { executeContract, formatWithCommas, secondsToDMY } from '../utils/contractExecutor';
import { formatEther, parseEther } from 'ethers';
import { bulkAddAbi, bulkContractAdd, fetcherAbi, fetcherAddress, fetcherHelperv2, fetcherV2Abi, helperAbi, helperAddress, helperContractV2, helperv2, HexaContract, testweb3, web3 } from '../config';
import { NFT } from './NFT';
import { Link, useNavigate } from 'react-router-dom';
import { useAppKitAccount } from '@reown/appkit/react';
import TradingLimitTimer from './Timer4';
import toast from 'react-hot-toast';
import { useConfig } from 'wagmi';
import { readName } from '../slices/contractSlice';

export default function Trade({ setCreateActive }) {

    const { Package, User,  walletBalance, userTradingTime, timeLimit,
        status, error
    } = useSelector((state) => state.contract);
    const { address } = useAppKitAccount();

    const config = useConfig()
    const dispatch = useDispatch()


    const [tickets, setTickets] = useState()

    const [showMessage, setShowMessage] = useState(false)
    const [loading,setLoading] = useState(false)

    const helperContract = new web3.eth.Contract(helperAbi, helperAddress)
    const fetcherContract = new web3.eth.Contract(fetcherV2Abi, fetcherHelperv2)
    const saveContract = new testweb3.eth.Contract(bulkAddAbi, bulkContractAdd);

    useEffect(()=>{

        const abc = async ()=>{
            const _tickets = await fetcherContract.methods.getTicketsByUser(address).call()
            setTickets(_tickets)
        }

        abc()
    },[address,loading])

   


        const handleTrade2 = async (id=0) => {
    
            await executeContract({
                config,
                functionName: "trade",
                args: [id],
                onSuccess: (txHash, receipt) => {
                    console.log("🎉 Tx Hash:", txHash);
                    console.log("🚀 Tx Receipt:", receipt);
                    dispatch(readName({ address: receipt.from }));
                    toast.success("Trade made Successfully")
                    setLoading(false)
                },
                contract: helperContractV2,
                onError: (err) => {
                    setLoading(false)
    
                    toast.error("This Trade is not available")
                },
            });
        }
    
    
    
    
    
        const handleTrade = async (id) => {
    
    
            try {
                setLoading(true);
      
    
    
                await executeContract({
                    config,
                    functionName: "approve",
                    args: [helperv2, parseEther("6000")],
                    contract: HexaContract,
                    onSuccess: () => handleTrade2(),
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




    const isLoading = !tickets || !Package

 
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

    const revisedLimitUtilized =
        now - Number(User.userTradingLimitTime) > 60 * 60 * 24 ? 0 : User.userLimitUtilized;

    const duration = Number(User.userTradingLimitTime) + 60 * 60 * 24 - now > 0 ? Number(User.userTradingLimitTime) + 60 * 60 * 24 - now : 0

   const tradingLimitUsage = `${Number(Number(revisedLimitUtilized) / Number(Package.limit) * 100).toFixed(2)}`

    console.log("object", revisedLimitUtilized, Package.limit);







    return (
        <div>

            <div id="trade-page" class="page">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">NFT Marketplace</h2><button onclick="showPage('history')" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg flex items-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg><Link
                                to={"/history"}
                            >Transaction History</Link> </button>
                    </div> */}

                    {showMessage && <div class="mb-8">
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">NFT Marketplace</h2>
                        <p class="text-gray-600">Discover and trade premium digital assets</p>
                        <p id="trading-message" class="text-orange-600 font-medium bg-orange-50 px-4 py-2 rounded-lg inline-block border border-orange-200">
                            Please purchase a visible NFT to begin your trading journey.
                        </p>
                    </div>}
                    <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 mb-8">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-600 font-medium">
                                    Wallet Balance
                                </div>
                                <div class="text-2xl font-bold text-green-600" id="trade-wallet-balance">
                                    {formatWithCommas(walletBalance)}
                                    <p style={{ fontSize: "12px" }}> Hexas</p>
                                </div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-600 font-medium">
                                    Trading Limit
                                </div>
                                <div class="text-2xl font-bold text-blue-600" id="trade-limit-total">
                                    {Package.limit}
                                    <p style={{ fontSize: "12px" }}> No. of Trades</p>
                                </div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-600 font-medium">
                                    Limit Used
                                </div>
                                <div class="text-2xl font-bold text-orange-600" id="trade-limit-used">
                                    {revisedLimitUtilized}
                                    <p style={{ fontSize: "12px" }}> No. of Trades</p>

                                </div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                                    </svg>
                                </div>
                                <div class="text-sm text-gray-600 font-medium">
                                    Remaining Limit
                                </div>
                                <div class="text-2xl font-bold text-purple-600" id="trade-limit-remaining">
                                    {Package.limit - revisedLimitUtilized}
                                    <p style={{ fontSize: "12px" }}> No. of Trades</p>

                                </div>
                            </div>
                        </div>
                        <div class="mt-6">
                            <div class="flex items-center justify-between mb-2"><span class="text-sm font-medium text-gray-700">Trading Limit Usage</span> <span class="text-sm text-gray-600" id="trade-usage-percentage">{`${tradingLimitUsage}%`}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div id="trade-progress-bar" class="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"

                                    style={{ width: `${Number(revisedLimitUtilized) / Number(Package.limit) * 100}%` }}></div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-500 mt-1"><span>No. of Trades {revisedLimitUtilized}</span> <span id="trade-limit-display">No. of Trades {Package.limit}</span>
                            </div>
                        </div>
                    </div>
                    <TradingLimitTimer durationInSeconds={duration} />
                    {/* <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {randomeNFTs.map((v, e) => {

                            return (
                                <NFT
                                    nft={v}
                                    // image={v.image}
                                    // name={v.name}
                                    index={v.id}
                                    toggle={toggle}
                                    setToggle={setToggle}
                                    revisedLimitUtilized={revisedLimitUtilized} />
                               
                            )

                        })


                        }

                    </div> */}


                    <div class="min-h-full w-full">
                        <main style={{ maxWidth: "1600px", margin: "0 auto", padding: "40px 24px" }}>

                            <button 
                            onClick={handleTrade}
                            style={{ 
                                fontSize:"50px",color:"white",cursor:"pointer",
                                textAlign: "center",marginLeft:"380px",  marginBottom: "50px", padding: "10px 10px", borderRadius: "24px", background: "linear-gradient(135deg, #6366f1, #10b981)", boxShadow: "0 20px 60px rgba(99, 102, 241, 0.3)", animation: "slideUp 0.5s ease-out" }}>
                                    Trade Now
                            </button>


                            <div class="header-row" style={{ background: "#ffffff", border: "2px solid rgba(99, 102, 241, 0.5)", borderRadius: "16px", padding: "16px 28px", marginBottom: "16px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>

                                <div style={{ flex: "0 0 120px", minWidth: 0 }}>
                                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Token ID
                                    </h2>
                                </div>


                                <div style={{ flex: "0 0 140px", minWidth: 0 }}>
                                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Date
                                    </h2>
                                </div>


                                <div style={{ flex: "0 0 180px", textAlign: "right", minWidth: 0 }}>
                                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Amount
                                    </h2>
                                </div>


                                <div style={{ flex: "0 0 120px", textAlign: "center", minWidth: 0 }}>
                                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Status
                                    </h2>
                                </div>


                                <div style={{ flex: "0 0 130px", minWidth: 0 }}>
                                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Trade
                                    </h2>
                                </div>
                            </div>


                            <div class="list-container">
                            {tickets.map((v,e)=>
                            <div class="token-card token-row" style={{ background: "#ffffff", border: "2px solid rgba(99, 102, 241, 0.3)", borderRadius: "16px", padding: "20px 28px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", animationDelay: "0s", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>

                                    <div style={{ flex: "0 0 120px", minWidth: 0 }}>
                                        <div class="mobile-label" style={{ color: "#1e293b", fontFamily: "'Orbitron', sans-serif" }}>Token ID</div>
                                        <div class="token-field-content">
                                            <code style={{ fontFamily: "'Courier New', monospace", fontSize: "14px", color: "#6366f1", background: "#f8fafc", padding: "6px 12px", borderRadius: "8px", display: "inline-block", fontWeight: 700 }}>
                                                TKN-{v.id}
                                            </code>
                                        </div>
                                    </div>


                                    <div style={{ flex: "0 0 140px", minWidth: 0 }}>
                                        <div class="mobile-label" style={{ color: "#1e293b", fontFamily: "'Orbitron', sans-serif" }}>Date</div>
                                        <div class="token-field-content" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                                            {secondsToDMY(v.time)}
                                        </div>
                                    </div>


                                    <div class="mobile-amount-wrapper" style={{ flex: "0 0 180px", textAlign: "right", minWidth: 0 }}>
                                        <div class="mobile-label" style={{ color: "#1e293b", fontFamily: "'Orbitron', sans-serif" }}>Amount</div>
                                        <div class="token-field-content" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "14px", color: "#10b981", fontWeight: 700 }}>
                                            ${formatEther(v.income)}
                                        </div>
                                    </div>


                                    <div class="mobile-status-wrapper" style={{ flex: "0 0 120px", textAlign: "center", minWidth: 0 }}>
                                        <div class="mobile-label" style={{ color: "#1e293b", fontFamily: "'Orbitron', sans-serif" }}>Status</div>
                                        <div class="token-field-content">
                                            {v.filled? <div style={{ background: "rgba(16, 185, 129, 0.2)", padding: "6px 14px", borderRadius: "20px", border: "1px solid #10b981", display: "inline-block" }}>
                                                <span class="status-active" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                    complete
                                                </span>
                                            </div>:<div style={{ background: "rgba(16, 185, 129, 0.2)", padding: "6px 14px", borderRadius: "20px", border: "1px solid #10b981", display: "inline-block" }}>
                                                <span class="status-active" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "12px", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                    processing
                                                </span>
                                            </div>}
                                        </div>
                                    </div>


                                    <div style={{ flex: "0 0 130px", minWidth: 0 }}>
                                        <div class="mobile-label" style={{ color: "#1e293b", fontFamily: "'Orbitron', sans-serif" }}>Trade</div>
                                        <button
                                            disabled={!v.filled}
                                            class="trade-btn"
                                            onclick="handleTrade('TKN-001', 'Bitcoin')"
                                            style={{ width: "100%", background:v.filled? "linear-gradient(135deg, #6366f1, #10b981)":"grey", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", fontFamily: "'Orbitron', sans-serif", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px", boxShadow: "0 3px 8px rgba(99, 102, 241, 0.35)" }}
                                        >
                                            Trade Now
                                        </button>
                                    </div>
                                </div>
                            )}        
                                



                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}
