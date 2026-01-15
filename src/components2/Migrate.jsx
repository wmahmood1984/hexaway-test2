import { useConfig } from "wagmi";
import { executeContract } from "../utils/contractExecutor";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { readName } from "../slices/contractSlice";
import toast from "react-hot-toast";


function Migrate() {
    const config = useConfig()
            const [address1, setAddress] = useState("");
              const dispatch = useDispatch()  
    const handleMigrate = async () => {
        await executeContract({
            config,
            functionName: "migrate",
            args: [address1],
            onSuccess: (txHash, receipt) => {
                console.log("🎉 Tx Hash:", txHash);
                console.log("🚀 Tx Receipt:", receipt);
                dispatch(readName({ address: receipt.from }));
                toast.success("migration done successfully")
               
            },
            contract: helperContractV2,
            onError: (err) => {
                console.error("🔥 Error in register:", err);
                toast.error("Transaction failed");
               
            },
        });
    };
    return (

        <div>
            <label>
                Address
                <input
                    value={address1}
                    placeholder="address"
                    onChange={(e) => { setAddress(e.target.value) }}
                ></input>

            </label>

            <button
                onClick={handleMigrate}
            >
                Migrate
            </button>

        </div>
    )

}

export default Migrate