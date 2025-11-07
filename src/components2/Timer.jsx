import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { readName } from "../slices/contractSlice";
import { useAppKitAccount } from "@reown/appkit/react";

const CountdownTimer = ({ durationInSeconds }) => {
  
             console.log("nav",durationInSeconds);
    const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const { address, isConnected } = useAppKitAccount();
    const dispatch = useDispatch()

  useEffect(() => {
    if (durationInSeconds <= 0) {
    dispatch(readName({ address }));
      return;
    
    };

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [durationInSeconds]);

  // Calculate time parts
  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = Number(timeLeft % 60).toFixed(0);

  // Calculate expiry date from now
  const expiryDate = new Date(Date.now() + durationInSeconds * 1000).toLocaleString();

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8">
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-200">
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">
            ⏰ Package Expiry Countdown
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Time remaining for your current package
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600" id="countdown-days">
              {days}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Days</div>
          </div>

          <div className="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600" id="countdown-hours">
              {String(hours).padStart(2, "0")}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Hours</div>
          </div>

          <div className="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600" id="countdown-minutes">
              {String(minutes).padStart(2, "0")}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Minutes</div>
          </div>

          <div className="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600" id="countdown-seconds">
              {String(seconds).padStart(2, "0")}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">Seconds</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-xs sm:text-sm text-gray-500">
            Package expires on:{" "}
            <span id="expiry-date" className="font-medium text-gray-700">
              {expiryDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
