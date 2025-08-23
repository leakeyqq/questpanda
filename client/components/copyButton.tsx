// components/CopyButton.tsx
"use client"

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copyToClipboard}
      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      )}
    </button>
  )
}