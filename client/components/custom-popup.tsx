"use client"

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

export function AlertModal({ 
  message,
  onClose,
  visible
}: {
  message: string
  onClose: () => void
  visible: boolean
}) {

  if (!visible) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-brand-purple/30 max-w-md w-full p-6 shadow-lg">
        <div className="flex flex-col space-y-4">
          <p className="text-brand-dark font-medium">{message}</p>
          <Button 
            onClick={onClose}
            className="bg-brand-purple hover:bg-brand-purple/90 ml-auto"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook for easy usage
// Hook for easy usage
export function useAlert() {
  const [alertState, setAlertState] = useState<{
    message: string
    resolve?: (value: void) => void
  } | null>(null)

 const [isVisible, setIsVisible] = useState(false)


  const showAlert = useCallback((message: string): Promise<void> => {
    setIsVisible(true)
    return new Promise((resolve) => {
      setAlertState({
        message,
        resolve
      })
    })
  }, [])

  const handleClose = useCallback(async() => {
    // First trigger the closing animation/transition
    setIsVisible(false)
    // Wait for the close animation to complete (adjust timing as needed)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    
    alertState?.resolve?.() // Resolve the promise when alert is closed
    setAlertState(null)
  }, [alertState])

  const AlertComponent = useCallback(() => {
    if (!alertState) return null
    return (
      <AlertModal 
        message={alertState.message} 
        onClose={handleClose}
         visible={isVisible} 
      />
    )
  }, [alertState, handleClose, isVisible])

  return { showAlert, AlertComponent }
}