import React, { useEffect, useState } from 'react'
import { growFundContractR } from '../../config'
import { copyToClipboard, formatAddress, secondsToDMY, tn } from '../../utils/contractExecutor'

export default function AdminHistory() {

    const [tickets, setTickets] = useState()
    const [search,setSearch] = useState("")
    useEffect(() => {
        const abc = async () => {
            const _tickets = await growFundContractR.methods.getTickets().call()
            setTickets(_tickets)
        }

        abc()
    }, [])


    const isLoading = !tickets

    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }


    const now = Math.floor(Date.now() / 1000);

let totalStaked = 0;
let totalEarned = 0;
let activeCount = 0;
let maturedCount = 0;

tickets.forEach((v) => {
  const amount = tn(v.amount);
  const claimable = tn(v.claimable);
  const startTime = Number(v.time);

  // Duration mapping
  const durationDays =
    v.stakeType === "1" ? 10 :
    v.stakeType === "2" ? 20 :
    30;

  const endTime = startTime + durationDays * 24 * 60 * 60;

  // 1️⃣ Total Staked
  totalStaked += Number(amount);

  // 2️⃣ Total Earned (profit only)
  totalEarned += (claimable - amount);

  // 3️⃣ Active Count
  if (now < endTime) {
    activeCount++;
  }

  // 4️⃣ Matured Count
  if (v.amountClaimed === true) {
    maturedCount++;
  }
});


    const filteredTickets = tickets.filter(
        t=>t.user.toLowerCase().includes(search) 
    )
    const isMobile = window.innerWidth <= 768;


    console.log("tickets", filteredTickets)
    return (
        <div>
            <div class="max-w-8xl mx-auto">


                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-xl">📊</div>
                        <div>
                            <h1 class="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">Admin report</h1>
                            <p class="text-slate-500 mt-0.5 text-sm md:text-md">search by address · mobile ready</p>
                        </div>
                    </div>
                    <div class="flex gap-2 mt-3 md:mt-0">
                        <span class="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1"><i class="far fa-clock text-slate-400"></i> 15 slots</span>
                        <span class="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1"><i class="fas fa-database text-slate-400"></i> live</span>
                    </div>
                </div>


                <div class="mb-6">
                    <div class="relative max-w-md">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i class="fas fa-search text-slate-400"></i>
                        </div>
                        <input
                         value={search}
                         onChange={(e)=>{setSearch(e.target.value)}}   
                        type="text" id="addressSearch" placeholder="Search by address (e.g. 0x7c1B...)"
                            class="search-box w-full bg-white border border-slate-200 rounded-full py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-violet-200 transition" />
                    </div>
                    <p class="text-xs text-slate-400 mt-2 ml-1"><i class="far fa-keyboard mr-1"></i> real-time filter · shows matching addresses</p>
                </div>


                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <div class="summary-card bg-white/80 rounded-xl p-3 shadow-sm border border-slate-200">
                        <div class="flex items-center gap-2">
                            <div class="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm">🔒</div>
                            <div class="truncate">
                                <div class="text-xs text-slate-500 font-medium">Staked</div>
                                <div class="text-base font-bold text-slate-800" id="totalStakedAdmin">{totalStaked}</div>
                            </div>
                        </div>
                    </div>
                    <div class="summary-card bg-white/80 rounded-xl p-3 shadow-sm border border-slate-200">
                        <div class="flex items-center gap-2">
                            <div class="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">⚡</div>
                            <div>
                                <div class="text-xs text-slate-500 font-medium">Active</div>
                                <div class="text-base font-bold text-slate-800" id="activeStakesAdmin">{activeCount}</div>
                            </div>
                        </div>
                    </div>
                    <div class="summary-card bg-white/80 rounded-xl p-3 shadow-sm border border-slate-200">
                        <div class="flex items-center gap-2">
                            <div class="h-8 w-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm">✅</div>
                            <div>
                                <div class="text-xs text-slate-500 font-medium">Matured</div>
                                <div class="text-base font-bold text-slate-800" id="maturedStakesAdmin">{maturedCount}</div>
                            </div>
                        </div>
                    </div>
                    <div class="summary-card bg-white/80 rounded-xl p-3 shadow-sm border border-slate-200">
                        <div class="flex items-center gap-2">
                            <div class="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm">💰</div>
                            <div>
                                <div class="text-xs text-slate-500 font-medium">Rewards</div>
                                <div class="text-base font-bold text-slate-800" id="totalRewardsAdmin">{totalEarned}</div>
                            </div>
                        </div>
                    </div>
                </div>


                {!isMobile ? <div class="report-card overflow-hidden border border-slate-200/70 desktop-table">
                    <div class="px-4 md:px-6 py-4 border-b border-slate-100 bg-white/50 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-list-ul text-indigo-500"></i>
                            <h2 class="text-md font-semibold text-slate-700">Staking ledger · desktop view</h2>
                        </div>
                        <span class="text-xs text-slate-400"><i class="far fa-clipboard"></i> copy</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="table-header">
                                <tr>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs">Address</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs">Plan</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs">Stake date</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs">Amount</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs">Matured date</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs">Matured amt</th>
                                    <th class="px-4 md:px-6 py-3 text-left text-xs">Status</th>
                                </tr>
                            </thead>
                            <tbody id="reportTableBodyDesktop" class="divide-y divide-slate-100 bg-white">
                                {filteredTickets.map((v, e) => {
                                    const duration =
                                        v.stakeType === "1" ? 10 :
                                            v.stakeType === "2" ? 20 :
                                                30;

                                    // current time in seconds (integer)
                                    const now = Math.floor(Date.now() / 1000);

                                    // stake start time (ensure integer)
                                    const startTime = Number(v.time);

                                    // stake end time
                                    const endTime = startTime + duration * 60;

                                    // remaining time
                                    const timeRemaining = Math.max(endTime - now, 0);
                                    const status = timeRemaining > 0 ? "Active" : timeRemaining == 0 && !v.amountClaimed ? "Completed" : "Claimed"
                                    return (
                                        <tr class="hover:bg-slate-50">
                                            <td class="px-4 md:px-6 py-3">
                                                <div class="flex items-center gap-1 flex-wrap">
                                                    <span class="address-cell text-xs">{formatAddress(v.user)}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(v.user)}
                                                        class="copy-btn w-7 h-7" title="Copy"><i class="far fa-copy text-xs"></i></button>
                                                </div>
                                            </td>
                                            <td class="px-4 md:px-6 py-3"><span class="${planBadge}">HEXA {tn(v.amount)}</span></td>
                                            <td class="px-4 md:px-6 py-3 text-slate-600 text-xs">{secondsToDMY(v.time)}</td>
                                            <td class="px-4 md:px-6 py-3 font-medium">HEXA {tn(v.amount)}</td>
                                            <td class="px-4 md:px-6 py-3 text-slate-600 text-xs">{secondsToDMY(Number(v.time) + Number(duration * 60 * 60 * 24))}</td>
                                            <td class="px-4 md:px-6 py-3 font-medium text-indigo-700">{tn(v.claimable)}</td>
                                            <td class="px-4 md:px-6 py-3"><span class="${statusBadgeClass}">${status}</span></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div> :
                    <div class="mobile-cards mt-2">
                        <div class="flex items-center justify-between mb-3">
                            <h2 class="text-md font-semibold text-slate-700"><i class="fas fa-mobile-alt mr-2 text-indigo-400"></i>Mobile staking ledger</h2>
                            <span class="text-xs bg-slate-100 px-3 py-1 rounded-full"><span id="recordCountMobile">0</span> entries</span>
                        </div>
                        <div id="mobileStakeCards" class="space-y-3">
                            {filteredTickets.map((v, e) => {
                                const duration =
                                    v.stakeType === "1" ? 10 :
                                        v.stakeType === "2" ? 20 :
                                            30;

                                // current time in seconds (integer)
                                const now = Math.floor(Date.now() / 1000);

                                // stake start time (ensure integer)
                                const startTime = Number(v.time);

                                // stake end time
                                const endTime = startTime + duration * 60;

                                // remaining time
                                const timeRemaining = Math.max(endTime - now, 0);
                                const status = timeRemaining > 0 ? "Active" : timeRemaining == 0 && !v.amountClaimed ? "Completed" : "Claimed"
                                return (
                                    <div class="mobile-stake-card">
                                        <div class="flex justify-between items-start mb-2">
                                            <div class="flex items-center gap-2">
                                                <span class="address-cell text-xs">{formatAddress(v.user)}</span>
                                                <button onclick="copyAddress('${address}', this)" class="copy-btn w-8 h-8" title="Copy"><i class="far fa-copy"></i></button>
                                            </div>
                                            <span class="${planBadge}">HEXA {tn(v.amount)}</span>
                                        </div>
                                        <div class="grid grid-cols-2 gap-2 text-xs">
                                            <div><span class="text-slate-500">Stake:</span> {tn(v.amount)} HEXA</div>
                                            <div><span class="text-slate-500">Reward:</span> +{tn(v.claimable) - tn(v.amount)}</div>
                                            <div><span class="text-slate-500">Staked:</span> {secondsToDMY(v.time)}</div>
                                            <div><span class="text-slate-500">Matures:</span> {secondsToDMY(Number(v.time) + Number(duration * 60 * 60 * 24))}</div>
                                        </div>
                                        <div class="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                                            <span class="${statusBadgeClass} text-xs">${status}</span>
                                            <span class="text-indigo-700 font-medium text-sm">${tn(v.claimable)} HEXA</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }





                <div class="mt-5 text-xs text-slate-400 bg-white/70 p-4 rounded-2xl shadow-sm border border-slate-200 flex gap-2 items-start">
                    <i class="fas fa-circle-info text-indigo-300 mt-0.5"></i>
                    <div>✅ Search filters by address in real time. Plan shows only "10 Day", "20 Day", "30 Day". Copy button works.</div>
                </div>
            </div>


            <div class="max-w-7xl mx-auto mt-3 text-right">
                <button onclick="localStorage.removeItem('hexaStakingHistory'); location.reload();" class="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition text-xs inline-flex items-center gap-1"><i class="fas fa-undo-alt"></i> reset demo</button>
            </div>
        </div>
    )
}
