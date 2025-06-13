"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { CheckCircle, User, Phone, MapPin, FileText, ShoppingBag, } from "lucide-react"
import type { CartItem } from "@/lib/dataService"

interface OrderConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  customerName: string
  customerPhone: string
  customerAddress: string
  notes: string
  cartItems: CartItem[]
  totalPrice: number
}

export default function OrderConfirmation({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  customerPhone,
  customerAddress,
  notes,
  cartItems,
  totalPrice,
}: OrderConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Konfirmasi Pesanan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Informasi Pelanggan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Nama:</span>
                <span className="font-medium">{customerName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Telepon:</span>
                <span className="font-medium">{customerPhone}</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span className="text-gray-600">Alamat:</span>
                <span className="font-medium break-words flex-1">{customerAddress}</span>
              </div>

              {notes && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-gray-600">Catatan:</span>
                  <span className="font-medium break-words flex-1">{notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Detail Pesanan
            </h3>
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.productId}-${item.variation}`}
                  className="flex justify-between text-sm p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">{item.productName}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.variation} x {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium text-right text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg flex items-center gap-2">
              
                Total:
              </span>
              <span className="text-xl font-bold text-green-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 text-center bg-blue-50 p-3 rounded-lg">
            Pastikan semua informasi di atas sudah benar sebelum melanjutkan
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Edit Pesanan
          </Button>
          <Button onClick={onConfirm} className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700">
            Konfirmasi & Lanjutkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
