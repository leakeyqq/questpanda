"use client";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { ConnectWalletButton } from "./test/simple-connect-popup"; // adjust path

export default function AuthGuard({ children }) {
  const { isConnected, address } = useAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking cookies or backend auth
    const checkAuth = async () => {
      try {
        // Example: Check for cookie
        const walletCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userWalletAddress="));
        
        if (isConnected && address && walletCookie) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [isConnected, address]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
       <h1 className="text-3xl font-bold text-pink-600 mb-3">
        🐼 Almost there..
      </h1>
        <p className="mb-4 text-lg">Please sign in to continue</p>
        <ConnectWalletButton />
      </div>
    );
  }

  return <>{children}</>;
}
