import React from 'react'
import "./Slot.css"
export default function ColorSlotAdmin() {
  return (
    <div>
      <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo-container">
                    <div class="logo">🎨</div>
                    <div class="logo-text">Colour Slot Admin</div>
                </div>
                <a href="Admin_sloat_detail.html" class="transfer-btn">
                    <i class="fas fa-exchange-alt"></i>
                    Go to Slots
                </a>
            </div>
        </div>
    </nav>

    
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
                       id="searchInput" 
                       class="search-input" 
                       placeholder="Search by address or slot number..." 
                       onkeyup="filterTable()" />
            </div>
            
            <div class="filter-buttons">
                <button class="filter-btn" onclick="filterBySlots(3)">3 Slots</button>
                <button class="filter-btn" onclick="filterBySlots(6)">6 Slots</button>
                <button class="filter-btn" onclick="filterBySlots(9)">9 Slots</button>
                <button class="filter-btn" onclick="filterByStatus('Success')">Success</button>
                <button class="filter-btn" onclick="filterByStatus('Roll Back')">Roll Back</button>
                <button class="clear-btn" onclick="clearFilters()">Clear Filters</button>
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
                        
                        <tr>
                            <td>1</td>
                            <td>
                                <div class="address-cell">
                                    <span class="short-address">0x742d35Cc6634C0532925a3b8B9C4A1d3f4a5b6c7</span>
                                    <button class="copy-btn" onclick="copyAddress('0x742d35Cc6634C0532925a3b8B9C4A1d3f4a5b6c7', event)">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </td>
                            <td>3</td>
                            <td>3 min</td>
                            <td>1,250</td>
                            <td>1,250</td>
                            <td>1,250</td>
                            <td>1,250</td>
                            <td>Jan 15, 2024</td>
                            <td><span class="status-badge status-completed">Success</span></td>
                        </tr>
                        
                        <tr>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
    </div>
  )
}
