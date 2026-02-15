import React from 'react'

export default function SchemeIncomes() {
    return (
        <div>
            <div class="box-container">
                <div class="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">🚀</div>
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Start Sponsor (Worldwide)</h3>
                    </div>


                    <div class="flex space-x-2 mb-4 border-b border-gray-200 pb-2">
                        <span class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700" data-sponsor="today">Today</span>
                        <span class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700" data-sponsor="week">Week</span>
                        <span class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700" data-sponsor="month">Month</span>
                    </div>


                    <div id="sponsor-dynamic" class="grid grid-cols-1 md:grid-cols-3 gap-4">

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
                        <span class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700" data-pro="daily">Daily</span>
                        <span class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700" data-pro="weekly">Weekly</span>
                        <span class="period-tab px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700" data-pro="monthly">Monthly</span>
                    </div>


                    <div id="pro-dynamic" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
                    <p class="text-xs text-gray-400 mt-3 text-right" id="pro-period-note">example values · daily</p>
                </div>
            </div>
        </div>
    )
}
