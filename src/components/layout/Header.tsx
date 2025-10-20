"use client"

import { useState, useEffect } from "react"
import { useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, ShoppingCart, LogOut, Download, User, Home, UtensilsCrossed, Info, Phone, Package } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import Image from "next/image"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { getItemCount } = useCartStore()
  const itemCount = getItemCount()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowInstallButton(false)
    }

    setDeferredPrompt(null)
  }

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user_data")
      const storedToken = localStorage.getItem("auth_token")

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log("[Header] User loaded from storage:", parsedUser)
      } else {
        setUser(null)
        console.log("[Header] No user data or token found")
      }
    } catch (error) {
      console.error("[Header] Error loading user from storage:", error)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    loadUserFromStorage()

    const handleUserUpdate = () => {
      console.log("[Header] User update event received")
      loadUserFromStorage()
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_data" || e.key === "auth_token") {
        console.log("[Header] Storage change detected for:", e.key)
        loadUserFromStorage()
      }
    }

    window.addEventListener("userDataUpdated", handleUserUpdate)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("userDataUpdated", handleUserUpdate)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [loadUserFromStorage])

  // Early return after hooks to preserve hook order
  if (pathname.startsWith("/admin")) {
    return null
  }

  const handleLogout = () => {
    console.log("[Header] Logging out user")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
    window.dispatchEvent(new CustomEvent("userDataUpdated"))
    router.push("/login")
  }

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Menu", href: "/menu", icon: UtensilsCrossed },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ]

  const isActivePage = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-green-100 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-amber-50/30 to-green-50/50">
        <div className="absolute top-1 left-4 w-12 h-12 bg-gradient-to-br from-green-200/40 to-amber-200/30 rounded-full blur-xl opacity-60"></div>
        <div className="absolute top-2 right-8 w-8 h-8 bg-gradient-to-br from-amber-200/40 to-green-200/30 rounded-full blur-lg opacity-50"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Image src="/images/bonga-logo.jpg" alt="BONGA Restaurant Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">BONGA</span>
              <span className="text-xs text-green-600 font-medium -mt-0.5 hidden sm:block">Korean Cuisine</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg transform hover:scale-105 ${
                  isActivePage(item.href)
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 hover:text-white hover:shadow-md"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Install button - hidden on mobile to save space */}
            {showInstallButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstallApp}
                className="hidden lg:flex items-center space-x-1 border-green-300 text-green-600 hover:bg-green-50 bg-transparent text-xs"
              >
                <Download className="h-3 w-3" />
                <span className="hidden lg:inline text-xs">Install</span>
              </Button>
            )}

            {/* User info - compact for mobile */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/orders">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer">
                    <User className="h-3 w-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700 max-w-20 truncate">{user.name}</span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs px-3 py-1.5 h-8"
                >
                  Login
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                className="relative bg-gradient-to-r from-green-600 to-green-700 border-green-300 text-white hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm hover:shadow-md p-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[18px] h-5 flex items-center justify-center text-xs bg-white text-green-600 border-2 border-green-500 shadow-md animate-pulse font-bold">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu - more prominent */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 p-2"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white border-l border-gray-200">
                <div className="flex flex-col h-full py-4">
                  <div className="flex items-center space-x-3 pb-6 border-b border-gray-100">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-md">
                      <Image src="/images/bonga-logo.jpg" alt="BONGA Logo" fill className="object-contain" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">BONGA Restaurant</h2>
                      <p className="text-sm text-green-600">Korean Cuisine</p>
                    </div>
                  </div>

                  {/* Navigation - Remove flex-1 to prevent stretching */}
                  <nav className="py-4">
                    <div className="space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 w-full text-left px-4 py-4 text-base font-medium rounded-lg transition-all duration-300 ${
                            isActivePage(item.href)
                              ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* Quick Actions Section */}
                  <div className="py-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 px-4">Quick Actions</h3>
                    <div className="space-y-2">
                      {user && (
                        <Link href="/orders" onClick={() => setIsOpen(false)}>
                          <div className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            <Package className="h-5 w-5" />
                            <span className="font-medium">My Orders</span>
                          </div>
                        </Link>
                      )}
                      
                      <Link href="/cart" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="font-medium">View Cart</span>
                          </div>
                          {itemCount > 0 && (
                            <Badge className="bg-green-600 text-white px-2 py-1 text-xs">{itemCount}</Badge>
                          )}
                        </div>
                      </Link>

                      {showInstallButton && (
                        <button
                          onClick={() => {
                            handleInstallApp()
                            setIsOpen(false)
                          }}
                          className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Download className="h-5 w-5" />
                          <span className="font-medium">Install App</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Restaurant Info Section */}
                  <div className="py-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 px-4">Restaurant Info</h3>
                    <div className="space-y-3 px-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Open 24 Hours</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Free delivery over ₱300.00</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>Authentic Korean cuisine</span>
                      </div>
                    </div>
                  </div>

                  {/* User section */}
                  <div className="mt-auto border-t border-gray-100 pt-4">
                    {user ? (
                      <div className="space-y-3">
                        <Link href="/orders" onClick={() => setIsOpen(false)}>
                          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <User className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">Hello, {user.name}!</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                          className="flex items-center justify-center space-x-2 w-full border-red-300 text-red-600 hover:bg-red-50 py-3"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </Button>
                      </div>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 font-semibold"
                        >
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header