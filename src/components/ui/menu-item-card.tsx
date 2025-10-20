"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Flame, Leaf, Info } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { toast } from "@/hooks/use-toast"
import type { MenuItem } from "@/types"

interface MenuItemCardProps {
  item: MenuItem
}

const getImageUrl = (imagePath: unknown): string => {
  if (typeof imagePath !== "string" || imagePath.trim() === "") {
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

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(item)
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const isSpicy = item.isSpicy || item.is_spicy || false
  const isVegetarian = item.isVegetarian || item.is_vegetarian || false

  return (
    <>
      <Card className="overflow-hidden bg-gradient-to-br from-green-800 via-emerald-700 to-green-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative flex flex-col h-full">
        <div className="absolute top-2 right-2 z-10 hidden sm:block">
          <span className="text-white text-[10px] font-medium drop-shadow-lg">한국 요리</span>
        </div>

        <div className="absolute top-8 right-2 z-10 flex-col gap-1 hidden sm:flex">
          {isSpicy && (
            <Badge variant="destructive" className="bg-red-600 text-white text-[9px] px-1 py-0">
              <Flame className="w-2.5 h-2.5 mr-0.5" />
              Hot
            </Badge>
          )}
          {isVegetarian && (
            <Badge variant="secondary" className="bg-green-500 text-white text-[9px] px-1 py-0">
              <Leaf className="w-2.5 h-2.5 mr-0.5" />
              Veg
            </Badge>
          )}
        </div>

        <div className="absolute top-1.5 right-1.5 z-20 sm:hidden">
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="w-6 h-6 rounded-full bg-white/90 text-green-600 hover:bg-white hover:text-green-700 font-bold shadow-lg backdrop-blur-sm border border-white/30 transition-all duration-300 p-0 flex items-center justify-center"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <CardContent className="p-1.5 sm:p-4 text-center flex-1 flex flex-col">
          <div className="flex justify-center mb-1 sm:mb-3 mt-1 sm:mt-4 flex-shrink-0">
            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 sm:border-3 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm">
              <Image
                src={getImageUrl(item.image) || "/placeholder.svg"}
                alt={item.name}
                width={112}
                height={112}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
              />
            </div>
          </div>

          <div className="flex-shrink-0 mb-2 sm:mb-3 min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
            <h3 className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-white uppercase tracking-wide drop-shadow-lg leading-tight line-clamp-2">
              {item.name}
            </h3>
          </div>

          <div className="hidden sm:block mb-3 flex-shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 text-[10px] sm:text-xs"
                >
                  <Info className="w-2.5 h-2.5 mr-1" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-green-600">{item.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-200 shadow-lg">
                      <Image
                        src={getImageUrl(item.image) || "/placeholder.svg"}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {isSpicy && (
                      <Badge variant="destructive" className="bg-red-600 text-white">
                        <Flame className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                    {isVegetarian && (
                      <Badge variant="secondary" className="bg-green-500 text-white">
                        <Leaf className="w-3 h-3 mr-1" />
                        Vegetarian
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ₱{" "}
                      {typeof item.price === "number"
                        ? item.price.toFixed(2)
                        : Number.parseFloat(String(item.price)).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{item.category}</span>
                  </div>
                  <Button onClick={handleAddToCart} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex-1" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-0 flex-shrink-0">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg">
              ₱{" "}
              {typeof item.price === "number"
                ? item.price.toFixed(2)
                : Number.parseFloat(String(item.price)).toFixed(2)}
            </span>
            <span className="text-[10px] sm:text-xs text-white/80 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30 text-center hidden sm:block">
              {item.category}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-2 sm:p-4 hidden sm:block flex-shrink-0">
          <Button
            onClick={handleAddToCart}
            className="w-full text-sm sm:text-base py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 font-bold shadow-xl border-2 border-white/50 transition-all duration-300 hover:scale-[1.02]"
            size="sm"
          >
            <Plus className="w-6 h-6 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
