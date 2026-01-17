import React from 'react'

export default function Admin1() {
    return (
        <div>
            <div class="min-h-full w-full" style={{ background: "#f8fafc" }}>
                <main style={{ maxWidth: "1800px", margin: "0 auto", padding: "32px 24px" }}>

                    <div class="fade-in" style={{ background: "linear-gradient(135deg, #ffffff, #ffffffdd)", padding: "32px 40px", borderRadius: "20px", border: "2px solid #3b82f6", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)", marginBottom: "32px", backdropFilter: "blur(10px)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #3b82f6, #10b981)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)" }}>
                                    <span style={{ fontSize: "48px" }}>⚡</span>
                                </div>
                                <div>
                                    <h1 style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "40px", color: "#0f172a", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
                                        Exchange Admin
                                    </h1>
                                    <p style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "16px", color: "#0f172a", opacity: 0.7, margin: "6px 0 0 0", fontWeight: 600 }}>
                                        HEXA Exchange • Real-time Analytics
                                    </p>
                                </div>
                            </div>
                            <div class="header-stats" style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", opacity: 0.6, marginBottom: "4px", fontWeight: 600, textTransform: "uppercase" }}>
                                        Total Buy HEXA
                                    </div>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "16px", color: "#10b981", fontWeight: 700 }}>
                                        6,950
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", opacity: 0.6, marginBottom: "4px", fontWeight: 600, textTransform: "uppercase" }}>
                                        Total Sell HEXA
                                    </div>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "16px", color: "#ef4444", fontWeight: 700 }}>
                                        8,400
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", opacity: 0.6, marginBottom: "4px", fontWeight: 600, textTransform: "uppercase" }}>
                                        Last Updated
                                    </div>
                                    <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "16px", color: "#3b82f6", fontWeight: 700 }}>
                                        2:45 PM
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="desktop-grid fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>

                        <div class="stat-card" style={{ background: "linear-gradient(135deg, #ffffff, #ffffffdd)", padding: "20px", borderRadius: "16px", border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", position: "relative", overflow: "hidden", minWidth: 0 }}>
                            <div style={{ position: "absolute", top: "15px", right: "15px", fontSize: "36px", opacity: 0.15 }}>📈</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", wordWrap: "break-word" }}>
                                Today's Volume
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "28px", color: "#3b82f6", fontWeight: 900, marginBottom: "8px", wordWrap: "break-word", overflowWrap: "break-word" }}>
                                $70,900.00
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", color: "#10b981", fontWeight: 600, wordWrap: "break-word" }}>
                                ↑ 40.49% from yesterday
                            </div>
                        </div>


                        <div class="stat-card" style={{ background: "linear-gradient(135deg, #ffffff, #ffffffdd)", padding: "20px", borderRadius: "16px", border: "2px solid #10b981", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", position: "relative", overflow: "hidden", minWidth: 0 }}>
                            <div style={{ position: "absolute", top: "15px", right: "15px", fontSize: "36px", opacity: 0.15 }}>📊</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", wordWrap: "break-word" }}>
                                Yesterday's Volume
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "28px", color: "#10b981", fontWeight: 900, marginBottom: "8px", wordWrap: "break-word", overflowWrap: "break-word" }}>
                                $50,500.00
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", color: "#0f172a", opacity: 0.6, fontWeight: 600, wordWrap: "break-word" }}>
                                Previous day total
                            </div>
                        </div>


                        <div class="stat-card" style={{ background: "linear-gradient(135deg, #ffffff, #ffffffdd)", padding: "20px", borderRadius: "16px", border: "2px solid #f59e0b", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", position: "relative", overflow: "hidden", minWidth: 0 }}>
                            <div style={{ position: "absolute", top: "15px", right: "15px", fontSize: "36px", opacity: 0.15 }}>🔄</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", wordWrap: "break-word" }}>
                                Live Orders
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "28px", color: "#f59e0b", fontWeight: 900, marginBottom: "8px" }}>
                                4
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", color: "#0f172a", opacity: 0.6, fontWeight: 600, wordWrap: "break-word" }}>
                                <span class="status-badge" style={{ display: "inline-block", width: "8px", height: "8px", background: "#f59e0b", borderRadius: "50%", marginRight: "6px" }}></span>
                                Active now
                            </div>
                        </div>


                        <div class="stat-card" style={{ background: "linear-gradient(135deg, #ffffff, #ffffffdd)", padding: "20px", borderRadius: "16px", border: "2px solid #8b5cf6", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", position: "relative", overflow: "hidden", minWidth: 0 }}>
                            <div style={{ position: "absolute", top: "15px", right: "15px", fontSize: "36px", opacity: 0.15 }}>✅</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", color: "#0f172a", opacity: 0.7, marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", wordWrap: "break-word" }}>
                                Completed Today
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "28px", color: "#8b5cf6", fontWeight: 900, marginBottom: "8px" }}>
                                5
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", color: "#0f172a", opacity: 0.6, fontWeight: 600, wordWrap: "break-word" }}>
                                Successfully executed
                            </div>
                        </div>
                    </div>


                    <div class="fade-in" style={{ background: "#ffffff", padding: "28px", borderRadius: "16px", border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", marginBottom: "32px" }}>
                        <h2 style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "24px", color: "#0f172a", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>👥</span>
                            User Trading Activity
                        </h2>

                        <div class="mobile-scroll" style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #3b82f6" }}>
                                        <th style={{ padding: "16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>S.No</th>
                                        <th style={{ padding: "16px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Wallet Address</th>
                                        <th style={{ padding: "16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Total Trades</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Today</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Yesterday</th>
                                        <th style={{ padding: "16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "linear-gradient(135deg, #3b82f6, #10b981)", borderRadius: "10px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "18px", color: "white", fontWeight: 800 }}>
                                                1
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#3b82f6", background: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontWeight: 600 }}>
                                                    0x742d...bEb1
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}
                                                    title="Copy full address"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                45
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $12,500.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", opacity: 0.7, fontWeight: 600 }}>
                                                $8,900.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                active
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "linear-gradient(135deg, #3b82f6, #10b981)", borderRadius: "10px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "18px", color: "white", fontWeight: 800 }}>
                                                2
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#3b82f6", background: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontWeight: 600 }}>
                                                    0x9F2d...C6E
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}
                                                    title="Copy full address"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                32
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $9,800.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", opacity: 0.7, fontWeight: 600 }}>
                                                $11,200.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                active
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "linear-gradient(135deg, #3b82f6, #10b981)", borderRadius: "10px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "18px", color: "white", fontWeight: 800 }}>
                                                3
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#3b82f6", background: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontWeight: 600 }}>
                                                    0x1A2B...A0B
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}
                                                    title="Copy full address"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                67
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $18,700.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", opacity: 0.7, fontWeight: 600 }}>
                                                $15,300.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                active
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "linear-gradient(135deg, #3b82f6, #10b981)", borderRadius: "10px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "18px", color: "white", fontWeight: 800 }}>
                                                4
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#3b82f6", background: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontWeight: 600 }}>
                                                    0x8E7D...F6E
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}
                                                    title="Copy full address"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                23
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $5,600.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", opacity: 0.7, fontWeight: 600 }}>
                                                $7,800.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#64748b", color: "white", padding: "6px 16px", borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                inactive
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "linear-gradient(135deg, #3b82f6, #10b981)", borderRadius: "10px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "18px", color: "white", fontWeight: 800 }}>
                                                5
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#3b82f6", background: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontWeight: 600 }}>
                                                    0x5F4E...F6E
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}
                                                    title="Copy full address"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                89
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $24,300.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", opacity: 0.7, fontWeight: 600 }}>
                                                $19,600.00
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "20px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                active
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div class="fade-in" style={{ background: "#ffffff", padding: "28px", borderRadius: "16px", border: "2px solid #f59e0b", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)", marginBottom: "32px" }}>
                        <h2 style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "24px", color: "#0f172a", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>🔄</span>
                            Live Orders
                            <span class="status-badge" style={{ display: "inline-block", width: "12px", height: "12px", background: "#f59e0b", borderRadius: "50%", marginLeft: "8px" }}></span>
                        </h2>

                        <div class="mobile-scroll" style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f59e0b" }}>
                                        <th style={{ padding: "16px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Order ID</th>
                                        <th style={{ padding: "16px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Wallet</th>
                                        <th style={{ padding: "16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Type</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Amount</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Price</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Total</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#f59e0b", fontWeight: 700 }}>
                                                ORD-001
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x742d...bEb1
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                buy
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                1,500
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0098
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $14.70
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                2m ago
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#f59e0b", fontWeight: 700 }}>
                                                ORD-002
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x5F4E...F6E
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#ef4444", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                sell
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                2,300
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0102
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $23.46
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                5m ago
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#f59e0b", fontWeight: 700 }}>
                                                ORD-003
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x1A2B...A0B
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                buy
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                800
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0097
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $7.76
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                8m ago
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#f59e0b", fontWeight: 700 }}>
                                                ORD-004
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x9F2d...C6E
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                buy
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                1,200
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0099
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $11.88
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                10m ago
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div class="fade-in" style={{ background: "#ffffff", padding: "28px", borderRadius: "16px", border: "2px solid #8b5cf6", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}>
                        <h2 style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "24px", color: "#0f172a", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>✅</span>
                            Completed Orders
                        </h2>

                        <div class="mobile-scroll" style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #8b5cf6" }}>
                                        <th style={{ padding: "16px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Order ID</th>
                                        <th style={{ padding: "16px", textAlign: "left", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Wallet</th>
                                        <th style={{ padding: "16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Type</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Amount</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Price</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Total</th>
                                        <th style={{ padding: "16px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#0f172a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Completed</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#8b5cf6", fontWeight: 700 }}>
                                                ORD-COMP-001
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x5F4E...F6E
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#ef4444", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                sell
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                3,200
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0101
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $32.32
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                1h ago
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#8b5cf6", fontWeight: 700 }}>
                                                ORD-COMP-002
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x742d...bEb1
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                buy
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                2,500
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0098
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $24.50
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                2h ago
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#8b5cf6", fontWeight: 700 }}>
                                                ORD-COMP-003
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x1A2B...A0B
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#ef4444", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                sell
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                1,800
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0103
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $18.54
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                3h ago
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#8b5cf6", fontWeight: 700 }}>
                                                ORD-COMP-004
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x9F2d...C6E
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                buy
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                950
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0096
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $9.12
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                4h ago
                                            </span>
                                        </td>
                                    </tr>

                                    <tr style={{ borderBottom: "1px solid #f8fafc", transition: "all 0.2s" }} onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                                        <td style={{ padding: "16px" }}>
                                            <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#8b5cf6", fontWeight: 700 }}>
                                                ORD-COMP-005
                                            </code>
                                        </td>
                                        <td style={{ padding: "16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <code style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "12px", color: "#3b82f6", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px" }}>
                                                    0x8E7D...F6E
                                                </code>
                                                <button
                                                    class="copy-btn"
                                                    style={{ background: "#3b82f6", color: "white", border: "none", width: "28px", height: "28px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "center" }}>
                                            <span style={{ background: "#ef4444", color: "white", padding: "6px 16px", borderRadius: "6px", fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                sell
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 700 }}>
                                                1,100
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>
                                                $0.0099
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "15px", color: "#10b981", fontWeight: 700 }}>
                                                $10.89
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px", textAlign: "right" }}>
                                            <span style={{ fontFamily: "'JetBrains Mono', monospace, system-ui", fontSize: "13px", color: "#0f172a", opacity: 0.6, fontWeight: 600 }}>
                                                5h ago
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
