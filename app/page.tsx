"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { dataService, type CartItem } from "@/lib/dataService"
import type { Product, Category } from "@/lib/mockData"
import { debugLog } from "@/lib/utils"
import ProductCard from "@/components/ProductCard"
import Cart from "@/components/Cart"
import MobileCartButton from "@/components/MobileCartButton"
import MobileNavigation from "@/components/layout/MobileNavigation"
import DebugPanel from "@/components/DebugPanel"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ShoppingCart, Store, Search, AlertCircle, Wifi, WifiOff, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [dataSource, setDataSource] = useState<"firebase" | "mock">("mock")
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    fetchData()

    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const fetchData = async () => {
    try {
      debugLog("HomePage", "Starting data fetch...")
      setLoading(true)
      setError("")

      // Check Firebase connection first
      const isConnected = await dataService.checkFirebaseConnection()

      const [productsData, categoriesData] = await Promise.all([dataService.getProducts(), dataService.getCategories()])

      setProducts(productsData)
      setCategories(categoriesData)

      // Determine data source based on connection and data
      if (isConnected && productsData.length > 0 && productsData[0].id.length > 10) {
        setDataSource("firebase")
        debugLog("HomePage", "Using Firebase data")
      } else {
        setDataSource("mock")
        if (!isConnected) {
          setError("Tidak dapat terhubung ke database. Menggunakan data demo.")
        }
        debugLog("HomePage", "Using mock data")
      }

      debugLog("HomePage", `Data loaded successfully from ${dataSource}`, {
        products: productsData.length,
        categories: categoriesData.length,
      })
    } catch (error) {
      debugLog("HomePage", "Error fetching data", error)
      setError("Terjadi kesalahan saat memuat data. Menggunakan data demo.")
      setDataSource("mock")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item: CartItem) => {
    debugLog("HomePage", "Adding item to cart", item)

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
    debugLog("HomePage", "Updating cart item", { productId, variation, quantity })

    if (quantity <= 0) {
      removeFromCart(productId, variation)
      return
    }

    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId && item.variation === variation ? { ...item, quantity } : item)),
    )
  }

  const removeFromCart = (productId: string, variation: string) => {
    debugLog("HomePage", "Removing item from cart", { productId, variation })

    setCartItems((prev) => prev.filter((item) => !(item.productId === productId && item.variation === variation)))
  }

  const clearCart = () => {
    debugLog("HomePage", "Clearing cart")
    setCartItems([])
  }

  const handleSearchClick = () => {
    router.push(`/categories?search=${searchQuery}`)
  }

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-green/30 to-lime-green/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime-green/30 border-t-forest-green mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat katalog produk...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-green/20 to-lime-green/20 pb-20 md:pb-0">
      {/* Debug Panel - Only show in debug mode and not in customer mode */}
      {process.env.NEXT_PUBLIC_DEBUG_MODE === "true" && process.env.NEXT_PUBLIC_CUSTOMER_MODE !== "true" && (
        <DebugPanel
          dataSource={dataSource}
          productsCount={products.length}
          cartItemsCount={cartItemsCount}
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onSeedData={() => dataService.seedFirebaseData()}
          onRefreshData={fetchData}
        />
      )}

      {/* Compact Header */}
     <header className="bg-[hsl(var(--leaf-green))] text-white shadow-lg sticky top-0 z-40">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-14">
      <div className="flex items-center space-x-3">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <Store className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold">iKILO</h1>
        <div className="flex items-center space-x-2">
          {process.env.NEXT_PUBLIC_CUSTOMER_MODE !== "true" && (
            <>
              <Badge variant="secondary" className="text-xs bg-blue-500 text-white flex items-center gap-1">
                <Database className="h-3 w-3" />
                KATALOG
              </Badge>
              {dataSource === "mock" && (
                <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">
                  DEMO
                </Badge>
              )}
            </>
          )}
          {!isOnline && (
            <Badge variant="secondary" className="text-xs bg-red-500 text-white flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              OFFLINE
            </Badge>
          )}
          {isOnline && dataSource === "firebase" && process.env.NEXT_PUBLIC_CUSTOMER_MODE !== "true" && (
            <Badge variant="secondary" className="text-xs bg-green-600 text-white flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              ONLINE
            </Badge>
          )}
        </div>
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



      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Desktop Search and Category Filter */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={handleSearchClick}
              className="pl-10 border-2 border-leaf-green/30 focus:border-leaf-green rounded-xl cursor-pointer"
              readOnly
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-2 border-leaf-green/30 focus:border-leaf-green rounded-xl">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      {/* Mobile Cart Button */}
      <MobileCartButton cartItems={cartItems} onOpenCart={() => setShowCart(true)} />

      {/* Mobile Bottom Navigation */}
      <MobileNavigation selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

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
