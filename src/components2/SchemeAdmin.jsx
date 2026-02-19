import React, { useState } from "react";
import { useConfig } from "wagmi";

import { gameContract } from "../config"; // adjust path if needed
import { executeContract } from "../utils/contractExecutor";
import toast from "react-hot-toast";


const SetScheme = () => {
  const config = useConfig();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [perToDepositor, setPerToDepositor] = useState("");
  const [perToReferrer, setPerToReferrer] = useState("");
  const [loading, setLoading] = useState(false);

  const convertToSeconds = (dateTime) => {
    return Math.floor(new Date(dateTime).getTime() / 1000);
  };

  const handleSetScheme = async () => {
    if (!start || !end || !perToDepositor || !perToReferrer) {
      toast.error("All fields are required");
      return;
    }

    const startSeconds = convertToSeconds(start);
    const endSeconds = convertToSeconds(end);

    if (startSeconds >= endSeconds) {
      toast.error("End time must be greater than start time");
      return;
    }

    if (
      Number(perToDepositor) + Number(perToReferrer) !== 100
    ) {
      toast.error("Percentages must sum to 100");
      return;
    }

    try {
      setLoading(true);

      await executeContract({
        config,
        contract: gameContract,
        functionName: "setScheme",
        args: [
          startSeconds,
          endSeconds,
          Number(perToDepositor),
          Number(perToReferrer),
        ],
        onSuccess: (txHash, receipt) => {
          console.log("🎉 Tx Hash:", txHash);
          console.log("🚀 Receipt:", receipt);
          toast.success("Scheme updated successfully");
          setStart("");
          setEnd("");
          setPerToDepositor("");
          setPerToReferrer("");
        },
        onError: (err) => {
          console.error("🔥 Error:", err);
          toast.error("Failed to set scheme");
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Update Scheme
        </h2>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Percentages */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              % To Depositor
            </label>
            <input
              type="number"
              value={perToDepositor}
              onChange={(e) => setPerToDepositor(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              % To Referrer
            </label>
            <input
              type="number"
              value={perToReferrer}
              onChange={(e) => setPerToReferrer(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSetScheme}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Processing..." : "Set Scheme"}
        </button>
      </div>
    </div>
  );
};

export default SetScheme;
