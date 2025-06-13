"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { dataService, type CartItem } from "@/lib/dataService"
import type { Product, Category } from "@/lib/mockData"
import { debugLog } from "@/lib/utils"
import ProductCard from "@/components/ProductCard"
import Cart from "@/components/Cart"
import MobileCartButton from "@/components/MobileCartButton"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ShoppingCart, Store, Search, ArrowLeft, Grid3X3, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function CategoriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [showProducts, setShowProducts] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  // Handle URL search params
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search") || ""
    const urlCategory = searchParams.get("category") || ""
    
    setSearchQuery(urlSearchQuery)
    setSelectedCategory(urlCategory)
    setIsSearching(!!urlSearchQuery)
    setShowProducts(!!(urlSearchQuery || urlCategory))
  }, [searchParams])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        dataService.getProducts(), 
        dataService.getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      debugLog("CategoriesPage", "Error fetching data", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.productId === item.productId && cartItem.variation === item.variation,
      )

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.productId === item.productId && cartItem.variation === item.variation
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem,
        )
      }

      return [...prev, item]
    })
  }

  const updateCartItem = (productId: string, variation: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variation)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId && item.variation === variation ? { ...item, quantity } : item)),
    )
  }

  const removeFromCart = (productId: string, variation: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.productId === productId && item.variation === variation)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setIsSearching(!!value)
    setShowProducts(!!value)
    
    // Update URL with search params
    const params = new URLSearchParams()
    if (value) params.set("search", value)
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory)
    
    const newUrl = params.toString() ? `/categories?${params.toString()}` : "/categories"
    router.replace(newUrl, { scroll: false })
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setShowProducts(true)
    
    // Update URL with category params
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (categoryId && categoryId !== "all") params.set("category", categoryId)
    
    const newUrl = params.toString() ? `/categories?${params.toString()}` : "/categories"
    router.replace(newUrl, { scroll: false })
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    
    // If no category selected, hide products and show categories
    if (!selectedCategory) {
      setShowProducts(false)
    }
    
    // Update URL without search params
    const params = new URLSearchParams()
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory)
    
    const newUrl = params.toString() ? `/categories?${params.toString()}` : "/categories"
    router.replace(newUrl, { scroll: false })
  }

  // Clear category filter
  const clearCategory = () => {
    setSelectedCategory("")
    
    // If no search query, hide products and show categories
    if (!searchQuery) {
      setShowProducts(false)
    }
    
    // Update URL without category params
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    
    const newUrl = params.toString() ? `/categories?${params.toString()}` : "/categories"
    router.replace(newUrl, { scroll: false })
  }

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || selectedCategory === "all" || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Get category data for grid display
  const getCategoryImage = (categoryId: string) => {
    return "/images/category-placeholder.png"
  }

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter((p) => p.category === categoryId).length
  }

  // Get current view title
  const getCurrentViewTitle = () => {
    if (isSearching && searchQuery) {
      return `Hasil pencarian "${searchQuery}"`
    }
    if (selectedCategory) {
      return categories.find((c) => c.id === selectedCategory)?.displayName || "Produk"
    }
    return "Produk"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-forest-green mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Memuat kategori...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Compact Header */}
      <header className="bg-gradient-to-r from-[hsl(var(--forest-green))] to-[hsl(var(--leaf-green))] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-white hover:bg-white/20 rounded-lg p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Store className="h-5 w-5" />
              </div>
              <h1 className="text-lg font-bold">Kategori & Pencarian</h1>
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                onClick={() => setShowCart(true)}
                variant="ghost"
                size="sm"
                className="hidden md:flex relative text-white hover:bg-white/20 rounded-lg"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline text-sm">Keranjang</span>
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Search Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-forest-green" />
            <h2 className="text-lg sm:text-xl font-bold text-forest-green">Cari Produk</h2>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Cari produk, nama, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 py-3 text-sm sm:text-base border-2 border-border focus:border-forest-green focus:ring-forest-green rounded-xl bg-card"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Categories Grid - Show when not searching and not showing products */}
        {!isSearching && !showProducts && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 text-forest-green" />
              <h2 className="text-lg sm:text-xl font-bold text-forest-green">Pilih Kategori</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:shadow-forest-green/20"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={getCategoryImage(category.id) || "/placeholder.svg"}
                      alt={category.displayName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white">
                      <h3 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-1">{category.displayName}</h3>
                      <p className="text-xs opacity-90">{getCategoryProductCount(category.id)} produk</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Search/Category Filter Display */}
        {(isSearching || selectedCategory) && (
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Filter aktif:</span>
              {isSearching && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1 text-xs">
                  <Search className="h-3 w-3" />
                  <span className="max-w-[150px] truncate">"{searchQuery}"</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="h-4 w-4 p-0 ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 flex items-center gap-1 text-xs">
                  <Grid3X3 className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">{categories.find((c) => c.id === selectedCategory)?.displayName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCategory}
                    className="h-4 w-4 p-0 ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Products Grid - Only show when showProducts is true */}
        {showProducts && (
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-forest-green">
                {getCurrentViewTitle()}
              </h2>
              <Badge variant="secondary" className="bg-card text-forest-green text-xs sm:text-sm">
                {filteredProducts.length} produk
              </Badge>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-muted/50 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 text-forest-green" />
                </div>
                <p className="text-foreground text-lg sm:text-xl font-semibold mb-2">
                  {isSearching ? "Tidak ada hasil pencarian" : "Tidak ada produk ditemukan"}
                </p>
                <p className="text-muted-foreground text-sm mb-4 px-4">
                  {isSearching 
                    ? `Tidak ditemukan produk dengan kata kunci "${searchQuery}"` 
                    : "Tidak ada produk dalam kategori ini"
                  }
                </p>
                {isSearching && (
                  <Button 
                    onClick={clearSearch}
                    variant="outline"
                    size="sm"
                    className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
                  >
                    Hapus Pencarian
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Welcome Message when no filters active */}
        {!showProducts && !isSearching && (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-muted/50 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Grid3X3 className="h-8 w-8 sm:h-12 sm:w-12 text-forest-green" />
            </div>
            <p className="text-foreground text-lg sm:text-xl font-semibold mb-2">Selamat datang di halaman kategori</p>
            <p className="text-muted-foreground text-sm px-4">Pilih kategori di atas atau gunakan pencarian untuk menemukan produk</p>
          </div>
        )}
      </div>

      {/* Mobile Cart Button */}
      <MobileCartButton cartItems={cartItems} onOpenCart={() => setShowCart(true)} />

      {/* Cart Modal */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateItem={updateCartItem}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </div>
  )
}