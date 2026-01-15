import { act, use, useEffect, useState } from "react";
import { helperAbi, helperAddress, helperv2, helperv2Abi, packageKeys, web3 } from "../config";
import { formatAddress, formatDate } from "../utils/contractExecutor";

export default function UserCard({
    number, address,
    wallet,
    joined,
    referredBy,
    tags,key,
    teamCount,
}) {

    const [user, setUser] = useState(null);
    const [joiningTime, setJoiningTime] = useState(null);
    const [userPackage, setPackage] = useState(null);
    const [userTradingTime, setUserTradingTime] = useState(0);
    const contract = new web3.eth.Contract(helperv2Abi, helperv2)

    useEffect(() => {
        const abc = async () => {
            try {
                const res = await contract.methods.getUser(address).call();
                // const _joiningTime = await contract.methods.userJoiningTime(address).call();
                const _userpackage = await contract.methods.userPackage(address).call();
                // const _userTradingTime = await contract.methods.userTradingTime(address).call();
                setUserTradingTime(res.data.userTradingTime)
                setPackage(_userpackage);
                setJoiningTime(res.data.userJoiningTime);
                setUser(res);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        }


        abc()

    }, [])

    const isLoading = !user || !userPackage || !joiningTime;

    const active = new Date().getTime() / 1000 - userTradingTime < 60*60*24*48 ? "Active":"Inactive";


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
        <div
            className="
        bg-white rounded-2xl p-5 mb-4 shadow-sm 
        border border-gray-100 
        hover:shadow-md hover:-translate-y-1 transition duration-200
      "
        >
            <div className="flex justify-between items-start">
                {/* Left section */}
                <div className="flex items-center gap-4">
                    {/* Circle number */}
                    <div
                        className="
              w-14 h-14 rounded-full 
              bg-gradient-to-br from-purple-400 to-indigo-500
              flex justify-center items-center text-white font-bold text-lg
            "
                    >
                        {number}
                    </div>

                    {/* Wallet + joined */}
                    <div>
                        <div className="font-semibold text-gray-800">{`${address?.slice(0, 4)}...${address?.slice(-4)}`}</div>
                        <div className="text-sm text-gray-500">Joined: {joined}: {Number(joiningTime) > 0 ? formatDate(joiningTime) : "Not known"} </div>
                    </div>
                </div>

                {/* Right section tags */}
                <div className="flex flex-col gap-2 items-end">
                    {/* {tags?.map((tag, idx) => ( */}
                        <span

                            className="
                text-xs px-3 py-1 rounded-full 
                font-medium text-white 
                flex items-center gap-1
              "
                            style={{
                                background: tags[0].color,
                            }}
                        >
                            {tags[0].icon} {packageKeys[userPackage.id].name}
                        </span>

                                                <span

                            className="
                text-xs px-3 py-1 rounded-full 
                font-medium text-white 
                flex items-center gap-1
              "
                            style={{
                                background: tags[1].color,
                            }}
                        >
                            {tags[1].icon} Trade: {active}
                        </span>
                    {/* ))} */}

                    {/* Team badge */}
                    <span
                        className="
              text-xs px-3 py-1 rounded-full 
              bg-blue-100 text-blue-700 font-semibold 
              flex items-center gap-1
            "
                    >
                        👥 Team: {user.indirect.length}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Referred by */}
            <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">↗ Referred by:</span>
                <span className="font-semibold text-gray-800">{formatAddress(user.referrer)}</span>
            </div>
        </div>
    );
}
