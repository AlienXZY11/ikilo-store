"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, RefreshCw, SproutIcon as Seed, Database, List, Eye, Plus, Minus } from "lucide-react"
import type { Product, Category } from "@/lib/mockData"

interface DebugPanelProps {
  dataSource: "firebase" | "mock"
  productsCount: number
  cartItemsCount: number
  products: Product[]
  categories: Category[]
  selectedCategory: string
  onSeedData: () => void
  onRefreshData: () => void
}

export default function DebugPanel({
  dataSource,
  productsCount,
  cartItemsCount,
  products,
  categories,
  selectedCategory,
  onSeedData,
  onRefreshData,
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  const handleSeedData = async () => {
    setIsSeeding(true)
    try {
      await onSeedData()
      // Refresh data after seeding
      setTimeout(() => {
        onRefreshData()
        setIsSeeding(false)
      }, 1000)
    } catch (error) {
      console.error("Seeding failed:", error)
      setIsSeeding(false)
    }
  }

  // Analyze category distribution
  const categoryStats = categories.map((category) => {
    const productCount = products.filter((product) =>
      category.id === "all" ? true : product.category === category.id,
    ).length
    return {
      ...category,
      productCount,
    }
  })

  // Get products for selected category
  const filteredProducts = products.filter((product) =>
    selectedCategory === "all" ? true : product.category === selectedCategory,
  )

  // Get unique categories from products
  const productCategories = [...new Set(products.map((p) => p.category))]
  const definedCategories = categories.filter((c) => c.id !== "all").map((c) => c.id)
  const missingCategories = productCategories.filter((pc) => !definedCategories.includes(pc))
  const unusedCategories = definedCategories.filter((dc) => !productCategories.includes(dc))

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!isExpanded ? (
        // Collapsed state - just a button
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-12 w-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-xl"
          size="icon"
        >
          <Plus className="h-5 w-5" />
        </Button>
      ) : (
        // Expanded state - full panel
        <Card className="w-80 bg-gray-900 text-white border-gray-700 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Debug Panel
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-white hover:bg-gray-800 h-6 w-6 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Data Source */}
              <div className="flex items-center justify-between">
                <span className="text-xs flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  Data Source:
                </span>
                <Badge
                  variant={dataSource === "firebase" ? "default" : "secondary"}
                  className={dataSource === "firebase" ? "bg-green-600" : "bg-yellow-600"}
                >
                  {dataSource.toUpperCase()}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-gray-400">Products:</span>
                  <div className="font-mono text-green-400">{productsCount}</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-gray-400">Cart Items:</span>
                  <div className="font-mono text-blue-400">{cartItemsCount}</div>
                </div>
              </div>

              {/* Category Analysis */}
              <div className="bg-gray-800 p-2 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <List className="h-3 w-3" />
                    Categories:
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-white hover:bg-gray-700 h-5 w-5 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-yellow-400">
                    Selected: {selectedCategory} ({filteredProducts.length} products)
                  </div>

                  {showDetails && (
                    <div className="space-y-1 mt-2 border-t border-gray-700 pt-2">
                      <div className="text-gray-300">Category Distribution:</div>
                      {categoryStats.map((cat) => (
                        <div key={cat.id} className="flex justify-between">
                          <span className={cat.id === selectedCategory ? "text-yellow-400" : "text-gray-400"}>
                            {cat.displayName}:
                          </span>
                          <span className="text-green-400">{cat.productCount}</span>
                        </div>
                      ))}

                      {missingCategories.length > 0 && (
                        <div className="text-red-400 mt-2">Missing Categories: {missingCategories.join(", ")}</div>
                      )}

                      {unusedCategories.length > 0 && (
                        <div className="text-orange-400">Unused Categories: {unusedCategories.join(", ")}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRefreshData}
                  className="flex-1 text-xs border-gray-600 text-white hover:bg-gray-800"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className="flex-1 text-xs border-gray-600 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <Seed className={`h-3 w-3 mr-1 ${isSeeding ? "animate-spin" : ""}`} />
                  {isSeeding ? "Seeding..." : "Seed FB"}
                </Button>
              </div>

              {/* Environment Info */}
              <div className="text-xs text-gray-400 border-t border-gray-700 pt-2">
                <div>Mode: {process.env.NODE_ENV}</div>
                <div>Time: {new Date().toLocaleTimeString()}</div>
                <div className="text-yellow-400">📱 Catalog Only - No Order DB</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
