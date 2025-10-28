
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers, formatEther } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { executeContract } from "./utils/contractExecutor";
import { mlmcontractaddress, usdtContract } from "./config";
import { useState } from "react";
import { useConfig } from "wagmi";
import { readName } from "./slices/contractSlice";
import { Image } from "./NFTGrid";
import MintModal from "./components/MintModal";
//import { saveRelationship } from "./utils/saveRelationship";

const ProfileSection = () => {
    const config = useConfig()
    const { Package, myNFTs, packages, downlines, registered, admin, allowance, NFTQueBalance, limitUtilized, NFTque

        ,levelIncome,
        referralIncome,
        tradingIncome,
        status, error
} = useSelector((state) => state.contract);
const { address } = useAppKitAccount();
const [referrer, setReferrer] = useState()
const dispatch = useDispatch()

const handleRegister2 = async () => {
    await executeContract({
        config,
        functionName: "register",
        args: [referrer ? referrer : admin],
        onSuccess: (txHash, receipt) => {
            console.log("🎉 Tx Hash:", txHash);
            console.log("🚀 Tx Receipt:", receipt);
            dispatch(readName({ address: receipt.from }));
            updatetree()
        },
        onError: (err) => {
            console.error("Registration failed:", err);
        },
    });
};

 const updatetree = async (e) => {
    e.preventDefault();

    // Example children: comma separated -> split into array
 
//    const res = await saveRelationship(address, parent, childArray);

  //  if (res) alert("Saved successfully!");
  };




const handleRegister = async () => {
    if (allowance >= packages[0].price) {
        handleRegister2()
    } else {
        await executeContract({
            config,
            functionName: "approve",
            args: [mlmcontractaddress, packages[0].price],
            onSuccess: () => handleRegister2(),
            onError: (err) => alert("Transaction failed", err),
            contract: usdtContract
        });
    }


};



const handleUpdate2 = async (id) => {
    await executeContract({
        config,
        functionName: "buyPackage",
        args: [id],
        onSuccess: (txHash, receipt) => {
            console.log("🎉 Tx Hash:", txHash);
            console.log("🚀 Tx Receipt:", receipt);
            dispatch(readName({ address: receipt.from }));
        },
        onError: (err) => {
            console.error("🔥 Error in register:", err);
            alert("Transaction failed");
        },
    });
};




const handleUpdate = async (pkg) => {
    // if (allowance >= pkg.price) {
    //     handleUpdate2(pkg.id)
    // } else {
    await executeContract({
        config,
        functionName: "approve",
        args: [mlmcontractaddress, pkg.price],
        onSuccess: () => handleUpdate2(pkg.id),
        onError: (err) => alert("Transaction failed", err),
        contract: usdtContract
    });
    //}


};

const normalizedAddr = address && address.toLowerCase();
const normalizedQue = NFTque.map(a => a.toLowerCase());

const NFTQueStatus = normalizedQue.indexOf(normalizedAddr) < 0
    ? "Not in the Que"
    : normalizedQue.indexOf(normalizedAddr) + 1;

const NFTQuebalance1 = normalizedQue.indexOf(normalizedAddr) !== 0
    ? "0"
    : formatEther(NFTQueBalance);

console.log("nft",downlines)
return (status === "loading" ? <p className="text-gray-600">Loading...</p> :
    error ? <p className="text-red-600 font-semibold">{error}</p> :
        registered ?
            <div className="rounded-xl shadow-lg p-6 mb-10">
                {/* Heading */}
                <h2 className="pckagehdings">
                    My Package / Profile
                </h2>

                {/* Profile stats grid */}
                <div className="pckagegridall">
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Package Type</h2>
                        <p className="font-bold text-gray-800">{formatEther(packages[Package.id].price)} $</p>
                    </div>
                    {/* <div className="bg-gray-50 rounded-lg p-4 shadow">
                            <p className="text-sm text-gray-500">Total Upline</p>
                            <p className="font-bold text-gray-800">{uplines.length}</p>
                        </div> */}
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Team size</h2>
                        <p className="font-bold text-gray-800">{
                        //downlines.indirect.length-2<0?
                        downlines.indirect.length
                        //:downlines.indirect.length-2
                        }</p>
                    </div>

                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Team size</h2>
                        <p className="font-bold text-gray-800">{
                        //downlines.indirect.length-2<0?
                        downlines.indirect.length
                        //:downlines.indirect.length-2
                        }</p>
                    </div>
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Direct Referrals</h2>
                        <p className="font-bold text-gray-800">{downlines.direct.length}</p>
                    </div>
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Package Limit</h2>
                        <p className="font-bold text-gray-800">{formatEther(Package.limit)} $</p>
                    </div>
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Remaining Limit</h2>
                        <p className="font-bold text-gray-800">{Number(formatEther(Package.limit)) - Number(formatEther(limitUtilized))} $</p>
                    </div>

                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">NFTque Status</h2>
                        <p className="font-bold text-gray-800">{NFTQueStatus}</p>
                    </div>
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">NFTque Earnings</h2>
                        <p className="font-bold text-green-600">
                            {NFTQuebalance1} $
                        </p>
                    </div>
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Level Income</h2>
                        <p className="font-bold text-green-600">
                            {formatEther(levelIncome)} $
                        </p>
                    </div>
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Referral Income</h2>
                        <p className="font-bold text-green-600">
                            {formatEther(referralIncome)} $
                        </p>
                    </div>
                    <div className="singlepckagebox shadow">
                        <h2 className="text-sm text-gray-500">Trading Income</h2>
                        <p className="font-bold text-green-600">
                            {formatEther(tradingIncome)} $
                        </p>
                    </div>
                </div>

                {/* NFTs Owned */}
                <div className="mt-10 nftsbtns">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        My NFTs
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {myNFTs && myNFTs.map((nft, i) => (
                            <Image nft={nft} index={i} />
                        ))}
                    </div>
                </div>
                {/* Upgrade Button */}
                {Package && packages && (
                    <div className="btnclicknfts">
                        {(() => {

                            const nextPackage = packages[Number(Package.id) + 1]; // next package
//                            console.log("next",nextPackage,packages,Package)
                            const canUpgrade = Number(Package.id)<5 && (downlines.length >= nextPackage.team) ;

                            return (Number(Package.id) < (packages.length - 2) &&
                                <button
                                    disabled={!canUpgrade}
                                    className={`w-full py-3 rounded-lg font-semibold transition-colors  ${canUpgrade
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    onClick={() => { handleUpdate(nextPackage) }}
                                >
                                    {canUpgrade
                                        ? `Upgrade to ${ethers.formatEther(nextPackage.price)} $ with limit of ${ethers.formatEther(nextPackage.limit)}`
                                        : Number(Package.id)<5 ?`Need ${nextPackage.team} downlines to upgrade`:`you are at highest package`}
                                </button>
                            );
                        })()}
                    </div>
                )}

            </div> : <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    You are not registered
                </h2>
                <p className="text-gray-500 mb-4">Please register to continue</p>

                <div className="mb-4">
                    <label
                        htmlFor="referrer"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Referrer Address
                    </label>
                    <input
                        id="referrer"
                        type="text"
                        value={referrer}
                        onChange={(e) => setReferrer(e.target.value)}
                        placeholder="Enter referrer address"
                        style={{color:"black"}}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleRegister}
                    className=" cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Register
                </button>

            </div>
);
};

export default ProfileSection;
