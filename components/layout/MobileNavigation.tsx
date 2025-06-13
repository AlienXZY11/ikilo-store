"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, LayoutGrid, Search } from "lucide-react"

interface MobileNavigationProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

export default function MobileNavigation({ selectedCategory, onCategoryChange }: MobileNavigationProps) {
  const router = useRouter()

  const handleSearchClick = () => {
    router.push("/categories")
  }

  const handleHomeClick = () => {
    if (onCategoryChange) {
      onCategoryChange("all")
    }
    router.push("/")
  }

  const handleCategoriesClick = () => {
    router.push("/categories")
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-leaf-green/20 z-50 shadow-lg">
      <div className="flex items-center justify-around py-2">
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 py-3 px-4 h-auto hover:bg-lime-green/20"
          onClick={handleHomeClick}
        >
          <Home className="h-5 w-5 text-forest-green" />
          <span className="text-xs font-medium text-forest-green">Home</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 py-3 px-4 h-auto hover:bg-lime-green/20"
          onClick={handleCategoriesClick}
        >
          <LayoutGrid className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Kategori</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 py-3 px-4 h-auto hover:bg-lime-green/20"
          onClick={handleSearchClick}
        >
          <Search className="h-5 w-5 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Cari</span>
        </Button>
      </div>
    </div>
  )
}
