import { useState } from "react";
import { parseEther } from "viem";
import toast from 'react-hot-toast'
import { gameAdd, HexaContract } from "../../config";

export default function DepositModal({
  isOpen,
  onClose,
  executeContract,
  config,
  gameContract,
  hexaBalance,price
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const onDepositClick1 = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      await executeContract({
        config,
        contract: gameContract,
        functionName: "deposit",
        args: [parseEther(amount.toString())],
        onSuccess: (txHash, receipt) => {
          console.log("🎉 Tx Hash:", txHash);
          console.log("🚀 Tx Receipt:", receipt);
          toast.success("Deposit successful");
          setAmount("");
          onClose();
        },
        onError: (err) => {
          console.error("🔥 Deposit error:", err);
          toast.error("Deposit failed");
        },
      });
    } finally {
      setLoading(false);
    }
  };


    const onDepositClick = async () => {
  
  
      if (
        Number(hexaBalance) < amount
      ) {
        toast.error("Insufficient HEXA Balance")
        return
      }
  
      const value = amount / price;
      console.log("value", value)
      try {
        setLoading(true);
        await executeContract({
          config,
          functionName: "approve",
          args: [gameAdd, parseEther(value.toString())],
          contract: HexaContract,
          onSuccess: () => onDepositClick1(),
          onError: () => {
            setLoading(false);
            toast.error("Approval failed");
          }
        });
  
      } catch (err) {
        setLoading(false);
        toast.error("Unexpected error occurred");
        console.error(err);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-[360px] rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Deposit Amount</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          onClick={onDepositClick}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Depositing..." : "Deposit"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
