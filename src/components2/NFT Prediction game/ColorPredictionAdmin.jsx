import React, { useEffect, useState } from 'react'
import "./Prediction.css"
import { gameContractR } from '../../config';
import { formatEther } from 'ethers';
import { secondsToDMY } from '../../utils/contractExecutor';

export default function ColorPredictionAdmin() {
    const [bids, setBids] = useState()
    const [totalWon, setTotalWon] = useState(0)
    const [totalLost, setTotalLost] = useState(0)
    const [searchText, setSearchText] = useState("")
    const [timeFilter, setTimeFilter] = useState("all")
    const [slotFilter, setSlotFilter] = useState("all")

    useEffect(() => {
        abc();

    }, [])

    const abc = async () => {
        const _data = await gameContractR.methods.getBids().call()
        setBids(_data)
        const _won = gameContractR.methods.totalWon1().call()
        const _lost = gameContractR.methods.totalLost1().call()
        setTotalWon(formatEther(_won))
        setTotalLost(formatEther(_lost))

    }


    const isLoading = !bids;



    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

    const spentAmount = bids.reduce((total, bid) => total + Number(formatEther(bid.amount)), 0);

    console.log("prediction", { bids })

    return (
        <div>



            <main class="main-content container">

                <div class="page-header">
                    <h1 class="page-title">Colour Predictions Details</h1>
                    <p class="page-subtitle">Overview of predictions and analytics</p>
                    <a href="Admin_sloat_Detail.html" class="transfer-btn">
                        <i class="fas fa-exchange-alt"></i>
                        Go to Sloats
                    </a>
                </div>


                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-label">Total Predictions</span>
                        <div class="stat-value" id="totalPredictions">{bids?.length || 0}</div>
                    </div>

                    <div class="stat-card" style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}>
                        <span class="stat-label">Spent Amount</span>
                        <div class="stat-value" style={{ color: "#f59e0b" }} id="spentAmount">{spentAmount}(H)</div>
                    </div>

                    <div class="stat-card" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
                        <span class="stat-label">Total Wining Amount</span>
                        <div class="stat-value" style={{ color: "#10b981" }}>$<span id="winningAmount">{totalWon}</span></div>
                    </div>

                    <div class="stat-card" style={{ borderColor: "rgba(139, 92, 246, 0.3)" }}>
                        <span class="stat-label">Total Lose Tokens</span>
                        <div class="stat-value" style={{ color: "#8b5cf6" }}>$<span id="loseAmount">{totalLost}</span></div>
                    </div>
                </div>


                <div class="filter-container">
                    <div class="search-box">
                        <input type="text"
                            onChange={(e) => setSearchText(e.target.value)}
                            id="searchBox"
                            value={searchText}
                            class="search-input"
                            placeholder="Search by address..."
                            onkeyup="filterTable()" />
                    </div>


                    <div class="filter-group">
                        <span class="filter-label">Time:</span>
                        <button class="filter-btn active" onClick={() => setTimeFilter("all")}>All</button>
                        <button class="filter-btn" onClick={() => setTimeFilter("1")}>1 min</button>
                        <button class="filter-btn" onClick={() => setTimeFilter("3")}>3 min</button>
                        <button class="filter-btn" onClick={() => setTimeFilter("5")}>5 min</button>
                        <button class="filter-btn" onClick={() => setTimeFilter("10")}>10 min</button>
                    </div>


                    <div class="filter-group">
                        <span class="filter-label">Slot:</span>
                        <button class="filter-btn active" onClick={() => setSlotFilter("all")}>All</button>
                        <button class="filter-btn" onClick={() => setSlotFilter("3")}>3 Slot</button>
                        <button class="filter-btn" onClick={() => setSlotFilter("6")}>6 Slot</button>
                        <button class="filter-btn" onClick={() => setSlotFilter("9")}>9 Slot</button>
                    </div>


                    <button class="reset-btn" onClick={()=>{
                        setSearchText("")
                        setTimeFilter("all")
                        setSlotFilter("all")
                    }}>
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </div>


                <div class="table-section">
                    <div class="section-header">
                        <h2 class="section-title">Recent Predictions</h2>
                    </div>

                    <div class="table-container">
                        <table class="data-table" id="predictionsTable">
                            <thead>
                                <tr>
                                    <th>User Address</th>
                                    <th>Slote</th>
                                    <th>Time Frame</th>
                                    <th>Spenting Token</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="tableBody">
                                {bids
                                .filter(
                                    bid => bid.user.toLowerCase().includes(searchText.toLowerCase())
                                    && (timeFilter === "all" || bid.duration === timeFilter)
                                    && (slotFilter === "all" || bid.slots === slotFilter)    
                                )
                                .map((bid, index) => (
                                    <tr key={index}>
                                        <td>{bid.user}</td>
                                        <td>{bid.slots}</td>
                                        <td>{bid.duration} minutes</td>
                                        <td>{formatEther(bid.amount)} $</td>
                                        <td>{secondsToDMY(bid.time)}</td>
                                        <td>{bid.settled ? "Settled" : "Pending"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
