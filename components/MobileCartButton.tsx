"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { CartItem } from "@/lib/dataService"

interface MobileCartButtonProps {
  cartItems: CartItem[]
  onOpenCart: () => void
}

export default function MobileCartButton({ cartItems, onOpenCart }: MobileCartButtonProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const runningTexts = [
    "Lengkapi keperluan anda hari ini",
    "Sayur segar setiap hari",
    "Belanja mudah, hemat waktu",
    "Kualitas terbaik untuk keluarga",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % runningTexts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (cartItemsCount === 0) return null

  return (
    <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
      <div className="relative">
        <Button
          onClick={onOpenCart}
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg border-0 h-14 px-4"
          style={{
            borderRadius: "9999px 9999px 9999px 9999px",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-base">Lihat Keranjang</div>
                <div className="text-xs opacity-90 animate-pulse">{runningTexts[currentTextIndex]}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-base">{formatPrice(totalPrice)}</div>
              <div className="text-xs opacity-90">{cartItemsCount} Barang</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
}
