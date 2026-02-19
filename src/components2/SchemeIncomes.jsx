import React, { useState } from 'react'
import { formatAddress } from '../utils/contractExecutor'

export default function SchemeIncomes({
    dailyStarRewardInfo,
    weeklyStarRewardInfo,
    monthlyStarRewardInfo,
    dailyProTraderRewardInfo,
    weeklyProTraderRewardInfo,
    monthlyProTraderRewardInfo
}) {

    const [data, setData] = useState(dailyStarRewardInfo)
    const [data1, setData1] = useState(dailyProTraderRewardInfo)
    return (
        <div>
            <div class="box-container">
                <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">🚀</div>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Star Sponsor (Worldwide)</h3>
                    </div>


                    <div class="flex space-x-2 mb-4 border-b border-gray-200 pb-2">
                        <span
                            onClick={() => { setData(dailyStarRewardInfo) }}
                            class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700" data-sponsor="today">Today</span>
                        <span onClick={() => { setData(weeklyStarRewardInfo) }} class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700" data-sponsor="week">Week</span>
                        <span onClick={() => { setData(monthlyStarRewardInfo) }} class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700" data-sponsor="month">Month</span>
                    </div>


                    <div id="sponsor-dynamic" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 flex flex-col items-center justify-center">
                                <div class="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">Address</div>
                                <div class="large-address font-mono text-gray-800 text-center">{formatAddress(data.address)}</div>
                            </div>
                            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 flex flex-col items-center">
                                <div class="text-sm font-medium text-green-600 uppercase tracking-wider">Referrals</div>
                                <div class="text-2xl font-bold text-gray-800 my-1">${data.achievement}</div>
                                <div class="text-xs text-gray-500">this period</div>
                            </div>
                            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 flex flex-col items-center">
                                <div class="text-sm font-medium text-purple-600 uppercase tracking-wider">Achieved</div>
                                <div class="text-2xl font-bold text-gray-800 my-1">${data.amount}</div>
                                <div class="text-xs text-gray-500">total volume</div>
                            </div>


                    </div>
                    <p class="text-xs text-gray-400 mt-3 text-right" id="sponsor-period-note">example values · today</p>
                </div>
            </div>


            <div class="box-container">
                <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 bg-gradient-to-r from-amber-600 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">📊</div>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Pro Trader (Worldwide)</h3>
                    </div>


                    <div class="flex space-x-2 mb-4 border-b border-gray-200 pb-2">
                        <span

                            onClick={() => { setData1(dailyProTraderRewardInfo) }}
                            class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700" data-pro="daily">Daily</span>
                        <span onClick={() => { setData1(weeklyProTraderRewardInfo) }} class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700" data-pro="weekly">Weekly</span>
                        <span onClick={() => { setData1(monthlyProTraderRewardInfo) }} class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700" data-pro="monthly">Monthly</span>
                    </div>


                    <div id="pro-dynamic" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 flex flex-col items-center justify-center">
                            <div class="text-sm font-medium text-amber-600 uppercase tracking-wider mb-2">Trader</div>
                            <div class="large-address font-mono text-gray-800 text-center">{formatAddress(data1.address)}</div>
                        </div>
                        <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 flex flex-col items-center">
                            <div class="text-sm font-medium text-amber-600 uppercase tracking-wider">Volume</div>
                            <div class="text-2xl font-bold text-gray-800 my-1">${data1.achievement}</div>
                            <div class="text-xs text-gray-500">this period</div>
                        </div>
                        <div class="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 flex flex-col items-center">
                            <div class="text-sm font-medium text-amber-600 uppercase tracking-wider">Achieved</div>
                            <div class="text-2xl font-bold text-gray-800 my-1">${data1.amount}</div>
                            <div class="text-xs text-gray-500">total earnings</div>
                        </div>

                    </div>
                    <p class="text-xs text-gray-400 mt-3 text-right" id="pro-period-note">example values · daily</p>
                </div>
            </div>
        </div>
    )
}
