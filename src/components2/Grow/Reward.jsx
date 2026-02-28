import React from 'react'

export default function Reward({
rewardAmount,statusText,timestamp
}) {
    return (
        <div>
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #06b6d4" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}
                    ><span style={{ fontSize: "32px" }}>🌿</span><div>
                            <div style={{ fontWeight: "900" }}>${plan}</div>
                            <div style={{ fontSize: "12px" }}>1000 HEXA staked</div>
                        </div>
                    </div>
                    <div style={{textAlign:"right"}}><div style={{color:"#10b981", fontWeight:"900"}}>+{rewardAmount} HEXA</div>
                    <div style={{fontSize:"12px", color:`${statusColor}`}}>${statusText}</div></div>
                </div>
                <div style={{fontSize:"10px", opacity:"0.6", marginTop:"8px"}}>Started: ${timestamp}</div>
            </div>
        </div>
    )
}
