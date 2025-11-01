import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { helperAbi, helperAddress, web3 } from '../config';
import { useAppKitAccount } from '@reown/appkit/react';
import { formatAddress } from '../utils/contractExecutor';
import { useDispatch, useSelector } from 'react-redux';
import { init, readName } from '../slices/contractSlice';

export default function Nav() {


        const { Package, myNFTs, packages, downlines, registered, admin, allowance, NFTQueBalance, limitUtilized, NFTque

        , levelIncome,
        referralIncome,
        tradingIncome, walletBalance,NFTMayBeCreated,
        status, error
    } = useSelector((state) => state.contract);



       const { address } = useAppKitAccount()
    
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(init()).then(() => {
            if (address) {
                dispatch(readName({ address }));
            }else{
                dispatch(readName({ address:"0x0000000000000000000000000000000000000000" }))
            }
        });
    }, [dispatch, address]);

    console.log("nav",NFTMayBeCreated);


    return (
        <div>

            <nav class="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 premium-shadow">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-14 sm:h-16">
                        <div class="flex items-center">
                            <Link to={"/"}>
                            <h1 id="company-name" 
                            class="text-xl sm:text-2xl font-bold font-display bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                HEXAWAY</h1>
                            </Link>
                            
                        </div>
                        <div class="hidden lg:flex items-center space-x-6 xl:space-x-8">
                            {registered && <>
                            <Link to={"/dashboard"}  class="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Dashboard</Link>
                            <Link to={"/trade"}  class="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Trade</Link>
                            {NFTMayBeCreated&&  <Link to={"/create"}  class="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Create</Link>}
                            <Link to={"/asset"}  class="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Assets</Link>
                            <Link to={"/tree"}  class="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-sm xl:text-base">Team Tree</Link>
                            </>}
                            
                            <Link 
                            to={"/auth"}
                            id="auth-btn"  class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg text-sm xl:text-base">{address? formatAddress(address) :`Get Started`}</Link>
                        </div>
                        <div class="lg:hidden">
                            <button onclick="toggleMobileMenu()" class="text-gray-600 hover:text-indigo-600 p-2">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewbox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg></button>
                        </div>
                    </div>
                </div>
                <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-200 shadow-lg">
                    <div class="px-4 py-3 space-y-1">
                        <Link to={"/dashboard"} class="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium hidden">Dashboard</Link> 
                        <Link to={"/trade"}  class="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">Trade</Link> 
                        <Link to={"/create"}  class="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">Create</Link>
                        <Link to={"/asset"}  class="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">Assets</Link> 
                        <Link to={"/tree"}  class="block px-3 py-3 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors font-medium">Team Tree</Link>

                        <div class="pt-2 border-t border-gray-200">
                            <Link 
                            to={"/auth"} id="mobile-auth-btn" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">Connect wallet</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
