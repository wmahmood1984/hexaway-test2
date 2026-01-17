import React from 'react'

export default function Admin_staking() {
  return (
    <div>
        <div id="app" class="h-full w-full overflow-auto">
    
    <nav
      style={{ background: "#f8fafc", padding: "20px 0", borderBottom: "2px solid rgba(99, 102, 241, 0.3)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div
        style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            🎨
          </div>
          <span
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "20px", color: "#1e293b", fontWeight: 700 }}>
            HEXA
          </span>
        </div>

      </div>
    </nav>

    
    <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "32px", color: "#1e293b", fontWeight: 700, marginBottom: "8px" }}>
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
        <p
          style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "16px", color: "#1e293b", opacity: 0.7 }}>
          Overview of Staking and analytics
        </p>
      </div>

      
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginBottom: "40px" }}>
        <div
          style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "2px solid rgba(99, 102, 241, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", opacity: 0.7, marginBottom: "8px" }}>
            Total Stakers
          </div>
          <div
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "40px", color: "#6366f1", fontWeight: 700 }}>
            3
          </div>
        </div>




        <div
          style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "2px solid rgba(139, 92, 246, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", opacity: 0.7, marginBottom: "8px" }}>
            Total Staking Value
          </div>
          <div
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "40px", color: "#8b5cf6", fontWeight: 700 }}>
            $24,150.00
          </div>
        </div>
      </div>

      
      <div
        style={{ background: "#f8fafc", padding: "32px", borderRadius: "12px", border: "2px solid rgba(99, 102, 241, 0.3)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "24px", color: "#1e293b", fontWeight: 700 }}>
            Recent Transfers
          </h2>

        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  User Address</th>

                <th
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Staking Amount</th>

                <th
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Token Price</th>
                <th
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Token Staked</th>
                <th
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Date</th>


              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>0x742d...bEb</span>
                    <button class="copy-btn" onclick="copyAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', event)"
                      style={{ color: "#6366f1" }} title="Copy full address">
                      📋
                    </button>
                  </div>
                </td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  $2,500.00</td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  3.5</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#8b5cf6", fontWeight: 600 }}>
                  1,250</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Jan 15, 2024</td>

              </tr>
              <tr>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>0x8a90...f6a5</span>
                    <button class="copy-btn" onclick="copyAddress('0x8a90f4e29c2a75a7c8d9b6e4f3c2a1b0d8e7f6a5', event)"
                      style={{ color: "#6366f1" }} title="Copy full address">
                      📋
                    </button>
                  </div>
                </td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  $3,200.00</td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  3.5</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#8b5cf6", fontWeight: 600 }}>
                  1,580</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Jan 18, 2024</td>

              </tr>
              <tr>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>0x1b2c...b0c</span>
                    <button class="copy-btn" onclick="copyAddress('0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c', event)"
                      style={{ color: "#6366f1" }} title="Copy full address">
                      📋
                    </button>
                  </div>
                </td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  $1,800.00</td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  3.5</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#8b5cf6", fontWeight: 600 }}>
                  3,232</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Jan 28, 2024</td>

              </tr>
              <tr>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>0x5e4d...f7e6d</span>
                    <button class="copy-btn" onclick="copyAddress('0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d', event)"
                      style={{ color: "#6366f1" }} title="Copy full address">
                      📋
                    </button>
                  </div>
                </td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  $4,100.00</td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  3.5</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#8b5cf6", fontWeight: 600 }}>
                  2,120</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Jan 10, 2024</td>

              </tr>
              <tr>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>0x9f8e...f0e</span>
                    <button class="copy-btn" onclick="copyAddress('0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e', event)"
                      style={{ color: "#6366f1" }} title="Copy full address">
                      📋
                    </button>
                  </div>
                </td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  $2,900.00</td>

                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b", fontWeight: 600 }}>
                  3.5</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#8b5cf6", fontWeight: 600 }}>
                  2,333</td>
                <td
                  style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: "14px", color: "#1e293b" }}>
                  Feb 1, 2024</td>


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
