"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart, X } from "lucide-react"
import type { Product } from "@/lib/mockData"
import type { CartItem } from "@/lib/dataService"
import { categoryLabels } from "@/lib/mockData"
import { formatPrice, debugLog } from "@/lib/utils"
import Image from "next/image"

interface ProductVariantDialogProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: CartItem) => void
}

export default function ProductVariantDialog({ product, isOpen, onClose, onAddToCart }: ProductVariantDialogProps) {
  const [selectedVariation, setSelectedVariation] = useState<string>("")
  const [quantity, setQuantity] = useState(1)

  const selectedVariationData = product?.variations.find((v) => v.name === selectedVariation)

  const handleAddToCart = () => {
    if (!product || !selectedVariationData) return

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      variation: selectedVariation,
      price: selectedVariationData.price,
      quantity,
    }

    debugLog("ProductVariantDialog", "Adding to cart", cartItem)
    onAddToCart(cartItem)

    // Reset and close
    setSelectedVariation("")
    setQuantity(1)
    onClose()
  }

  const handleClose = () => {
    setSelectedVariation("")
    setQuantity(1)
    onClose()
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto border-0 shadow-2xl">
        {/* Custom Close Button - Always Visible */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors shadow-md"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        <DialogHeader className="pb-4">
          <DialogTitle className="text-left text-xl font-bold text-forest-green">Pilih Varian Produk</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gradient-to-br from-mint-green/30 to-lime-green/30">
              <Image
                src={product.image || "/placeholder.svg?height=80&width=80"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-forest-green">{product.name}</h3>
              <Badge className="bg-lime-green/20 text-forest-green hover:bg-lime-green/20 text-xs mt-1">
                {categoryLabels[product.category] || product.category}
              </Badge>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
            </div>
          </div>

          {/* Variant Selection */}
          <div>
            <label className="text-sm font-semibold text-forest-green mb-3 block">Pilih Varian</label>
            <div className="grid gap-3">
              {product.variations.map((variation) => (
                <button
                  key={variation.name}
                  onClick={() => setSelectedVariation(variation.name)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedVariation === variation.name
                      ? "border-forest-green bg-gradient-to-r from-lime-green/20 to-mint-green/20 shadow-md"
                      : "border-gray-200 hover:border-leaf-green hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{variation.name}</span>
                    <span className="font-bold text-forest-green">{formatPrice(variation.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          {selectedVariation && (
            <div>
              <label className="text-sm font-semibold text-forest-green mb-3 block">Jumlah</label>
              <div className="flex items-center justify-center space-x-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 p-0 border-2 border-leaf-green/30 hover:border-leaf-green hover:bg-lime-green/20"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-bold text-forest-green w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 p-0 border-2 border-leaf-green/30 hover:border-leaf-green hover:bg-lime-green/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Total Price */}
          {selectedVariationData && (
            <div className="bg-gradient-to-r from-lime-green/20 to-mint-green/20 border-2 border-leaf-green/30 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Total Harga:</span>
                <span className="text-2xl font-bold text-forest-green">
                  {formatPrice(selectedVariationData.price * quantity)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-2 border-gray-300 hover:border-gray-400"
            >
              Batal
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariation}
              className="flex-1 bg-gradient-to-r from-forest-green to-leaf-green hover:from-forest-green/90 hover:to-leaf-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
