"use client"
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const WalletPage = () => {
  const [hideButton, setHideButton] = useState(false);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  const web3authConnector = connectors.find((c) => c.id === 'web3auth');

  // Check for MiniPay and auto-connect
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum?.isMiniPay) {
      setHideButton(true);
      connect({ connector: injected({ target: 'metaMask' }) });
      console.log("MiniPay detected. Auto-connecting...");
    }
  }, [connect]);

  // Handle backend login when connected
  useEffect(() => {
    if (isConnected && address) {
      const login = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
            credentials: "include",
          });

          const data = await res.json();
          if (data.success) {
            console.log("Login successful:", data);
          } else {
            console.log("Login failed:", data);
          }
        } catch (err) {
          console.error("Login error:", err);
        }
      };

      login();
    }
  }, [isConnected, address]);

  // If button should be hidden, return nothing
  if (hideButton) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Connect Your Wallet</h1>

      {/* Web3Auth Button */}
      {web3authConnector && (
        <button
          onClick={() => connect({ connector: web3authConnector })}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Connect with Web3Auth
        </button>
      )}

      {/* Default RainbowKit ConnectButton */}
      <div className="mt-4">
        <ConnectButton showBalance={{ smallScreen: false, largeScreen: false }} />
      </div>

      {/* Disconnect Button */}
      {isConnected && (
        <button
          onClick={() => disconnect()}
          className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Disconnect
        </button>
      )}
    </div>
  );
};

export default WalletPage;
