import React, { useEffect, useState } from 'react'
import "./Slot.css"
import { gameContractR } from '../../config';
import { formatEther } from 'ethers';
import { copyToClipboard, formatAddress, secondsToDMY } from '../../utils/contractExecutor';
export default function ColorSlotAdmin() {
     const [bids, setBids] = useState()
         const [searchText, setSearchText] = useState("")
        const [filterbyStatus, setFilterbyStatus] = useState("all")
         const [slotFilter, setSlotFilter] = useState("all")

    useEffect(() => {
        abc();

    }, [])

    const abc = async () => {
        const _data = await gameContractR.methods.getBids().call()
        setBids(_data)


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
            <h1 class="page-title">Colour Slots Details</h1>
            <p class="page-subtitle">Overview of predictions and analytics</p>
            <a href="Admin_NFT_Prediction.html" class="transfer-btn">
                <i class="fas fa-exchange-alt"></i>
                Go to Prediction
            </a>
        </div>

        
        <div class="stats-grid">
            <div class="stat-card" style={{ borderColor: "rgba(99, 102, 241, 0.3)" }}>
                <span class="stat-label">Total Slots</span>
                <div class="stat-value" style={{ color: "#6366f1" }}>332</div>
            </div>

            <div class="stat-card" style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}>
                <span class="stat-label">Slot Amount</span>
                <div class="stat-value" style={{ color: "#f59e0b" }}>6,454(H)</div>
            </div>

            <div class="stat-card" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
                <span class="stat-label">Total Wining Amount</span>
                <div class="stat-value" style={{ color: "#10b981" }}>$23,324</div>
            </div>

            <div class="stat-card" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
                <span class="stat-label">Total Admin Fund</span>
                <div class="stat-value" style={{ color: "#10b981" }}>$323,324</div>
            </div>

            <div class="stat-card" style={{ borderColor: "rgba(139, 92, 246, 0.3)" }}>
                <span class="stat-label">Total Earned Commission</span>
                <div class="stat-value" style={{ color: "#8b5cf6" }}>$24,150.00</div>
            </div>
        </div>

        
        <div class="filter-section">
            <div class="search-box">
                <input type="text" 
                          onChange={(e) => setSearchText(e.target.value)}
                          value={searchText}
                       id="searchInput" 
                       class="search-input" 
                       placeholder="Search by address or slot number..." 
                       onkeyup="filterTable()" />
            </div>
            
            <div class="filter-buttons">
                <button class="filter-btn" onClick={() => setSlotFilter(3)}>3 Slots</button>
                <button class="filter-btn" onClick={() => setSlotFilter(6)}>6 Slots</button>
                <button class="filter-btn" onClick={() => setSlotFilter(9)}>9 Slots</button>
                <button class="filter-btn" onClick={() => setFilterbyStatus('Success')}>Success</button>
                <button class="filter-btn" onClick={() => setFilterbyStatus('Roll Back')}>Roll Back</button>
                <button class="clear-btn" onClick={() => {
                    setSlotFilter("all")
                    setFilterbyStatus("all")
                }}>Clear Filters</button>
            </div>
        </div>

        
        <div class="table-section">
            <div class="section-header">
                <h2 class="section-title">Recent Slots Transactions</h2>
                <span id="resultsCount" class="results-count">(7 results)</span>
            </div>
            
            <div class="table-container">
                <table class="data-table" id="slotsTable">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Wallet Address</th>
                            <th>Slots</th>
                            <th>Time Frame</th>
                            <th>Slot Value</th>
                            <th>Wining Amount</th>
                            <th>Commission</th>
                            <th>Admin Fund</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                    {bids
                    .filter(
                        bid => bid.user.toLowerCase().includes(searchText.toLowerCase())
                        && (slotFilter === "all" || bid.slots === slotFilter)
                        && (filterbyStatus === "all" || (bid.settled && bid.won ? "Success" : !bid.won ? "Roll Back" : "Pending") === filterbyStatus)
                    )
                    .map((bid, index) => (
                            
                        <tr>
                            <td>{index+1}</td>
                            <td>
                                <div class="address-cell">
                                    <span class="short-address">{formatAddress(bid.user)}</span>
                                    <button class="copy-btn" onClick={() => copyToClipboard(bid.user)}>
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td>{bid.slots}</td>
                            <td>{bid.duration} min</td>
                            <td>{formatEther(bid.amount)}</td>
                            <td>{
                            bid.settled && bid.won ? formatEther(bid.amount) * 2 : 0
                            }</td>
                            <td>{0}</td>
                            <td>{0}</td>
                            <td>{secondsToDMY(bid.time)}</td>
                            <td><span class={`status-badge status-${bid.settled && bid.won ? 'completed' : !bid.won ? 'failed' : 'pending'}`}>{bid.settled && bid.won ? "Success": !bid.won ? "Roll Back" :"Pending"}</span></td>
                        </tr>))}
                        
                        {/* <tr>
                            <td>2</td>
                            <td>
                                <div class="address-cell">
                                    <span class="short-address">0x8a4b7c9d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8</span>
                                    <button class="copy-btn" onclick="copyAddress('0x8a4b7c9d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8', event)">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td>9</td>
                            <td>5 min</td>
                            <td>1,580</td>
                            <td>1,580</td>
                            <td>1,580</td>
                            <td>1,580</td>
                            <td>Jan 18, 2024</td>
                            <td><span class="status-badge status-completed">Success</span></td>
                        </tr>
                        
                        <tr>
                            <td>3</td>
                            <td>
                                <div class="address-cell">
                                    <span class="short-address">0x3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4</span>
                                    <button class="copy-btn" onclick="copyAddress('0x3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4', event)">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td>9</td>
                            <td>10 min</td>
                            <td>2,120</td>
                            <td>2,120</td>
                            <td>2,120</td>
                            <td>2,120</td>
                            <td>Jan 28, 2024</td>
                            <td><span class="status-badge status-pending">Roll Back</span></td>
                        </tr>
                        
                        <tr>
                            <td>4</td>
                            <td>
                                <div class="address-cell">
                                    <span class="short-address">0x5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6</span>
                                    <button class="copy-btn" onclick="copyAddress('0x5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6', event)">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td>6</td>
                            <td>1 min</td>
                            <td>2,120</td>
                            <td>2,120</td>
                            <td>2,120</td>
                            <td>2,120</td>
                            <td>Jan 10, 2024</td>
                            <td><span class="status-badge status-completed">Success</span></td>
                        </tr>
                        
                        <tr>
                            <td>5</td>
                            <td>
                                <div class="address-cell">
                                    <span class="short-address">0x9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0</span>
                                    <button class="copy-btn" onclick="copyAddress('0x9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0', event)">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td>6</td>
                            <td>1 min</td>
                            <td>123</td>
                            <td>123</td>
                            <td>123</td>
                            <td>123</td>
                            <td>Feb 1, 2024</td>
                            <td><span class="status-badge status-completed">Success</span></td>
                        </tr>
                        
                        <tr>
                            <td>6</td>
                            <td>
                                <div class="address-cell">
                                    <span class="short-address">0xa1b2c3d4e5f67890ab1c2d3e4f56789</span>
                                    <button class="copy-btn" onclick="copyAddress('0xa1b2c3d4e5f67890ab1c2d3e4f56789', event)">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td>3</td>
                            <td>3 min</td>
                            <td>2,500</td>
                            <td>2,500</td>
                            <td>250</td>
                            <td>2250</td>
                            <td>Feb 5, 2024</td>
                            <td><span class="status-badge status-completed">Success</span></td>
                        </tr>
                        
                        <tr>
                            <td>7</td>
                            <td>
                                <div class="address-cell">
                                    <span class="short-address">0xb2c3d4e5f67890a1b2c3d4e5f67890a1</span>
                                    <button class="copy-btn" onclick="copyAddress('0xb2c3d4e5f67890a1b2c3d4e5f67890a1', event)">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td>9</td>
                            <td>5 min</td>
                            <td>3,000</td>
                            <td>3,000</td>
                            <td>300</td>
                            <td>2700</td>
                            <td>Feb 8, 2024</td>
                            <td><span class="status-badge status-pending">Roll Back</span></td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </div>
    </main>
    </div>
  )
}
