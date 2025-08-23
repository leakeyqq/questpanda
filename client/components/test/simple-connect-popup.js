"use client";
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'
import { useEffect, useState, useRef } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useSearchParams, usePathname } from 'next/navigation';
import { sdk } from '@farcaster/frame-sdk';
import { getSolanaAddress } from "../../lib/getSolanaKey"; // adjust the path if needed
import { getWeb3AuthInstance } from "../../lib/web3AuthConnector"


let hasConnectedMiniPay = false;
let hasConnectedFarcaster = false;


export default function ConnectWalletButton() {
    const buttonRef = useRef(null);
  // const [hideButton, setHideButton] = useState(false);
  const [mounted, setMounted] = useState(false); // 👈 Track client mount

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  // const [isMiniApp, setIsMiniApp] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(null);
  const [isValora, setIsValora] = useState(false);
  const [refreshPage, setRefreshpage] = useState(false);
  const searchParams = useSearchParams();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false); // 👈 Add this state


  const pathname = usePathname();
  const [isRedirectFromAuth, setIsRedirectFromAuth] = useState(false);


// const [solanaAddress, setSolanaAddress] = useState(null);
  


  // 🧠 Find Web3Auth connector
  const web3authConnector = connectors.find((c) => c.id === "web3auth");
  const valoraConnector  =  connectors.find(c => c.id === 'walletConnect');
  useEffect(() => {
    setMounted(true); // ✅ Now it's safe to render client-only logic
  }, []);

  // useEffect(() => {
  //   // Detect Valora wallet
  //   setIsValora(mounted && typeof window !== "undefined" && (
  //     window.ethereum?.isValora || 
  //     window.ethereum?.providers?.some(p => p.isValora) ||
  //     /valora/i.test(navigator.userAgent)
  //   ));
  // }, []);

    // Detect if we're coming back from Web3Auth redirect
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const url = window.location.href;
      const isAuthRedirect = url.includes('/#b64Params=');
      
      if (isAuthRedirect) {
        setIsRedirectFromAuth(true);
        setIsSigningIn(true);
        
        // Clean up the URL
        // const cleanUrl = url.split('#')[0];
        // window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [mounted]);

  

  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect Valora
  useEffect(() => {
    if(mounted && typeof window !== "undefined"){
      const valoraParam = searchParams.get('valora');
      const isValoraUrl = valoraParam === 'true';
      const wasValoraDetected = sessionStorage.getItem('valoraDetected') === 'true'

      if(isValoraUrl || wasValoraDetected){
        setIsValora(true)
        sessionStorage.setItem('valoraDetected', 'true');
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('valora');
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    }
  })

  // 🚀 Auto-connect MiniPay if detected
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      if (window.ethereum?.isMiniPay && !hasConnectedMiniPay) {
        hasConnectedMiniPay = true;
        // setHideButton(true);
        connect({ connector: injected({ target: "metaMask" }) });
        console.log("MiniPay detected. Auto-connecting...");
      }
    }
  }, [connect]);

    // Detect Farcaster Mini App environment
  useEffect(() => {
    if (mounted && !hasConnectedFarcaster) {
      const checkMiniApp = async () => {
        try {
          const miniAppStatus = await sdk.isInMiniApp();
          setIsMiniApp(miniAppStatus);
          
          if (miniAppStatus) {
            hasConnectedFarcaster = true;
            console.log("Running in Farcaster Mini App");
            connect({ connector: farcasterFrame() })
          }
        } catch (error) {
          console.error("Error checking Mini App status:", error);
        }
      };
      
      checkMiniApp();
    }
  }, [mounted, connect]);


  // 🔐 Backend auth after connecting
  useEffect(() => {
    if (isConnected && address) {
      const login = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ address }),
              credentials: "include",
            }
          );
          const data = await res.json();
          if (data.success) {
            document.cookie = `userWalletAddress=${address}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict}`;
            console.log("Login successful:", data);
          } else {
            console.log("Login failed:", data);
          }
          // Update signing in state
          setIsSigningIn(false);
          setIsRedirectFromAuth(false);

          if(refreshPage){
            setRefreshpage(false)
            window.location.reload();
          }
        } catch (err) {
          console.error("Login error:", err);
          setIsSigningIn(false);
          setIsRedirectFromAuth(false);
        }
      };

      login();
    }
  }, [isConnected, address, refreshPage]);


  // ✅ Separate useEffect to fetch Solana Address (after Web3Auth is ready)
useEffect(() => {
  const fetchSolanaAddress = async () => {
    try {
      const web3auth = getWeb3AuthInstance();

      // 🔐 Wait until Web3Auth is connected
      if (!web3auth.connected) {
        console.warn("⏳ Waiting for Web3Auth to connect...");
        await new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (web3auth.connected && web3auth.provider) {
              clearInterval(interval);
              resolve(true);
            }
          }, 100);

          // Optional: timeout after 5 seconds
          setTimeout(() => {
            clearInterval(interval);
            reject("Web3Auth connection timeout");
          }, 5000);
        });
      }

      const solanaAddr = await getSolanaAddress();
      // setSolanaAddress(solanaAddr);
      document.cookie = `solanaWalletAddress=${solanaAddr}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict}`;
    } catch (err) {
      console.error("❌ Failed to fetch Solana address:", err);
    }
  };

  if (isConnected) {
    fetchSolanaAddress();
  }
}, [isConnected]);


useEffect(() => {
  if (web3authConnector && !isConnected && !isValora && !isMiniApp) {
    const timer = setTimeout(() => {
      connect({ connector: web3authConnector });
    }, 200);

    return () => clearTimeout(timer);
  }
}, [web3authConnector, isConnected, isValora, connect]);

if (!mounted || isMiniApp === null) {
  return null;
}

  if (!mounted || isMiniApp || (typeof window !== "undefined" && window.ethereum?.isMiniPay)) {
    return null;
  }

    // Split the return into two blocks based on isValora
  if (isValora) {
    return (
      <div className="flex flex-col items-center gap-4">
        {/* Valora-specific UI */}
        {!isConnected && (
          <button onClick={() => {connect({ connector: valoraConnector }); setRefreshpage(true); }} className="px-4 py-2 rounded-lg bg-brand-purple text-white hover:bg-opacity-90 hover:bg-brand-purple  transition">Connect Wallet </button>
        )}

        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 rounded-lg text-red font-medium hover:text-light hover:bg-red-700 transition"
          >
            Disconnect
          </button>
        )}
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center gap-4">
      {/* ✅ Web3Auth Connect Button */}
{/* ✅ Web3Auth Connect Button */}
{web3authConnector && !isConnected && (
  <button
    ref={buttonRef}
    onClick={() => {
      connect({ connector: web3authConnector });
    }}
    className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
      isSigningIn 
        ? 'bg-gray-400 cursor-not-allowed' 
        : 'bg-brand-purple hover:bg-opacity-90 hover:bg-brand-purple'
    } text-white transition`}
    disabled={isSigningIn}
  >
    {isSigningIn ? (
      <>
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Syncing...
      </>
    ) : (
      'Sign in'
    )}
  </button>
)}


      {isConnected && (
        <button
          onClick={() => {
            disconnect(); 
            document.cookie = 'userWalletAddress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'solanaWalletAddress=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }}
          className="px-4 py-2 rounded-lg text-red font-medium hover:text-light hover:bg-red-700 transition"
        >
          Log Out
        </button>
      )}
    </div>
  );
}

export { ConnectWalletButton };

