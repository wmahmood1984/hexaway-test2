import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi"
import { erc20Abi, parseEther } from "viem"
import { useEffect } from "react"
import { erc20abi, erc20Add, stakingV2Abi, stakingV2Add } from "../../config"

export function useStake(stakeAmount: bigint) {
  const { address } = useAccount()

  /* ------------------ 1. SIMULATE STAKE (FAIL FAST) ------------------ */

  const {
    data: stakeSimulation,
    error: stakeSimError,
  } = useSimulateContract({
    address: stakingV2Add,
    abi: stakingV2Abi,
    functionName: "stake",
    account: address,

  })

  /* ------------------ 2. READ ALLOWANCE ------------------ */

  const { data: allowance } = useReadContract({
    address: erc20Add,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, stakingV2Add],

  })

  const { writeContractAsync } = useWriteContract()

  /* ------------------ 3. MAIN ACTION ------------------ */

  const stake = async () => {
    if (!address) throw new Error("Wallet not connected")

    /* A. FAIL EARLY ON STAKE ERRORS */
    if (stakeSimError) {
      throw stakeSimError
    }

    /* B. CHECK ALLOWANCE */
    if (!allowance || allowance < stakeAmount) {
      await writeContractAsync({
        address: erc20Add,
        abi: erc20abi,
        functionName: "approve",
        args: [stakingV2Add, stakeAmount],
      })
    }

    /* C. EXECUTE STAKE (SAFE) */
    await writeContractAsync({
      address: stakingV2Add,
      abi: stakingV2Abi,
      functionName: "stake",
    })
  }

  return {
    stake,
    stakeSimError,
  }
}
