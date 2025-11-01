// utils/contractExecutor.js
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";

import { mlmContract } from "../config.js";


export async function executeContract({
  config,
  functionName,
  args = [],
  contract = mlmContract,
  onSuccess = () => {},
  onError = () => {},
}) {
  try {
    const txHash = await writeContract(config, {
      ...contract,
      functionName,
      args,
    });

    const receipt = await waitForTransactionReceipt(config, { hash: txHash });

    console.log("✅ Tx confirmed:", receipt);

    await onSuccess(txHash, receipt); // <-- pass both hash and receipt
    return txHash;
  } catch (error) {
    console.error("❌ Contract execution error:", error);
    onError(error);
    throw error;
  }
}

export function formatAddress(add) {
  return add ? `${add.slice(0,4)}...${add.slice(-4)}`: `...`
}

export function formatWithCommas(value) {
  if (value === null || value === undefined || value === "") return "";
  
  const num = Number(value);
  if (isNaN(num)) return value; // return original if not a valid number

  return num.toLocaleString("en-US");
}

export function formatDate(dat) {
  return `${new Date(dat * 1000).getDate()}-${new Date(dat * 1000).getMonth()+1}-${new Date(dat * 1000).getFullYear()}`
}