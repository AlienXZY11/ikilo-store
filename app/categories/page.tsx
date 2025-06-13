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
import { ShoppingCart, Store, Search, ArrowLeft, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function CategoriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    // Get initial search query from URL params
    const query = searchParams.get("q") || ""
    setSearchQuery(query)
  }, [searchParams])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([dataService.getProducts(), dataService.getCategories()])
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

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Get category data for grid display
  const getCategoryImage = (categoryId: string) => {
    // You can customize these images per category
    return "/images/category-placeholder.png"
  }

  const getCategoryProductCount = (categoryId: string) => {
    if (categoryId === "all") return products.length
    return products.filter((p) => p.category === categoryId).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-green/30 to-lime-green/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime-green/30 border-t-forest-green mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat kategori...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-green/20 to-lime-green/20 pb-20 md:pb-0">
      {/* Compact Header */}
      <header className="bg-gradient-to-r from-forest-green to-leaf-green text-white shadow-lg sticky top-0 z-40">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 border-leaf-green/30 focus:border-leaf-green rounded-xl"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Grid3X3 className="h-5 w-5 text-forest-green" />
            <h2 className="text-xl font-bold text-forest-green">Pilih Kategori</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "border-forest-green bg-gradient-to-br from-lime-green/20 to-mint-green/20 shadow-lg"
                    : "border-gray-200 hover:border-leaf-green hover:shadow-md"
                }`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={getCategoryImage(category.id) || "/placeholder.svg"}
                    alt={category.displayName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-semibold text-sm mb-1">{category.displayName}</h3>
                    <p className="text-xs opacity-90">{getCategoryProductCount(category.id)} produk</p>
                  </div>
                </div>
                {selectedCategory === category.id && (
                  <div className="absolute top-2 right-2 bg-forest-green text-white rounded-full w-6 h-6 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-forest-green">
              {selectedCategory === "all"
                ? "Semua Produk"
                : categories.find((c) => c.id === selectedCategory)?.displayName}
            </h2>
            <Badge variant="secondary" className="bg-lime-green/20 text-forest-green">
              {filteredProducts.length} produk
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-lime-green/20 to-mint-green/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-leaf-green" />
              </div>
              <p className="text-gray-600 text-xl font-semibold mb-2">Tidak ada produk ditemukan</p>
              <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau kategori</p>
            </div>
          )}
        </div>
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
