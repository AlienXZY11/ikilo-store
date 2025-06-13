"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, Trash2, MessageCircle, ShoppingCart, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/lib/dataService"
import { formatPrice, debugLog } from "@/lib/utils"
import OrderConfirmation from "@/components/OrderConfirmation"
import { dataService } from "@/lib/dataService"

interface CartProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateItem: (productId: string, variation: string, quantity: number) => void
  onRemoveItem: (productId: string, variation: string) => void
  onClearCart: () => void
}

export default function Cart({ isOpen, onClose, cartItems, onUpdateItem, onRemoveItem, onClearCart }: CartProps) {
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6208998771777"

  const handleProceedToConfirmation = () => {
    if (!customerName.trim() || !customerAddress.trim() || !customerPhone.trim()) {
      alert("Mohon lengkapi nama, alamat, dan nomor telepon")
      return
    }
    setShowConfirmation(true)
  }

  const handleCheckout = async () => {
    // Generate order ID for reference
    const orderId = `ORD-${Date.now()}`
    const orderDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    // Save order to Firebase
    try {
      const orderData = {
        id: orderId,
        customerName,
        customerPhone,
        customerAddress,
        notes,
        items: cartItems,
        totalPrice,
        status: "pending" as const,
      }

      await dataService.saveOrder(orderData)
      debugLog("Cart", "Order saved to Firebase", orderData)
    } catch (error) {
      console.error("Error saving order:", error)
      // Continue with WhatsApp message even if Firebase save fails
    }

    // Create WhatsApp message with new format
    let message = `PESANAN BARU - iKILO\n\n`
    message += `Order ID: ${orderId}\n`
    message += `Tanggal: ${orderDate}\n\n`

    message += `INFORMASI PELANGGAN\n`
    message += `• Nama     : ${customerName}\n`
    message += `• Telepon  : ${customerPhone}\n`
    message += `• Alamat   : ${customerAddress}\n\n`

    message += `DETAIL PESANAN\n`
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.productName}\n`
      message += `   • Varian    : ${item.variation}\n`
      message += `   • Harga     : ${formatPrice(item.price)}\n`
      message += `   • Jumlah    : ${item.quantity}\n`
      message += `   • Subtotal  : ${formatPrice(item.price * item.quantity)}\n\n`
    })

    message += `TOTAL PEMBAYARAN: ${formatPrice(totalPrice)}\n\n`

    if (notes.trim()) {
      message += `Catatan: ${notes}\n\n`
    }

    message += `Mohon konfirmasi pesanan ini. Terima kasih!`

    // Fix for iOS - use location.href instead of window.open
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    // Detect if user is on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    if (isIOS) {
      // For iOS, use location.href to avoid popup blockers
      location.href = whatsappUrl
    } else {
      // For other platforms, use window.open
      window.open(whatsappUrl, "_blank")
    }

    // Reset form and close
    setCustomerName("")
    setCustomerAddress("")
    setCustomerPhone("")
    setNotes("")
    setShowCheckout(false)
    setShowConfirmation(false)
    onClearCart()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-0"
        
      >
        {/* Custom Header with Single Close Button */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Keranjang Belanja</h2>
          </div>
          <Button
           variant="ghost"
           size="sm"
           onClick={onClose}
             className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
            <X className="h-5 w-5" />
          </Button>

        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Keranjang masih kosong</p>
              <p className="text-gray-400 text-sm mt-2">Pilih produk untuk mulai berbelanja</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.variation}`}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                  >
                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-base">{item.productName}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.variation}</p>
                          <p className="text-sm font-medium text-green-600 mt-1">{formatPrice(item.price)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.productId, item.variation)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="font-bold text-lg text-gray-900">{formatPrice(item.price * item.quantity)}</p>

                        {/* Quantity Controls - Center for Desktop */}
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateItem(item.productId, item.variation, item.quantity - 1)}
                            className="h-8 w-8 p-0 border-gray-300"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateItem(item.productId, item.variation, item.quantity + 1)}
                            className="h-8 w-8 p-0 border-gray-300"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">{item.variation}</p>
                          <p className="text-sm font-medium text-green-600">{formatPrice(item.price)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.productId, item.variation)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="font-bold text-lg text-gray-900">{formatPrice(item.price * item.quantity)}</p>

                        {/* Quantity Controls - Right for Mobile */}
                        <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateItem(item.productId, item.variation, item.quantity - 1)}
                            className="h-8 w-8 p-0 border-gray-300"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateItem(item.productId, item.variation, item.quantity + 1)}
                            className="h-8 w-8 p-0 border-gray-300"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Checkout Form */}
              {!showCheckout ? (
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full btn-primary w-full text-lg py-6 flex justify-center items-center gap-2"
                  size="lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Pesan via WhatsApp
                </Button>
              ) : (
                <div className="space-y-4">
                  <Separator />
                  <h3 className="font-semibold text-lg text-gray-900">Informasi Pemesanan</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
                        Nama Lengkap *
                      </Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerPhone" className="text-sm font-medium text-gray-700">
                        Nomor Telepon *
                      </Label>
                      <Input
                        id="customerPhone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Contoh: 08123456789"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerAddress" className="text-sm font-medium text-gray-700">
                        Alamat Lengkap *
                      </Label>
                      <Textarea
                        id="customerAddress"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Masukkan alamat lengkap untuk pengiriman"
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                        Catatan (Opsional)
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Catatan khusus untuk pesanan (opsional)"
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                      Kembali
                    </Button>
                    <Button
                      onClick={handleProceedToConfirmation}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={!customerName.trim() || !customerAddress.trim() || !customerPhone.trim()}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Lanjutkan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Order Confirmation Dialog */}
      <OrderConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleCheckout}
        customerName={customerName}
        customerPhone={customerPhone}
        customerAddress={customerAddress}
        notes={notes}
        cartItems={cartItems}
        totalPrice={totalPrice}
      />
    </Dialog>
  )
}
