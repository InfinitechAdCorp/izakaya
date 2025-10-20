"use client"

import { useState, useEffect } from "react"
import { useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  LogOut,
  Download,
  User,
  Home,
  Calendar,
  ChefHat,
  MessageSquare,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
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
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("[Header] Error loading user from storage:", error)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    loadUserFromStorage()

    const handleUserUpdate = () => {
      loadUserFromStorage()
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user_data" || e.key === "auth_token") {
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

  if (pathname.startsWith("/admin")) {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
    window.dispatchEvent(new CustomEvent("userDataUpdated"))
    router.push("/login")
  }

  const mainNav = [
    { name: "Home", href: "/", icon: Home },
    { name: "Menu", href: "/menu", icon: ChefHat },
    { name: "Reservations", href: "/reservations", icon: Calendar },
  ]

  const moreNav = [
    { name: "Blog", href: "/blog" },
    { name: "Chefs", href: "/chefs" },
    // { name: "Events", href: "/events" },
    { name: "Promos", href: "/promos" },
    { name: "Testimonials", href: "/testimonials" },
  ]

  const isActivePage = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-orange-100 shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-yellow-50/30 to-orange-50/50">
        <div className="absolute top-1 left-4 w-12 h-12 bg-gradient-to-br from-orange-200/40 to-yellow-200/30 rounded-full blur-xl opacity-60"></div>
        <div className="absolute top-2 right-8 w-8 h-8 bg-gradient-to-br from-yellow-200/40 to-orange-200/30 rounded-full blur-lg opacity-50"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Image src="/logo.png" alt="Izakaya Tori Ichizu Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-base md:text-lg font-bold text-gray-800 leading-tight">Izakaya </span>
              <span className="text-md text-orange-600 font-medium -mt-0.5 hidden sm:block">Tori Ichizu</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  isActivePage(item.href)
                    ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Dropdown for More */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300">
                <span>More</span>
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-orange-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {moreNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActivePage(item.href)
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {showInstallButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstallApp}
                className="hidden lg:flex items-center space-x-1 border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent text-xs"
              >
                <Download className="h-3 w-3" />
                <span className="hidden lg:inline text-xs">Install</span>
              </Button>
            )}

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
                  className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs px-3 py-1.5 h-8"
                >
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
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
                      <Image src="/logo.png" alt="Izakaya Logo" fill className="object-contain" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800">Izakaya Tori Ichizu</h2>
                      <p className="text-sm text-orange-600">Japanese Izakaya</p>
                    </div>
                  </div>

                  <nav className="py-4">
                    <div className="space-y-2">
                      {mainNav.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                            isActivePage(item.href)
                              ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </nav>

                  <div className="py-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 px-4">Explore</h3>
                    <div className="space-y-2">
                      {moreNav.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors"
                        >
                          <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="py-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 px-4">Restaurant Info</h3>
                    <div className="space-y-3 px-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span>Open 24 Hours</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Free delivery over ₱300.00</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Authentic Japanese cuisine</span>
                      </div>
                    </div>
                  </div>

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
                          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 font-semibold"
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