// components/FarcasterSDKInitializer.tsx
"use client";

import { useEffect } from "react";
import { sdk } from '@farcaster/frame-sdk';

export default function FarcasterSDKInitializer() {
  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (err) {
        console.error("Failed to initialize Farcaster SDK:", err);
      }
    };
    init();
  }, []);

  return null; // This component doesn't render anything
}