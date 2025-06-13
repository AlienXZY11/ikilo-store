"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { Product } from "@/lib/mockData"
import type { CartItem } from "@/lib/dataService"
import { categoryLabels } from "@/lib/mockData"
import { formatPrice, debugLog } from "@/lib/utils"
import ProductVariantDialog from "@/components/ProductVariantDialog"

interface ProductCardProps {
  product: Product
  onAddToCart: (item: CartItem) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showVariantDialog, setShowVariantDialog] = useState(false)

  const handleOpenDialog = () => {
    debugLog("ProductCard", "Opening variant dialog for product", product.name)
    setShowVariantDialog(true)
  }

  const handleAddToCart = (item: CartItem) => {
    debugLog("ProductCard", "Adding item to cart from dialog", item)
    onAddToCart(item)
  }

  const prices = product.variations.map((v) => v.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceDisplay =
    minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group border-0 shadow-md hover:shadow-forest-green/20">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => debugLog("ProductCard", "Image load error", { productId: product.id, src: product.image })}
          />

          {/* Add Button - bottom right */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleOpenDialog}
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-gradient-to-r 
                    from-[hsl(var(--forest-green))] 
                    to-[hsl(var(--leaf-green))] 
                    text-white 
                    shadow-md 
                    hover:from-[hsl(var(--forest-green)_/0.9)] 
                    hover:to-[hsl(var(--leaf-green)_/0.9)] 
                    transition-all 
                    duration-200 
                    px-3 
                    py-2.5
                    flex 
                    items-center 
                    justify-center"
                     
                  >
                 <Plus className="h-5 w-5" />
            </button>
          </div>


          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-card/90 text-forest-green hover:bg-card text-xs font-medium">
              {categoryLabels[product.category] || product.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 flex-grow">
          <div className="space-y-2">
            <h3 className="font-bold text-foreground text-sm md:text-base leading-tight line-clamp-2">{product.name}</h3>
            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>

            <div className="flex items-center justify-between">
              <p className="text-sm md:text-base font-bold text-forest-green">{priceDisplay}</p>
              <p className="text-xs text-muted-foreground">{product.variations.length} varian</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          
        </CardFooter>
      </Card>

      <ProductVariantDialog
        product={product}
        isOpen={showVariantDialog}
        onClose={() => setShowVariantDialog(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  )
}
