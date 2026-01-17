import React, { useState } from "react";
import UserListDemo from "./UserListDemo";
import Burning from "./Burning";
import TradingQue from "./TradingQue";
import NormalList from "./NormalList";
import NewList from "./NewList";
import AdminCreation from "./AdminCreation";
import Tally from "./Tally";
import Admin1 from "./reports/Admin1";
import Admin2 from "./reports/Admin2";
import Admin3 from "./reports/Admin3";

export default function Lists() {
    const [activeTab, setActiveTab] = useState("admin1");

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

                {/* <button
                    onClick={() => setActiveTab("admin2")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "admin2"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Admin 2
                </button>

                <button
                    onClick={() => setActiveTab("admin3")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${activeTab === "admin3"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                >
                    Admin 3
                </button> */}


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
            {activeTab === "admin1" && <Admin1 />}
            {activeTab === "admin2" && <Admin2 />}
            {activeTab === "admin3" && <Admin3 />}

        </div>
    );
}
