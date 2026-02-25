import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { init, readName } from '../slices/contractSlice';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import TawkChat from './Tawkchat';
import FirstModal from './FirstModal';

export default function Home() {

const dispatch = useDispatch();

const { registered } = useSelector((state) => state.contract);  
const navigate = useNavigate()

const { address } = useAppKitAccount();
    useEffect(() => {
    dispatch(init()).then(() => {
      if (address) {
        dispatch(readName({ address }));
      }
    });
  }, [dispatch, address]);

  const handleClick = async ()=>{
    if(registered){
        navigate("/trade")
    }else{
        navigate("/auth")
    }

  }



    return (
        <div> 
            {/* <FirstModal/> */}
            
                       <div id="home-page" class="page">
            <section class="relative hero-gradient py-20 overflow-hidden">
        
        
        
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-5xl md:text-7xl font-bold font-display bg-gradient-to-r from-gray-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-6 leading-tight">Discover, Trade &amp; More</h2>
                <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">Join the future of digital earning opportunities with HEXAWAY </p>
                <button 
                onClick={handleClick}
                class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105">Start Trading Now</button>
            </div>
        </section>

        
        <section id="why-choose" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h3 class="text-4xl font-bold font-display text-gray-900 mb-6">Why Choose HEXAWAY?</h3>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">Experience the next generation of trading with our cutting-edge features</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    
                    <div class="feature-card bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <h4 class="text-2xl font-bold text-gray-900 mb-4">Fully Decentralized</h4>
                        <p class="text-gray-600 mb-4">Trade with complete freedom on our decentralized platform. No intermediaries, no restrictions.</p>
                        <ul class="space-y-2">
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                No central authority control
                            </li>
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Peer-to-peer transactions
                            </li>
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Complete ownership rights
                            </li>
                        </ul>
                    </div>

                    
                    <div class="feature-card bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h4 class="text-2xl font-bold text-gray-900 mb-4">Blockchain Based</h4>
                        <p class="text-gray-600 mb-4">Built on secure blockchain technology ensuring transparency and immutability of all transactions.</p>
                        <ul class="space-y-2">
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Transparent transaction history
                            </li>
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Immutable ownership records
                            </li>
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Secure and tamper-proof
                            </li>
                        </ul>
                    </div>

                    
                    <div class="feature-card bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
                        <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h4 class="text-2xl font-bold text-gray-900 mb-4">Verified Smart Contracts</h4>
                        <p class="text-gray-600 mb-4">All transactions powered by audited and verified smart contracts for maximum security.</p>
                        <ul class="space-y-2">
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Professionally audited code
                            </li>
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Automated secure transactions
                            </li>
                            <li class="flex items-center text-gray-600">
                                <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Trustless execution
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        
        <section id="features" class="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h3 class="text-4xl font-bold font-display text-gray-900 mb-6">Platform Features</h3>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need for successful trading in one place</p>
                </div>
                
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div class="stat-card bg-white p-6 rounded-xl shadow-lg text-center">
                        <div class="text-3xl font-bold text-indigo-600 mb-2">99.9%</div>
                        <div class="text-gray-700 font-medium">Uptime</div>
                        <div class="text-sm text-gray-500 mt-1">Reliable platform</div>
                    </div>
                    <div class="stat-card bg-white p-6 rounded-xl shadow-lg text-center">
                        <div class="text-3xl font-bold text-green-600 mb-2">24/7</div>
                        <div class="text-gray-700 font-medium">Trading</div>
                        <div class="text-sm text-gray-500 mt-1">Non-stop markets</div>
                    </div>
                 
                   
                </div>
                
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                        <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h4 class="text-xl font-bold text-gray-900 mb-3">Secure Wallet</h4>
                        <p class="text-gray-600">Multi-signature security with biometric authentication for your digital assets.</p>
                    </div>
                    
                    <div class="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                            </svg>
                        </div>
                        <h4 class="text-xl font-bold text-gray-900 mb-3">Instant Trading</h4>
                        <p class="text-gray-600">Execute trades instantly with our high-speed matching engine and low latency.</p>
                    </div>
                </div>
            </div>
        </section>

        
        <section id="contact" class="py-16 bg-white">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 class="text-3xl font-bold font-display text-gray-900 mb-8">Contact Support</h3>
                
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border border-gray-200">
                    <div class="grid md:grid-cols-2 gap-6 mb-8">
                        <button onclick="redirectToMedia()" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Media
                        </button>
                        <button onclick="redirectToContact()" class="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Contact Us
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="flex items-center justify-center space-x-3">
                            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span class="text-lg text-gray-700 font-medium">support@hexaway.org</span>
                        </div>
                        <div class="flex items-center justify-center space-x-3">
                            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                            </svg>
                            <span class="text-lg text-gray-700 font-medium">media.hexaway.org</span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-8">
                    <h4 class="text-xl font-bold text-gray-900 mb-4">Media & Resources</h4>
                    <p class="text-gray-600 mb-6">Access our media kit, brand resources, and More opportunities</p>
                </div>
                
                <div class="pt-8 border-t border-gray-200">
                    <p class="text-gray-500 text-sm">
                        © 2023 HEXAWAY  Trading & Gaming Platform. All rights reserved.
                    </p>
                </div>
            </div>
        
                <TawkChat/>
           </section>
        </div ></div>
    )
}
