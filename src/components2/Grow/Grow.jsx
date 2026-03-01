import { useAppKitAccount } from '@reown/appkit/react';
import React, { useEffect, useState } from 'react'
import { useConfig } from 'wagmi';
import Stake from './Stake';
import { growFundAdd, growFundContract, growFundContractR, HexaContract, HEXAContractR, priceOracleContractR, USDTContractR } from '../../config';
import { executeContract, tn } from '../../utils/contractExecutor';
import toast from 'react-hot-toast';
import { parseEther } from 'ethers';

export default function Grow() {
    const config = useConfig()
    const { address } = useAppKitAccount();
    const [activeTab, setActiveTab] = useState("1");
    const [price, setPrice] = useState("0.01");
    const [hexaBalance, setHexaBalance] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [totalEarned, setTotalEarned] = useState(0)
    const [usdtBalance, setUsdtBalance] = useState(0)
    const [ticket, setTicket] = useState()
    const [stakeDone, setStakeDone] = useState(0)
        const [stakeDoneTime, setStakeDoneTime] = useState(0)

    const [stakeDone2, setStakeDone2] = useState(0)
    const [stakeDone3, setStakeDone3] = useState(0)
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        abc()
    }, [loading])

    useEffect(() => {
        fetchTickets()
    }, [loading,activeTab])

    const fetchTickets = async ()=>{
        const ticket = await growFundContractR.methods.getTicketsByUser(address,activeTab).call()
            setTicket(ticket)
    }

    const abc = async () => {
        try {
            const price = await priceOracleContractR.methods.price().call()
            setPrice(tn(price))
            const balance = await HEXAContractR.methods.balanceOf(address).call()
            setHexaBalance(tn(balance))
            const staked = await growFundContractR.methods.totalStaked().call()
            setTotalStaked(tn(staked))
            const earned = await growFundContractR.methods.totalEarned().call()
            setTotalEarned(tn(earned))
            const usdtBal = await USDTContractR.methods.balanceOf(address).call()
            setUsdtBalance(tn(usdtBal))

            const _stakeDoneTime = await growFundContractR.methods.stakeDoneTime().call()
            setStakeDoneTime(_stakeDoneTime)
           

            const _stakeDone = await growFundContractR.methods.stakeDone(1).call()

            setStakeDone(_stakeDone)

            const _stakeDone2 = await growFundContractR.methods.stakeDone(2).call()
            setStakeDone2(_stakeDone2)


            const _stakeDone3 = await growFundContractR.methods.stakeDone(3).call()
            setStakeDone3(_stakeDone3)
            console.log("stake",{_stakeDone,_stakeDone2,_stakeDone3})
        } catch (error) {
            console.log("error in abc",error)            
        }
    }


    const onDepositClick1 = async (id) => {


        try {
            setLoading(true);

            await executeContract({
                config,
                contract: growFundContract,
                functionName: "stake",
                args: [id],
                onSuccess: (txHash, receipt) => {
                    console.log("🎉 Tx Hash:", txHash);
                    console.log("🚀 Tx Receipt:", receipt);
                    toast.success("Stake successful");
                    abc()
                    fetchTickets()
                },
                onError: (err) => {
                    console.error("🔥 Stake error:", err);
                    toast.error("Stake failed");
                },
            });
        } finally {
            setLoading(false);
        }
    };


    const onDepositClick = async (id) => {


        if (
            Number(hexaBalance) < 1000
        ) {
            toast.error("Insufficient HEXA Balance")
            return
        }



        try {
            setLoading(true);
            await executeContract({
                config,
                functionName: "approve",
                args: [growFundAdd, parseEther("1000")],
                contract: HexaContract,
                onSuccess: () => onDepositClick1(id),
                onError: () => {
                    setLoading(false);
                    // toast.error("Approval failed");
                }
            });

        } catch (err) {
            setLoading(false);
            toast.error("Unexpected error occurred");
            console.error(err);
        }
    };

    const clickClaim = async (id) => {




        try {
            setLoading(true);
            await executeContract({
                config,
                functionName: "claim",
                args: [id],
                contract: growFundContract,
                onSuccess: (txHash, receipt) => {
                    console.log("🎉 Tx Hash:", txHash);
                    console.log("🚀 Tx Receipt:", receipt);
                    toast.success("Claim successful");
                    fetchTickets()
                    abc()
                },
                onError: () => {
                    setLoading(false);
                    // toast.error("Approval failed");
                }
            });

        } catch (err) {
            setLoading(false);
            toast.error("Unexpected error occurred");
            console.error(err);
        }
    };



    const isLoading = !ticket

    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }

    let myTotalStaked = ticket.reduce((sum, t) => {
        return Number(sum) + Number(tn(t.amount));
    }, 0)

    let myTotalEarned = ticket.reduce((sum, t) => {
        const reward = Number(tn(t.claimable))-Number(tn(t.amount))
         return Number(sum) + Number(reward);
}, 0)
    return (
        <div>
            <div>
                <div className="flex gap-4 mb-6">

                </div>

                {activeTab === "1" && <Stake
                    onClick={() => onDepositClick(1)}
                    stakeDoneTime={stakeDoneTime}
                    textShadow={"0 4px 20px #f59e0b"}
                    setActiveTab={setActiveTab}
                    days={10}
                    activeTab={activeTab}
                    earn={70}
                    border={"3px solid #f59e0b"}
                    background={"linear-gradient(135deg,#ffffff,rgba(245,158,11,0.2))"}
                    color={"#f59e0b"}
                    background1={"linear-gradient(135deg,#f59e0b,#d97706)"}
                    price={price}
                    totalStaked={myTotalStaked}
                    totalEarned={myTotalEarned}
                    hexaBalance={hexaBalance}
                    usdtBalance={usdtBalance}
                    ticket={ticket}
                    stakeDone={stakeDone}
                    clickClaim={clickClaim}
                />}
                {activeTab === "2" && <Stake
                    onClick={() => onDepositClick(2)}
                    textShadow={"0 4px 20px #10b981"}
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                    stakeDoneTime={stakeDoneTime}
                    days={20}
                    earn={160}
                    color={"#10b981"}
                    background={"linear-gradient(135deg,#ffffff,rgba(16,185,129,0.2))"}
                    border={"3px solid #10b981"}
                    background1={"linear-gradient(135deg,#10b981,#059669)"}
                    price={price}
                    totalStaked={myTotalStaked}
                    totalEarned={myTotalEarned}
                    hexaBalance={hexaBalance}
                    usdtBalance={usdtBalance}
                    ticket={ticket}
                    stakeDone={stakeDone2}
                    clickClaim={clickClaim}
                />}

                {activeTab === "3" && <Stake
                    onClick={() => onDepositClick(3)}
                    textShadow={"0 4px 20px #8b5cf6"}
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                    stakeDoneTime={stakeDoneTime}
                    days={30}
                    earn={300}
                    stakeDone={stakeDone3}
                    border={"3px solid #8b5cf6"}
                    color={"#8b5cf6"}
                    background1={"linear-gradient(135deg,#8b5cf6,#7c3aed)"}
                    background={"linear-gradient(135deg,#ffffff,rgba(139,92,246,0.2))"}
                    price={price}
                    totalStaked={myTotalStaked}
                    totalEarned={myTotalEarned}
                    hexaBalance={hexaBalance}
                    usdtBalance={usdtBalance}
                    ticket={ticket}
                    clickClaim={clickClaim}
                />}



            </div>
        </div>
    )
}
