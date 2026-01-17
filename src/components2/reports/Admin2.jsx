import React from 'react'

export default function Admin2() {
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
                            Staking Detail
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
                                Total Stakers
                            </div>
                            <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "40px", color: "#6366f1", fontWeight: 700 }}>
                                <span id="totalStakersCount">3</span>
                            </div>
                        </div>

                        <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "2px solid rgba(139, 92, 246, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", opacity: 0.7, marginBottom: "8px" }}>
                                Total Staking Value
                            </div>
                            <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "40px", color: "#8b5cf6", fontWeight: 700 }}>
                                $<span id="totalStakingValue">24,150.00</span>
                            </div>
                        </div>
                    </div>


                    <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "2px solid rgba(99, 102, 241, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h2 style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#1e293b", fontWeight: 700 }}>
                                Search Transactions
                            </h2>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button id="clearSearchBtn" class="clear-btn" style={{ display: "none" }}>
                                    <i class="fas fa-times"></i>
                                    Clear Search
                                </button>
                            </div>
                        </div>

                        <div class="search-container">
                            <i class="fas fa-search" style={{ color: "#9ca3af" }}></i>
                            <input type="text"
                                id="searchInput"
                                class="search-input"
                                placeholder="Search by address (0x...) or token ID (#...)"
                                onkeyup="if(event.key === 'Enter') performSearch()" />
                            <button id="searchBtn" class="search-btn" onclick="performSearch()">
                                <i class="fas fa-search"></i>
                                Search
                            </button>
                        </div>

                        <div id="searchResultsInfo" class="search-results-info">
                            <span id="resultsCount">0</span> results found for "<span id="searchQuery"></span>"
                        </div>
                    </div>


                    <div style={{ background: "#f8fafc", padding: "32px", borderRadius: "12px", border: "2px solid rgba(99, 102, 241, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "24px", color: "#1e293b", fontWeight: 700 }}>
                                Recent Transfers
                            </h2>

                        </div>

                        <div class="table-container">
                            <table id="transfersTable">
                                <thead>
                                    <tr>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>User Address</th>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>NFT Token No</th>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>NFT Value</th>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>Staking Amount</th>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>Token Price</th>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>Token Staked</th>
                                        <th style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">

                                </tbody>
                            </table>
                        </div>

                        <div id="noResults" class="no-results" style={{ display: "none" }}>
                            <i class="fas fa-search" style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}></i>
                            <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>No results found</h3>
                            <p>Try searching with a different address or token ID</p>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    )
}
