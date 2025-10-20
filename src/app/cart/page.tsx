"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { toast } from "@/hooks/use-toast"

const getImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    return "/placeholder.svg"
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  let fullPath = imagePath
  if (!imagePath.startsWith("images/products/")) {
    fullPath = `images/products/${imagePath}`
  }

  return `${API_BASE_URL}/${fullPath}`
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()
  const total = getTotal()

  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemoveItem = (itemId: string | number, itemName: string) => {
    removeItem(itemId)
    toast({
      title: "Item removed",
      description: `${itemName} has been removed from your cart.`,
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/25 to-green-400/25 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-green-300/20 to-emerald-400/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-emerald-300/30 to-green-300/30 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="backdrop-blur-sm bg-white/20 rounded-3xl p-12 max-w-md mx-auto border border-white/30 shadow-2xl">
                <div className="relative">
                  <ShoppingBag className="w-24 h-24 text-green-500/70 mx-auto mb-6" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"></div>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-gray-800 text-balance">Your Cart is Empty</h1>
                <p className="text-xl text-gray-600 mb-8 text-pretty">
                  Looks like you haven't added any delicious Korean dishes yet!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/menu">Browse Our Menu 🍜</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/25 to-green-400/25 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-green-300/20 to-emerald-400/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-emerald-300/30 to-green-300/30 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🇰🇷</span>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-balance">
                    Your Cart ({items.length} {items.length === 1 ? "item" : "items"})
                  </h1>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-green-600 hover:bg-green-50 border-green-200 hover:border-green-300 backdrop-blur-sm bg-white/50"
                >
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => {
                  const itemPrice = Number(item.price) || 0
                  const itemTotal = itemPrice * item.quantity
                  
                  return (
                    <Card
                      key={item.id}
                      className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/70 border-white/50 rounded-2xl overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">
                            <img
                              src={getImageUrl(item.image) || "/placeholder.svg?height=96&width=96&query=Korean food"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/korean-food.jpg"
                              }}
                            />
                            <div className="absolute top-1 left-1 w-6 h-4 bg-white rounded-sm flex items-center justify-center text-xs">
                              🇰🇷
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id, item.name)}
                                className="text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-white/50 border-emerald-200">
                                  {item.category}
                                </Badge>
                                {item.isSpicy && (
                                  <Badge className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white">
                                    🌶️ Spicy
                                  </Badge>
                                )}
                                {item.isVegetarian && (
                                  <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                    🌱 Veggie
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white/50 rounded-full p-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-green-100"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-emerald-100"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="text-right">
                                  <div className="text-sm text-gray-500">₱{formatPrice(itemPrice)} each</div>
                                  <div className="font-semibold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    ₱{formatPrice(itemTotal)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className="lg:w-96">
              <Card className="sticky top-24 backdrop-blur-sm bg-white/70 border-white/50 rounded-2xl shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-2xl">
                  <CardTitle className="text-xl flex items-center gap-2">🇰🇷 Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₱{formatPrice(total)}</span>
                    </div>
                    <hr className="my-2 border-emerald-200" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₱{formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    <Link href="/checkout">Proceed to Checkout 🛒</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-emerald-200 hover:bg-emerald-50 rounded-xl bg-transparent"
                    size="lg"
                  >
                    <Link href="/menu">Continue Shopping 🍜</Link>
                  </Button>

                  <div className="text-xs text-gray-500 text-center bg-white/50 rounded-lg p-2">
                    🔒 Secure checkout • 한국 요리 ❤️
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart