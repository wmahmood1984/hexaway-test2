import React from 'react'
import "./Prediction.css"

export default function ColorPredictionAdmin() {
  return (
    <div>
      <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo-container">
                    <div class="logo">🎨</div>
                    <div class="logo-text">Colour Prediction Admin</div>
                </div>
                <a href="Admin_NFT_Prediction.html" class="transfer-btn">
                    <i class="fas fa-exchange-alt"></i>
                    Go to Prediction
                </a>
            </div>
        </div>
    </nav>

    
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
                <div class="stat-value" id="totalPredictions">332</div>
            </div>

            <div class="stat-card" style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}>
                <span class="stat-label">Spent Amount</span>
                <div class="stat-value" style={{ color: "#f59e0b" }} id="spentAmount">6,454(H)</div>
            </div>

            <div class="stat-card" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
                <span class="stat-label">Total Wining Amount</span>
                <div class="stat-value" style={{ color: "#10b981" }}>$<span id="winningAmount">23,324</span></div>
            </div>

            <div class="stat-card" style={{ borderColor: "rgba(139, 92, 246, 0.3)" }}>
                <span class="stat-label">Total Lose Tokens</span>
                <div class="stat-value" style={{ color: "#8b5cf6" }}>$<span id="loseAmount">24,150.00</span></div>
            </div>
        </div>

        
        <div class="filter-container">
            <div class="search-box">
                <input type="text" 
                       id="searchBox" 
                       class="search-input" 
                       placeholder="Search by address..."
                       onkeyup="filterTable()" />
            </div>
            
            
            <div class="filter-group">
                <span class="filter-label">Time:</span>
                <button class="filter-btn active" onclick="setTimeFilter('all')">All</button>
                <button class="filter-btn" onclick="setTimeFilter('1')">1 min</button>
                <button class="filter-btn" onclick="setTimeFilter('3')">3 min</button>
                <button class="filter-btn" onclick="setTimeFilter('5')">5 min</button>
                <button class="filter-btn" onclick="setTimeFilter('10')">10 min</button>
            </div>
            
            
            <div class="filter-group">
                <span class="filter-label">Slot:</span>
                <button class="filter-btn active" onclick="setSlotFilter('all')">All</button>
                <button class="filter-btn" onclick="setSlotFilter('3')">3 Slot</button>
                <button class="filter-btn" onclick="setSlotFilter('6')">6 Slot</button>
                <button class="filter-btn" onclick="setSlotFilter('9')">9 Slot</button>
            </div>
            
            
            <button class="reset-btn" onclick="resetFilters()">
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
                            <th>Sloate</th>
                            <th>Time Frame</th>
                            <th>Spenting Token</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        
                    </tbody>
                </table>
            </div>
        </div>
    </main>
    </div>
  )
}
