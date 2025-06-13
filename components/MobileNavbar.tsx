"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, LayoutGrid, Search, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Category } from "@/lib/mockData"

interface MobileNavbarProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function MobileNavbar({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: MobileNavbarProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 py-2 px-4 h-auto"
            onClick={() => {
              onCategoryChange("all")
              setShowCategories(false)
            }}
          >
            <Home className="h-5 w-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Home</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 py-2 px-4 h-auto"
            onClick={() => setShowCategories(true)}
          >
            <LayoutGrid className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Kategori</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 py-2 px-4 h-auto"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Cari</span>
          </Button>
        </div>
      </div>

      {/* Search Modal */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-md p-0" >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Cari Produk</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)} className="h-8 w-8 p-0">
              
            </Button>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            <Button onClick={() => setShowSearch(false)} className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Cari
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Categories Modal */}
      <Dialog open={showCategories} onOpenChange={setShowCategories}>
        <DialogContent className="max-w-md p-0" >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Pilih Kategori</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowCategories(false)} className="h-8 w-8 p-0">
              
            </Button>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`w-full justify-start ${
                    selectedCategory === category.id ? "bg-green-600 hover:bg-green-700" : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    onCategoryChange(category.id)
                    setShowCategories(false)
                  }}
                >
                  {category.displayName}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
