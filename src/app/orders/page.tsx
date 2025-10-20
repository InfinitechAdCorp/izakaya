"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Clock, CheckCircle, XCircle, Truck, User, LogIn, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import type { Order } from "@/types"
import { toast } from "@/hooks/use-toast"

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const itemsPerPage = 6

  useEffect(() => {
    const checkAuthAndFetchOrders = async () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (!token) {
        setLoading(false)
        return
      }

      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }

      try {
        const response = await apiClient.getOrders()
        console.log("[v0] Orders API response:", response)

        if (response.success && response.data) {
          console.log("[v0] Orders data:", response.data)
          const ordersData = Array.isArray(response.data)
            ? response.data
            : response.data.data || response.data.orders || []
          setOrders(ordersData)
          setFilteredOrders(ordersData)
        } else {
          setOrders([])
          setFilteredOrders([])
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        setOrders([])
        setFilteredOrders([])
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load orders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchOrders()
  }, [])

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.order_status === activeFilter))
    }
    setCurrentPage(1)
  }, [activeFilter, orders])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
      case "preparing":
        return <Package className="w-4 h-4" />
      case "ready":
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "ready":
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusCount = (status: string) => {
    if (status === "all") return orders.length
    return orders.filter(order => order.order_status === status).length
  }

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = filteredOrders.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        <div className="container mx-auto px-4 py-12 max-w-md">
          <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h1>
              <p className="text-gray-600 mb-6">Please log in to view your order history.</p>
              <div className="flex gap-3">
                <Link href="/login" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 pb-20 sm:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
             Order History
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 border border-green-200">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            {user && (
              <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-200 shadow-sm">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 text-sm">Welcome, {user.name}!</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-6">
          <TabsList className="bg-white/90 backdrop-blur-sm border border-green-200 p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1.5">
              All ({getStatusCount("all")})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1.5">
              Pending ({getStatusCount("pending")})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1.5">
              Confirmed ({getStatusCount("confirmed")})
            </TabsTrigger>
            <TabsTrigger value="preparing" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1.5">
              Preparing ({getStatusCount("preparing")})
            </TabsTrigger>
            <TabsTrigger value="out_for_delivery" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1.5">
              Delivery ({getStatusCount("out_for_delivery")})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1.5">
              Delivered ({getStatusCount("delivered")})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs sm:text-sm px-2 py-1.5">
              Cancelled ({getStatusCount("cancelled")})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {currentOrders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Card className="max-w-md bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
                <p className="text-gray-600 mb-6">
                  {activeFilter === "all" 
                    ? "You haven't placed any orders yet. Start exploring our delicious Korean menu!"
                    : `No ${activeFilter.replace("_", " ")} orders found.`
                  }
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  size="lg"
                >
                  <Link href="/menu">Browse Menu 🍜</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Orders Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
              {currentOrders.map((order) => {
                const orderStatus = order.order_status || "pending"
                const orderItems = order.order_items || []

                return (
                  <Card
                    key={order.id}
                    className="bg-white/90 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all overflow-hidden !p-0 hover:scale-[1.02]"
                  >
                    <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-500 to-emerald-500 text-white !p-3">
                      <div className="flex justify-between items-center gap-4">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-white text-base font-semibold">
                            {order.order_number}
                          </CardTitle>
                          <p className="text-xs text-white/80 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <Badge className={`${getStatusColor(orderStatus)} flex items-center gap-1 text-xs`}>
                            {getStatusIcon(orderStatus)}
                            <span className="capitalize">{orderStatus.replace("_", " ")}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      {/* Compact Order Items */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 text-xs mb-1.5 flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          Items ({orderItems.length})
                        </h4>
                        <div className="space-y-1.5">
                          {orderItems.slice(0, 2).map((item: any) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-1.5 bg-green-50/50 rounded text-xs"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">{item.name}</p>
                                <p className="text-gray-600">
                                  {item.quantity} × ₱{item.price}
                                </p>
                              </div>
                              <p className="font-semibold text-green-600 ml-2 flex-shrink-0">
                                ₱{item.subtotal || item.price * item.quantity}
                              </p>
                            </div>
                          ))}
                          {orderItems.length > 2 && (
                            <p className="text-xs text-gray-500 italic pl-1.5">
                              +{orderItems.length - 2} more item{orderItems.length - 2 > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delivery Info - Compact */}
                      <div className="mb-3 bg-gray-50 p-2 rounded text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-600">Payment:</span>
                            <span className="font-medium ml-1 capitalize">{order.payment_method}</span>
                          </div>
                          <div className="sm:text-right">
                            <span className="text-gray-600">City:</span>
                            <span className="font-medium ml-1">{order.delivery_city}</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-2 bg-green-200" />

                      {/* Order Summary - Compact */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal:</span>
                          <span>₱{order.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery:</span>
                          <span>₱{order.delivery_fee}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-sm pt-1 border-t border-green-100">
                          <span>Total:</span>
                          <span className="text-green-600">₱{order.total_amount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(page)}
                            className={
                              currentPage === page
                                ? "bg-green-500 hover:bg-green-600 text-white min-w-[2rem] h-8"
                                : "border-green-300 text-green-600 hover:bg-green-50 min-w-[2rem] h-8"
                            }
                          >
                            {page}
                          </Button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 flex items-center">...</span>
                      }
                      return null
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-green-300 text-green-600 hover:bg-green-50 disabled:opacity-50"
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}
                </div>
              </div>
            )}

            {/* Page Info for single page */}
            {totalPages <= 1 && filteredOrders.length > 0 && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Showing all {filteredOrders.length} orders
              </div>
            )}
          </>
        )}

        {/* Order More Button */}
        <div className="text-center mt-8">
          <Button
            asChild
            variant="outline"
            className="border-green-300 text-green-600 hover:bg-green-50 hover:text-green-700 bg-white/90"
            size="lg"
          >
            <Link href="/menu">Order More Food 🍜</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Orders