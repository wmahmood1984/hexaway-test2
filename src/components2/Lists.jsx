import React, { useState } from "react";
import UserListDemo from "./UserListDemo";

import NormalList from "./NormalList";


import Admin_staking from "./Staking page/Admin_staking";
import Admin_staking_earning from "./Staking page/Admin_staking_earning";
import ExchangeAdmin from "./reports/ExchangeAdmin";

export default function Lists() {
    const [activeTab, setActiveTab] = useState("admin2");

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-4 mb-6">

                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "users"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    User List
                </button>

                <button
                    onClick={() => setActiveTab("admin1")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "admin1"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Exchange
                </button>

                <button
                    onClick={() => setActiveTab("admin2")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "admin2"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Staking Report
                </button>

                <button
                    onClick={() => setActiveTab("admin3")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "admin3"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Staking Earning Report
                </button>


                <button
                    onClick={() => setActiveTab("normal")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "normal"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Trading
                </button>



            </div>

            {/* Tab Content */}

            {activeTab === "normal" && <NormalList />}
            {activeTab === "users" && <UserListDemo />}
            {activeTab === "admin1" && <ExchangeAdmin />}
            {activeTab === "admin2" && <Admin_staking />}
            {activeTab === "admin3" && <Admin_staking_earning />}

        </div>
    );
}
