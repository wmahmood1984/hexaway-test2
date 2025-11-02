import { formatEther } from 'ethers';
import React from 'react'
import { useSelector } from 'react-redux';
import { NFT } from './NFT2';

export default function Asset() {
    const { Package, myNFTs, packages, downlines, registered, admin, allowance, NFTQueBalance, limitUtilized, NFTque

        , levelIncome,
        referralIncome,
        totalIncome,
        tradingIncome, walletBalance,
        status, error
    } = useSelector((state) => state.contract);

    const totalWei = myNFTs.reduce((acc, nft) => acc + BigInt(nft.price || 0), 0n);

// convert to Ether
const totalEth = formatEther(totalWei);

    return (
        <div>

            <div id="assets-page" class="page">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                        <div class="mb-4 sm:mb-0">
                            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-1 sm:mb-2">My Collection</h2>
                            <p class="text-sm sm:text-lg lg:text-xl text-gray-600">Manage and showcase your digital assets</p>
                        </div>
                        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            {/* <button onclick="showPage('create')" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg text-sm sm:text-base"> Mint NFT </button> <button class="bg-white border border-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"> Import NFT </button> */}
                        </div>
                    </div>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 border border-gray-100">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600">
                                        {myNFTs.length}
                                    </div>
                                    <div class="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">
                                        Total NFTs
                                    </div>
                                </div>
                                <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-600" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 border border-gray-100">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600">
                                        ${totalEth}
                                    </div>
                                    <div class="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">
                                        Total Value
                                    </div>
                                </div>
                                <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 border border-gray-100">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                                        {myNFTs.length}
                                    </div>
                                    <div class="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">
                                        Listed
                                    </div>
                                </div>
                                <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 border border-gray-100">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-lg sm:text-2xl lg:text-3xl font-bold text-orange-600">
                                        ${totalIncome}
                                    </div>
                                    <div class="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">
                                        Earned
                                    </div>
                                </div>
                                <div class="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <svg class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <div class="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <div class="flex items-center space-x-2"><label class="text-xs sm:text-sm font-medium text-gray-700">Filter:</label> <select class="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm flex-1 sm:flex-none"> <option>All Items</option> <option>Listed</option> <option>Owned</option> <option>Sold</option> </select>
                                </div>

                            </div>
                        </div>
                        <div class="flex items-center justify-end space-x-2 sm:space-x-3"><button class="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                            </svg></button> <button class="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                                </svg></button>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {myNFTs.map((v,e)=>{return(
                    <NFT nft={v} index={e}></NFT>
                    )})}
                    


                </div>
                <div class="text-center mt-8 sm:mt-12"><button class="bg-gray-100 text-gray-700 px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"> Load More NFTs </button>
                </div>
            </div>
        </div>
    )
}
