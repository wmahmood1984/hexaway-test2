import React from 'react'

export default function History({
    plan,duration,amount,statusText,timeRemaining,timestamp,statusColor,clickClaim,id
}) {
  return (
    <div>
      <div style={{background:"#f8fafc", padding:"16px", borderRadius:"12px", borderLeft:"4px solid #10b981"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px", flexWrap:"wrap"}}>
              <div style={{display:"flex", alignItems:"center", gap:"12px"}}><span style={{fontSize:"32px;"}}>🌿</span>
                <div><div style={{fontSize:"16px", fontWeight:"900"}}>{plan}</div><div style={{fontSize:"12px; opacity:0.7"}}>{duration}</div></div>
              </div>
              <div style={{textAlign:"right"}}><div style={{fontSize:"18px", color:"#10b981", fontWeight:"900"}}>${amount} HEXA</div>
              <div style={{fontSize:"12px", color:`${statusColor}`}}>{statusText}</div></div>
            </div>`;
          {statusText==='Active' ?
            <div style={{background:"rgba(16,185,129,0.2)", padding:"8px", borderRadius:"8px", marginBottom:"8px"}}>
                <div id="countdown-${idx}" style={{fontSize:"12px", color:"#10b981", fontWeight:"700", textAlign:"center"}}>⏱️ {timeRemaining} remaining</div></div>
            :statusText=="Completed"? <button 
            onClick={()=>{clickClaim(id)}}
            id="claimRewardsBtn" style={{background:"linear-gradient(135deg,#10b981,#059669)", color:"white", border:"none", padding:"16px 32px", borderRadius:"12px", cursor:"pointer", fontSize:"clamp(16px,3.5vw,18px)", fontWeight:"900", boxShadow:"0 8px 20px rgba(16,185,129,0.4)", minWidth:"40px", marginBottom:"8px"}}>🎁 Claim Reward</button>: null  
        }
          <div style={{fontSize:"10px", opacity:"0.6"}}>Staked on: {timestamp}</div></div>
    </div>
  )
}
