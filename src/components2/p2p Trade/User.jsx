import React, { useEffect, useState } from 'react'
import "./User.css"
import { useAppKitAccount } from '@reown/appkit/react';
import { useDispatch, useSelector } from 'react-redux';
import { erc20abi, erc20Add, HexaContract, HEXAContractR, P2PAbi, P2PAdd, P2PContract, priceOracleContractR, usdtContract, web3 } from '../../config';
import { executeContract, formatWithCommas, secondsToDMY } from '../../utils/contractExecutor';
import { formatEther, parseEther } from 'ethers';
import { useConfig } from 'wagmi';
import { readName } from '../../slices/contractSlice';
import toast from 'react-hot-toast';

export default function User() {
    const {
        status, error
    } = useSelector((state) => state.contract);
    const { address } = useAppKitAccount();
    const config = useConfig()
    const dispatch = useDispatch()
    const usdtContract1 = new web3.eth.Contract(erc20abi, erc20Add)
    const P2PContract1 = new web3.eth.Contract(P2PAbi, P2PAdd)
    const [usdtBalance, setUsdtBalance] = useState(0)

    const [sellAmount, setSellAmount] = useState()
    const [walletBalance, setWalletBalance] = useState(0)
    const [price, setPrice] = useState(0.01)
    const [buyAmount, setBuyAmount] = useState(5 / price)
    const [loading, setLoading] = useState(false)
    const [buyOrders, setBuyOrders] = useState()
    const [fee, setFee] = useState(0)
    const [sellOrders, setSellOrders] = useState()
    const [Trades, setTrades] = useState()
    const [buyPercent, setBuyPercent] = useState(0);
    const [sellPercent, setSellPercent] = useState(0);


    useEffect(() => {

        const abc = async () => {
            const _usdtBalance = await usdtContract1.methods.balanceOf(address).call()
            setUsdtBalance(_usdtBalance)

            const _buyOrders = await P2PContract1.methods.getOrders(false).call()
            const _sellOrders = await P2PContract1.methods.getOrders(true).call()

            setBuyOrders(_buyOrders)
            setSellOrders(_sellOrders)

            const _fee = await P2PContract1.methods.fee().call()

            setFee(_fee)

            const _price = await priceOracleContractR.methods.price().call()
            setPrice(formatEther(_price))
            const _walletBalance = await HEXAContractR.methods.balanceOf(address).call()
                        console.log("fee", _walletBalance)
            setWalletBalance(formatEther(_walletBalance))

        }

        abc()
    }, [address, loading])



    useEffect(() => {
        const bringTransaction = async () => {
            const latestBlock = await web3.eth.getBlockNumber();
            const fromBlock = latestBlock - 200000;
            const step = 5000; // or smaller if node still complains
            let allEvents = [];

            for (let i = fromBlock; i <= latestBlock; i += step) {
                const toBlock = Math.min(i + step - 1, latestBlock);

                try {
                    const events = await P2PContract1.getPastEvents("Trades",

                        {

                            fromBlock: i,
                            toBlock: toBlock,
                        });
                    allEvents = allEvents.concat(events);
                    setTrades(allEvents)
                    // console.log(`Fetched ${events.length} events from ${i} to ${toBlock}`);
                } catch (error) {
                    console.warn(`Error fetching from ${i} to ${toBlock}`, error);
                }
            }

            // console.log("All events:", allEvents);
        };




        bringTransaction();

    }, [address]);



    const handleBuy2 = async () => {


        const value = parseEther(buyAmount.toString())
        console.log("object", value);
        await executeContract({
            config,
            functionName: "setBuyOrder",
            args: [value],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                toast.success("Trade made Successfully")
                setLoading(false)
            },
            contract: P2PContract,
            onError: (err) => {
                setLoading(false)

                toast.error("This Trade is not available")
            },
        });
    }





    const handleBuyOrder = async (id) => {
        if (buyAmount * price < 5) {
            toast.error("Purchase amount cannot be less than 5$")
            return
        }
            console.log("buy order",(buyAmount / price), Number(formatEther(usdtBalance)))
        if (Number(formatEther(usdtBalance))<(buyAmount * price)) {

            toast.error("Insufficient USDT balance")
            return
        }

        try {
            setLoading(true);



            ; // must match contract price
            const requiredUSDT = parseEther((Number(buyAmount)* Number(price)).toString())



            await executeContract({
                config,
                functionName: "approve",
                args: [P2PAdd, requiredUSDT],
                contract: usdtContract,
                onSuccess: () => handleBuy2(),
                onError: () => {
                    setLoading(false);
                    toast.error("Approval failed");
                }
            });

        } catch (err) {
            setLoading(false);
            toast.error("Unexpected error occurred");
            console.error(err);
        }
    };


    const handleSale2 = async () => {

        await executeContract({
            config,
            functionName: "setSaleOrder",
            args: [parseEther(sellAmount.toString())],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                toast.success("Trade made Successfully")
                setLoading(false)
            },
            contract: P2PContract,
            onError: (err) => {
                setLoading(false)

                toast.error("This Trade is not available")
            },
        });
    }





    const handleSale = async (id) => {
        if (sellAmount * price < 5) {
            toast.error("Sale amount cannot be less than 5$")
            return
        }

        if (Number(walletBalance) < Number(sellAmount)) {

            toast.error("Insufficient HEXA balance")
            return
        }

        try {
            setLoading(true);
            await executeContract({
                config,
                functionName: "approve",
                args: [P2PAdd, parseEther(sellAmount.toString())],
                contract: HexaContract,
                onSuccess: () => handleSale2(),
                onError: () => {
                    setLoading(false);
                    toast.error("Approval failed");
                }
            });

        } catch (err) {
            setLoading(false);
            toast.error("Unexpected error occurred");
            console.error(err);
        }
    };


    
    const handleCancel = async (id, type) => {

        await executeContract({
            config,
            functionName: "cancelOrder",
            args: [id, type],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                toast.success("Order Cancelled Successfully")
                setLoading(false)
            },
            contract: P2PContract,
            onError: (err) => {
                setLoading(false)

                toast.error("not cancelled")
            },
        });
    }




    const isLoading = !sellOrders || !buyOrders || !Trades



    const combinedOrders = sellOrders && buyOrders && [...sellOrders, ...buyOrders].filter(v => Number(formatEther(v.amount)) > Number(formatEther(v.amountFilled)) && v.user.toLowerCase() == address.toLowerCase())
    const buyOrders1 = buyOrders && buyOrders.filter(v => Number(formatEther(v.amount)) > Number(formatEther(v.amountFilled)))
    const saleOrders1 = sellOrders && sellOrders.filter(v => Number(formatEther(v.amount)) > Number(formatEther(v.amountFilled)))
    const myTrades = Trades && Trades.filter(v => v.returnValues.user.toLowerCase() === address.toLowerCase())

      console.log("first",{sellOrders,buyOrders,combinedOrders})


    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }



    return (
        <div>
            <div class="min-h-full w-full" style={{ background: "#f1f5f9" }}>
                <main style={{ maxWidth: "1600px", margin: "0 auto", padding: "32px 24px" }}>

                    <div class="glass-effect fade-in" style={{ padding: "28px 36px", borderRadius: "20px", border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)", marginBottom: "28px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            <div style={{ width: "70px", height: "70px", background: "linear-gradient(135deg, #3b82f6, #10b981)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(59, 130, 246, 0.25)" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
                                    <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <h1 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "36px", color: "#0f172a", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                                    Trade Exchange
                                </h1>
                                <p style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "15px", color: "#0f172a", opacity: 0.6, margin: "6px 0 0 0", fontWeight: 500 }}>
                                    HEXA/USDT
                                </p>
                            </div>
                        </div>
                    </div>


                    <div class="fade-in desktop-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
                        <div class="mobile-padding" style={{ background: "#ffffff", padding: "28px", borderRadius: "16px", border: "2px solid #3b82f6", boxShadow: "0 4px 16px rgba(59, 130, 246, 0.1)", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "48px", opacity: 0.1 }}>₿</div>
                            <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.6, marginBottom: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                                HEXA Balance
                            </div>
                            <div class="stat-value" style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "32px", color: "#3b82f6", fontWeight: 800, position: "relative", zIndex: 1 }}>
                                {formatWithCommas(walletBalance, 2)}
                            </div>
                            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(59, 130, 246, 0.2)" }}>
                                <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.5 }}>
                                    ≈ {formatWithCommas(walletBalance * price, 2)} USDT
                                </div>
                            </div>
                        </div>

                        <div class="mobile-padding" style={{ background: "#ffffff", padding: "28px", borderRadius: "16px", border: "2px solid #10b981", boxShadow: "0 4px 16px rgba(16, 185, 129, 0.1)", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "48px", opacity: 0.1 }}>💵</div>
                            <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.6, marginBottom: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                                USDT Balance
                            </div>
                            <div class="stat-value" style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "32px", color: "#10b981", fontWeight: 800, position: "relative", zIndex: 1 }}>
                                {formatWithCommas(formatEther(usdtBalance), 2)}
                            </div>
                            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(16, 185, 129, 0.2)" }}>
                                <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.5 }}>
                                    ≈ {formatWithCommas(formatEther(usdtBalance) / price, 2)} HEXA
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="desktop-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>


                        <div class="fade-in mobile-padding" style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.08)" }}>
                            <h2 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "24px", color: "#0f172a", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontSize: "28px" }}>📊</span>
                                Order Book
                            </h2>


                            <div style={{ marginBottom: "32px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "2px solid #ef4444" }}>
                                    <span style={{ fontSize: "20px" }}>📉</span>
                                    <h3 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "18px", color: "#ef4444", fontWeight: 700, margin: 0 }}>
                                        Sell Orders ({saleOrders1.length})
                                    </h3>
                                </div>

                                <div style={{ marginBottom: "12px", padding: "12px 16px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "10px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        <div>Price (USDT)</div>
                                        <div>Amount (HEXA)</div>
                                        <div>Total (USDT)</div>
                                    </div>
                                </div>

                                <div style={{ maxHeight: "300px", overflowY: "auto" }}>

                                    {saleOrders1.map((v, e) =>
                                        <div class="order-row sell-order" style={{ padding: "14px 16px", marginBottom: "8px", background: "#ffffff", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.2)", boxShadow: "0 2px 8px rgba(239, 68, 68, 0.05)" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", alignItems: "center", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px" }}>
                                                <div class="stat-value" style={{ color: "#ef4444", fontWeight: 700 }}>{Number(formatEther(v.price)).toFixed(2)}</div>
                                                <div class="stat-value" style={{ color: "#0f172a", fontWeight: 600 }}>{Number(formatEther(v.amount)) - Number(formatEther(v.amountFilled))}</div>
                                                <div class="stat-value" style={{ color: "#0f172a", opacity: 0.7, fontWeight: 500 }}>{Number((Number(formatEther(v.amount)) - Number(formatEther(v.amountFilled))) * Number(formatEther(v.price))).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    )}


                                </div>
                            </div>

                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "2px solid #10b981" }}>
                                    <span style={{ fontSize: "20px" }}>📈</span>
                                    <h3 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "18px", color: "#10b981", fontWeight: 700, margin: 0 }}>
                                        Buy Orders ({buyOrders1.length})
                                    </h3>
                                </div>

                                <div style={{ marginBottom: "12px", padding: "12px 16px", background: "rgba(16, 185, 129, 0.05)", borderRadius: "10px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        <div>Price (USDT)</div>
                                        <div>Amount (HEXA)</div>
                                        <div>Total (USDT)</div>
                                    </div>
                                </div>

                                <div style={{ maxHeight: "300px", overflowY: "auto" }}>

                                    {buyOrders1.map((v, e) =>
                                        <div class="order-row buy-order" style={{ padding: "14px 16px", marginBottom: "8px", background: "#ffffff", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.05)" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", alignItems: "center", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px" }}>
                                                <div class="stat-value" style={{ color: "#10b981", fontWeight: 700 }}>{Number(formatEther(v.price)).toFixed(2)}</div>
                                                <div class="stat-value" style={{ color: "#0f172a", fontWeight: 600 }}>{Number(formatEther(v.amount)) - Number(formatEther(v.amountFilled))}</div>
                                                <div class="stat-value" style={{ color: "#0f172a", opacity: 0.7, fontWeight: 500 }}>{Number((Number(formatEther(v.amount)) - Number(formatEther(v.amountFilled))) * Number(formatEther(v.price))).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div class="fade-in mobile-padding" style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.08)" }}>
                            <h2 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "24px", color: "#0f172a", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontSize: "28px" }}>💹</span>
                                Trade Panel
                            </h2>

                            <div style={{ marginBottom: "28px", padding: "24px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02))", borderRadius: "16px", border: "2px solid #10b981" }}>
                                <h3 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "20px", color: "#10b981", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "24px" }}>📈</span>
                                    Buy HEXA
                                </h3>

                                <div>
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ display: "block", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 600, marginBottom: "8px" }}>
                                            Price (USDT) - Market Price
                                        </label>
                                        <div style={{ width: "100%", padding: "14px 16px", border: "2px solid rgba(16, 185, 129, 0.3)", borderRadius: "10px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "15px", fontWeight: 700, background: "rgba(16, 185, 129, 0.05)", color: "#10b981" }}>
                                            {price}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{
                                            display: "block",
                                            fontFamily: "'Poppins', system-ui, sans-serif",
                                            fontSize: "14px",
                                            color: "#0f172a",
                                            fontWeight: 600,
                                            marginBottom: "8px"
                                        }}>
                                            Amount (HEXA)
                                        </label>

                                        <input
                                            value={(buyAmount)}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                
                                                setBuyAmount(value);

                                                if (!value || !price) {
                                                    setBuyPercent(0);
                                                    return;
                                                }

                                                const usedUSDT = value * price;
                                                const percent = (usedUSDT / Number(formatEther(usdtBalance))) * 100;
                                                setBuyPercent(Math.min(100, Math.max(0, percent)));
                                            }}
                                            type="number"
                                            step="0.0001"
                                            placeholder="Enter amount"
                                            style={{
                                                width: "100%",
                                                padding: "14px 16px",
                                                border: "2px solid rgba(16, 185, 129, 0.3)",
                                                borderRadius: "10px",
                                                fontFamily: "'Poppins', system-ui, sans-serif",
                                                fontSize: "15px",
                                                fontWeight: 600
                                            }}
                                        />

                                        {/* Slider */}
                                        <div style={{ marginTop: "14px" }}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={buyPercent}
                                                onChange={(e) => {
                                                    const percent = Number(e.target.value);
                                                    setBuyPercent(percent);

                                                    const usdt = Number(formatEther(usdtBalance));
                                                    const amount = ((usdt * percent) / 100) / price;
                                                    setBuyAmount(amount.toFixed(4));
                                                }}
                                                style={{ width: "100%" }}
                                            />

                                            <div style={{
                                                marginTop: "6px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                color: "#10b981",
                                                textAlign: "right"
                                            }}>
                                                {buyPercent.toFixed(0)}%
                                            </div>
                                        </div>
                                    </div>


                                    <div style={{ marginBottom: "20px", padding: "16px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                                        <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                            Total (USDT)
                                        </div>
                                        <div class="stat-value" style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "22px", color: "#10b981", fontWeight: 800 }}>
                                            {buyAmount ? buyAmount * price : 0}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBuyOrder}
                                        class="trade-button"
                                        style={{ width: "100%", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "16px", borderRadius: "12px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "17px", fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                                    >
                                        <span style={{ fontSize: "20px" }}>🛒</span>
                                        <span>Place Buy Order</span>
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: "24px", background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.02))", borderRadius: "16px", border: "2px solid #ef4444" }}>
                                <h3 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "20px", color: "#ef4444", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "24px" }}>📉</span>
                                    Sell HEXA
                                </h3>

                                <div>
                                    {/* <div style={{ marginBottom: "16px" }}>
                                        <label style={{ display: "block", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 600, marginBottom: "8px" }}>
                                            Price (USDT) - Market Price
                                        </label>
                                        <div style={{ width: "100%", padding: "14px 16px", border: "2px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "15px", fontWeight: 700, background: "rgba(239, 68, 68, 0.05)", color: "#ef4444" }}>
                                            {price}
                                        </div>
                                    </div> */}

                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{
                                            display: "block",
                                            fontFamily: "'Poppins', system-ui, sans-serif",
                                            fontSize: "14px",
                                            color: "#0f172a",
                                            fontWeight: 600,
                                            marginBottom: "8px"
                                        }}>
                                            Amount (HEXA)
                                        </label>

                                        <input
                                            value={sellAmount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSellAmount(value);

                                                if (!value || !walletBalance) {
                                                    setSellPercent(0);
                                                    return;
                                                }

                                                const percent = (value / walletBalance) * 100;
                                                setSellPercent(Math.min(100, Math.max(0, percent)));
                                            }}
                                            type="number"
                                            step="0.0001"
                                            placeholder="Enter amount"
                                            style={{
                                                width: "100%",
                                                padding: "14px 16px",
                                                border: "2px solid rgba(239, 68, 68, 0.3)",
                                                borderRadius: "10px",
                                                fontFamily: "'Poppins', system-ui, sans-serif",
                                                fontSize: "15px",
                                                fontWeight: 600
                                            }}
                                        />

                                        {/* Slider */}
                                        <div style={{ marginTop: "14px" }}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={sellPercent}
                                                onChange={(e) => {
                                                    const percent = Number(e.target.value);
                                                    setSellPercent(percent);

                                                    const amount = (walletBalance * percent) / 100;
                                                    setSellAmount(amount.toFixed(4));
                                                }}
                                                style={{ width: "100%" }}
                                            />

                                            <div style={{
                                                marginTop: "6px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                                color: "#ef4444",
                                                textAlign: "right"
                                            }}>
                                                {sellPercent.toFixed(0)}%
                                            </div>
                                        </div>
                                    </div>


                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ display: "block", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px", color: "#0f172a", fontWeight: 600, marginBottom: "8px" }}>
                                            Amount (HEXA)
                                        </label>
                                        <div style={{ position: "relative" }}>
                                            <input
                                                value={sellAmount}
                                                onChange={(e) => { setSellAmount(e.target.value) }}
                                                type="number"
                                                step="0.0001"
                                                placeholder="Enter amount"
                                                style={{ width: "100%", padding: "14px 80px 14px 16px", border: "2px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "15px", fontWeight: 600, outline: "none", background: "#ffffff", color: "#0f172a" }}
                                            />
                                            <button
                                                onClick={() => (setSellAmount(walletBalance))}
                                                style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "#ef4444", color: "white", padding: "8px 16px", borderRadius: "6px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase" }}
                                                onmouseover="this.style.background='#dc2626'"
                                                onmouseout="this.style.background='#ef4444'"
                                            >
                                                MAX
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: "20px", padding: "16px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                                        <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.7, marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                            Total (USDT)
                                        </div>
                                        <div class="stat-value" style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "22px", color: "#ef4444", fontWeight: 800 }}>
                                            {sellAmount ? Number(sellAmount * price * (1 - fee / 100)).toFixed(2) : 0}
                                        </div>
                                        <p
                                            style={{ fontSize: "10px" }}
                                        >{fee}% fee will be applicable on sale</p>
                                    </div>

                                    <button
                                        onClick={handleSale}
                                        class="trade-button"
                                        style={{ width: "100%", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", padding: "16px", borderRadius: "12px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "17px", fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                                    >
                                        <span style={{ fontSize: "20px" }}>💰</span>
                                        <span>Place Sell Order</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="fade-in mobile-padding" style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.08)", marginBottom: "28px" }}>
                        <h2 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "24px", color: "#0f172a", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>🕒</span>
                            Current Trades
                            <span style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px", color: "#0f172a", opacity: 0.5, fontWeight: 600, marginLeft: "auto" }}>

                            </span>
                        </h2>

                        <div class="mobile-scroll" style={{ overflowX: "auto" }}>
                            <div style={{ minWidth: "600px" }}>
                                <div style={{ marginBottom: "12px", padding: "12px 16px", background: "rgba(59, 130, 246, 0.05)", borderRadius: "10px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1.2fr 1.2fr 1fr", gap: "12px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        <div>Type</div>
                                        <div>Price</div>
                                        <div>Amount</div>
                                        <div>Total</div>
                                        <div>Time</div>
                                    </div>
                                </div>

                                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    {Trades.map((v, e) => {
                                        if (e < 20) {
                                            return (
                                                <div style={{ padding: "14px 16px", marginBottom: "8px", background: "#ffffff", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.05)", borderLeft: "3px solid #10b981" }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1.2fr 1.2fr 1fr", gap: "12px", alignItems: "center", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px" }}>
                                                        <div>
                                                            <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                                {v.returnValues._type ? "Sell" : "Buy"}
                                                            </span>
                                                        </div>
                                                        <div class="stat-value" style={{ color: "#10b981", fontWeight: 700 }}>
                                                            0.01
                                                        </div>
                                                        <div class="stat-value" style={{ color: "#0f172a", fontWeight: 600 }}>
                                                            {formatWithCommas(formatEther(v.returnValues.tradeAmount))} HEXA
                                                        </div>
                                                        <div class="stat-value" style={{ color: "#0f172a", opacity: 0.7, fontWeight: 500 }}>
                                                            {Number(formatEther(v.returnValues.tradeAmount)) * price} USDT
                                                        </div>
                                                        <div style={{ color: "#0f172a", opacity: 0.5, fontSize: "12px", fontWeight: 500 }}>
                                                            {secondsToDMY(v.returnValues.time)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }


                                    )

                                    }



                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="fade-in mobile-padding" style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.08)", marginBottom: "28px" }}>
                        <h2 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "24px", color: "#0f172a", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>📋</span>
                            My Open Orders
                            <span style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px", color: "#0f172a", opacity: 0.5, fontWeight: 600, marginLeft: "auto" }}>
                                {combinedOrders.length} Active
                            </span>
                        </h2>

                        <div class="mobile-scroll" style={{ overflowX: "auto" }}>
                            <div style={{ minWidth: "700px" }}>
                                <div style={{ marginBottom: "12px", padding: "12px 16px", background: "rgba(59, 130, 246, 0.05)", borderRadius: "10px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1.2fr 1.2fr 1.2fr 1fr 1fr", gap: "12px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        <div>Type</div>
                                        <div>Price</div>
                                        <div>Amount</div>
                                        <div>Amount Filled</div>
                                        <div>Total</div>
                                        <div>Time</div>
                                        <div></div>
                                    </div>
                                </div>

                                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    {combinedOrders.map((v, e) =>
                                        <div style={{ padding: "14px 16px", marginBottom: "8px", background: "#ffffff", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.05)", borderLeft: "3px solid #10b981" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1.2fr 1.2fr 1.2fr 1fr 1fr", gap: "12px", alignItems: "center", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px" }}>
                                                <div>
                                                    <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                        {v._type ? "Sell" : "Buy"}
                                                    </span>
                                                </div>
                                                <div class="stat-value" style={{ color: "#10b981", fontWeight: 700 }}>
                                                    {Number(formatEther(v.price))}
                                                </div>
                                                <div class="stat-value" style={{ color: "#0f172a", fontWeight: 600 }}>
                                                    {formatWithCommas(formatEther(v.amount), 2)} HEXA
                                                </div>
                                                <div class="stat-value" style={{ color: "#0f172a", fontWeight: 600 }}>
                                                    {formatWithCommas(formatEther(v.amountFilled), 2)} HEXA
                                                </div>
                                                <div class="stat-value" style={{ color: "#0f172a", opacity: 0.7, fontWeight: 500 }}>
                                                    {Number(formatEther(v.price) * Number(formatEther(v.amount)))} USDT
                                                </div>
                                                <div style={{ color: "#0f172a", opacity: 0.5, fontSize: "12px", fontWeight: 500 }}>
                                                    {secondsToDMY(v.time)}
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => { handleCancel(v.id, v._type) }}
                                                        style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", padding: "8px 16px", borderRadius: "8px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                                                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.3)'"
                                                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                                                    >
                                                        <span>❌</span>
                                                        <span>Cancel</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )

                                    }

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="fade-in mobile-padding" style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.08)", marginBottom: "28px" }}>
                        <h2 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "24px", color: "#0f172a", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>🕒</span>
                            My Trade History
                            <span style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px", color: "#0f172a", opacity: 0.5, fontWeight: 600, marginLeft: "auto" }}>
                                {myTrades.length} Trades
                            </span>
                        </h2>

                        <div class="mobile-scroll" style={{ overflowX: "auto" }}>
                            <div style={{ minWidth: "600px" }}>
                                <div style={{ marginBottom: "12px", padding: "12px 16px", background: "rgba(59, 130, 246, 0.05)", borderRadius: "10px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1.2fr 1.2fr 1fr", gap: "12px", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "12px", color: "#0f172a", opacity: 0.6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        <div>Type</div>
                                        <div>Price</div>
                                        <div>Amount</div>
                                        <div>Total</div>
                                        <div>Time</div>
                                    </div>
                                </div>

                                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    {myTrades.map((v, e) =>
                                        <div style={{ padding: "14px 16px", marginBottom: "8px", background: "#ffffff", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.05)", borderLeft: "3px solid #10b981" }}>
                                            <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1.2fr 1.2fr 1fr", gap: "12px", alignItems: "center", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px" }}>
                                                <div>
                                                    <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                        {v.returnValues._type ? "Sell" : "Buy"}
                                                    </span>
                                                </div>
                                                <div class="stat-value" style={{ color: "#10b981", fontWeight: 700 }}>
                                                    0.01
                                                </div>
                                                <div class="stat-value" style={{ color: "#0f172a", fontWeight: 600 }}>
                                                    {formatWithCommas(formatEther(v.returnValues.tradeAmount))} HEXA
                                                </div>
                                                <div class="stat-value" style={{ color: "#0f172a", opacity: 0.7, fontWeight: 500 }}>
                                                    {Number(formatEther(v.returnValues.tradeAmount)) * price} USDT
                                                </div>
                                                <div style={{ color: "#0f172a", opacity: 0.5, fontSize: "12px", fontWeight: 500 }}>
                                                    {secondsToDMY(v.returnValues.time)}
                                                </div>
                                            </div>
                                        </div>

                                    )

                                    }


                                    {/* <div style={{ padding: "14px 16px", marginBottom: "8px", background: "#ffffff", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.2)", boxShadow: "0 2px 8px rgba(239, 68, 68, 0.05)", borderLeft: "3px solid #ef4444" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1.2fr 1.2fr 1fr", gap: "12px", alignItems: "center", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px" }}>
                                            <div>
                                                <span style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                    sell
                                                </span>
                                            </div>
                                            <div class="stat-value" style={{ color: "#ef4444", fontWeight: 700 }}>
                                                0.01
                                            </div>
                                            <div class="stat-value" style={{ color: "#0f172a", fontWeight: 600 }}>
                                                150.0000 HEXA
                                            </div>
                                            <div class="stat-value" style={{ color: "#0f172a", opacity: 0.7, fontWeight: 500 }}>
                                                1.52 USDT
                                            </div>
                                            <div style={{ color: "#0f172a", opacity: 0.5, fontSize: "12px", fontWeight: 500 }}>
                                                8:45 AM
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: "14px 16px", marginBottom: "8px", background: "#ffffff", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)", boxShadow: "0 2px 8px rgba(16, 185, 129, 0.05)", borderLeft: "3px solid #10b981" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr 1.2fr 1.2fr 1fr", gap: "12px", alignItems: "center", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "14px" }}>
                                            <div>
                                                <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                                                    buy
                                                </span>
                                            </div>
                                            <div class="stat-value" style={{ color: "#10b981", fontWeight: 700 }}>
                                                0.01
                                            </div>
                                            <div class="stat-value" style={{ color: "#0f172a", fontWeight: 600 }}>
                                                500.0000 HEXA
                                            </div>
                                            <div class="stat-value" style={{ color: "#0f172a", opacity: 0.7, fontWeight: 500 }}>
                                                4.90 USDT
                                            </div>
                                            <div style={{ color: "#0f172a", opacity: 0.5, fontSize: "12px", fontWeight: 500 }}>
                                                7:30 AM
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
