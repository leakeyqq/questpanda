"use client"

import { Button } from "@/components/ui/button"
import { useState, useCallback } from 'react'

export function ConfirmModal({ 
  message,
  onConfirm,
  onCancel,
  visible
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
  visible: boolean
}) {
  if (!visible) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-brand-purple/30 max-w-md w-full p-6 shadow-lg">
        <div className="flex flex-col space-y-4">
          <p className="text-brand-dark font-medium">{message}</p>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="bg-brand-purple hover:bg-brand-purple/90"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<{
    message: string
    resolve?: (value: boolean) => void
  } | null>(null)

  const [isVisible, setIsVisible] = useState(false)

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    setIsVisible(true)
    return new Promise((resolve) => {
      setConfirmState({
        message,
        resolve
      })
    })
  }, [])

  const handleConfirm = useCallback(async () => {
    setIsVisible(false)
    await new Promise(resolve => setTimeout(resolve, 300))
    confirmState?.resolve?.(true)
    setConfirmState(null)
  }, [confirmState])

  const handleCancel = useCallback(async () => {
    setIsVisible(false)
    await new Promise(resolve => setTimeout(resolve, 300))
    confirmState?.resolve?.(false)
    setConfirmState(null)
  }, [confirmState])

  const ConfirmComponent = useCallback(() => {
    if (!confirmState) return null
    return (
      <ConfirmModal 
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        visible={isVisible}
      />
    )
  }, [confirmState, handleConfirm, handleCancel, isVisible])

  return { showConfirm, ConfirmComponent }
}