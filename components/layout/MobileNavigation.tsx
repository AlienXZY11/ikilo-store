"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, LayoutGrid, Search } from "lucide-react"

interface MobileNavigationProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

export default function MobileNavigation({ selectedCategory, onCategoryChange }: MobileNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSearchClick = () => {
    // Navigate to categories page without any search params to show search interface
    router.push("/categories")
  }

  const handleHomeClick = () => {
    if (onCategoryChange) {
      onCategoryChange("all")
    }
    router.push("/")
  }

  const handleCategoriesClick = () => {
    // Navigate to categories page
    router.push("/categories")
  }

  // Determine active state for each button
  const isHome = pathname === "/"
  const isCategories = pathname === "/categories"

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-leaf-green/20 z-50 shadow-lg">
      <div className="flex items-center justify-around py-1.5">
        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-0.5 py-2 px-2 h-auto hover:bg-lime-green/20 ${
            isHome ? "bg-lime-green/20" : ""
          }`}
          onClick={handleHomeClick}
        >
          <Home className={`h-4 w-4 ${isHome ? "text-forest-green" : "text-gray-600"}`} />
          <span className={`text-xs font-medium ${isHome ? "text-forest-green" : "text-gray-600"}`}>
            Home
          </span>
        </Button>

        <Button
          variant="ghost"
          className={`flex flex-col items-center gap-0.5 py-2 px-2 h-auto hover:bg-lime-green/20 ${
            isCategories ? "bg-lime-green/20" : ""
          }`}
          onClick={handleCategoriesClick}
        >
          <LayoutGrid className={`h-4 w-4 ${isCategories ? "text-forest-green" : "text-gray-600"}`} />
          <span className={`text-xs font-medium ${isCategories ? "text-forest-green" : "text-gray-600"}`}>
            Kategori
          </span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center gap-0.5 py-2 px-2 h-auto hover:bg-lime-green/20"
          onClick={handleSearchClick}
        >
          <Search className="h-4 w-4 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">Cari</span>
        </Button>
      </div>
    </div>
  )
}