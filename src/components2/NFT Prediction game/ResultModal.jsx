import React from 'react'

export default function ResultModal({ result, show, onClose }) {
    const { resultEmoji, resultText, resultColor, selectedType, wagerVal, payout, won } = result


    return (
        show && (
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999
                }}
            >
                <div
                    className="popup-card-light"
                    style={{
                        borderColor: resultColor,
                        background: "#ffffff",
                        padding: "24px",
                        borderRadius: "20px",
                        width: "400px",
                        maxWidth: "90%",
                        textAlign: "center",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                    }}
                >
                    <div style={{ fontSize: "64px" }}>{resultEmoji}</div>

                    <div
                        style={{
                            fontSize: "32px",
                            fontWeight: 800,
                            color: resultColor
                        }}
                    >
                        {resultText}
                    </div>

                    <div
                        style={{
                            background: "#f8fafc",
                            borderRadius: "40px",
                            padding: "16px",
                            margin: "16px 0",
                            border: "1px solid #e2e8f0"
                        }}
                    >
                        <div style={{ color: "#64748b", fontSize: "14px" }}>
                            your pick
                        </div>

                        <div
                            style={{
                                fontSize: "28px",
                                fontWeight: 800,
                                color: resultColor
                            }}
                        >
                            {selectedType}
                        </div>

                        <div style={{ fontSize: "22px" }}>
                            {wagerVal} USDT
                        </div>

                        <div
                            style={{
                                fontSize: "24px",
                                fontWeight: 800,
                                marginTop: "10px",
                                color: resultColor
                            }}
                        >
                            {won ? "+" + payout : "0"}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: resultColor,
                            color: "#f8fafc",
                            padding: "12px 24px",
                            borderRadius: "40px",
                            fontWeight: 800,
                            fontSize: "16px",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        close
                    </button>
                </div>
            </div>
        )
    );

}
