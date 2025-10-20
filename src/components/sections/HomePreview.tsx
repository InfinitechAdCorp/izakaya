import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Award, Flame } from "lucide-react"

export default function HomePreview() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-amber-50 to-cream-50">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-200/40 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-amber-300/25 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-medium text-green-700 tracking-wide">AUTHENTIC KOREAN CUISINE</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-600 to-amber-600">
                BONGA Restaurant
              </span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Experience the heart of Korea in every bite! Our master chefs bring you
              <span className="font-semibold text-green-700"> authentic flavors</span> from Seoul's bustling streets to
              your table. From sizzling Korean BBQ to comforting kimchi jjigae, every dish is crafted with love and
              tradition.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              🥢 <span className="font-medium">Saranghae Korean Food!</span> Join our family and discover why we're the
              most beloved Korean restaurant in town. Fresh ingredients, traditional recipes, and that special Korean
              hospitality await you!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/menu">🍜 View Our Menu</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300 bg-transparent"
              >
                <Link href="/reservations">📞 Make Reservation</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 auto-rows-fr">
            {[
              {
                icon: <Flame className="w-8 h-8 text-white" />,
                title: "Authentic Flavors",
                desc: "Traditional Korean recipes from Seoul",
                bg: "from-green-600 to-green-700",
              },
              {
                icon: <Heart className="w-8 h-8 text-white" />,
                title: "Made with Love",
                desc: "Every dish crafted with Korean heart",
                bg: "from-amber-500 to-amber-600",
              },
              {
                icon: <Users className="w-8 h-8 text-white" />,
                title: "Family Atmosphere",
                desc: "Warm Korean hospitality & community",
                bg: "from-green-500 to-amber-500",
              },
              {
                icon: <Award className="w-8 h-8 text-white" />,
                title: "Award Winning",
                desc: "Best Korean restaurant 3 years running",
                bg: "from-green-700 to-green-800",
              },
            ].map((card, idx) => (
              <Card
                key={idx}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-green-100 h-full flex flex-col"
              >
                <CardContent className="p-8 text-center flex flex-col flex-1">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${card.bg} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{card.title}</h3>
                  <p className="text-sm text-gray-600 flex-1">{card.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
