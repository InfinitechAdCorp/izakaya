import { Card, CardContent } from "@/components/ui/card"
import { Heart, Award, Users, Clock } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-emerald-500/15 to-green-500/15 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-300/10 to-emerald-300/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-green-600 font-medium text-lg"></span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Bon Ga</span>{" "}
            Restaurant
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Welcome to Bon Ga Restaurant, where authentic Korean flavors meet modern dining. Our passion for Korean
            cuisine drives us to bring you the most delicious and traditional dishes with a contemporary twist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Our Story
            </h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Founded in 2018, Bon Ga Restaurant began as a small family dream to share the authentic flavors of Korea
                with our community. What started as a humble kitchen has grown into a beloved dining destination for
                Korean food enthusiasts.
              </p>
              <p>
                Our name "Bon Ga" represents the essence of home and family in Korean culture - the warm, welcoming
                feeling we want every guest to experience, like being invited into a traditional Korean family home
                where food is prepared with love and served with pride.
              </p>
              <p>
                Every dish on our menu tells a story of Korean culinary heritage, passed down through generations and
                perfected by our dedicated chefs who trained in Seoul and bring authentic techniques to every meal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/70 border-green-100 hover:border-green-200 h-[320px]">
              <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                <Heart className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2 text-gray-800 leading-tight">Made with Love</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[180px]">
                  Every dish is prepared with passion and care
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 mt-8 backdrop-blur-sm bg-white/70 border-emerald-100 hover:border-emerald-200 h-[320px]">
              <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                <Award className="w-12 h-12 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2 text-gray-800 leading-tight">Award Winning</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[180px]">
                  Recognized for authentic Korean cuisine
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/70 border-green-100 hover:border-green-200 h-[320px]">
              <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                <Users className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2 text-gray-800 leading-tight">Family Owned</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[180px]">
                  Three generations of Korean cooking tradition
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 mt-8 backdrop-blur-sm bg-white/70 border-emerald-100 hover:border-emerald-200 h-[320px]">
              <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full">
                <Clock className="w-12 h-12 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2 text-gray-800 leading-tight">6 Years</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[180px]">Serving the community since 2018</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-16 border border-green-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              To bring authentic Korean flavors to your table while creating a warm, welcoming atmosphere where every
              meal becomes a memorable experience. We believe in preserving traditional Korean cooking methods while
              embracing innovation to delight modern palates.
            </p>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/70 border-green-100">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">CK</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Chef Kim</h3>
                <p className="text-green-600 font-medium mb-2">Head Chef</p>
                <p className="text-sm text-gray-600">
                  20 years of experience in Korean cuisine with training from Seoul's finest restaurants
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/70 border-emerald-100">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">SL</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Sarah Lee</h3>
                <p className="text-emerald-600 font-medium mb-2">Restaurant Manager</p>
                <p className="text-sm text-gray-600">
                  Ensures every guest feels welcomed and enjoys an exceptional dining experience
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/70 border-green-100">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">JP</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">James Park</h3>
                <p className="text-green-600 font-medium mb-2">Sous Chef</p>
                <p className="text-sm text-gray-600">
                  Specializes in traditional Korean BBQ and fermentation techniques
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="backdrop-blur-sm bg-white/50 rounded-xl p-6 border border-green-100">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Our Values
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 text-xl">•</span>
                <span>
                  <strong>Authenticity:</strong> Using traditional Korean recipes and cooking methods
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 text-xl">•</span>
                <span>
                  <strong>Quality:</strong> Sourcing the finest ingredients for every dish
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 text-xl">•</span>
                <span>
                  <strong>Community:</strong> Creating a welcoming space for all cultures to enjoy Korean food
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 text-xl">•</span>
                <span>
                  <strong>Innovation:</strong> Respecting tradition while embracing modern techniques
                </span>
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-sm bg-white/50 rounded-xl p-6 border border-emerald-100">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              What Makes Us Special
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2 text-xl">•</span>
                <span>Fresh kimchi made daily in-house using family recipes</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2 text-xl">•</span>
                <span>Premium Wagyu beef for our signature bulgogi dishes</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2 text-xl">•</span>
                <span>Vegetarian and vegan options without compromising flavor</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 mr-2 text-xl">•</span>
                <span>Traditional Korean table setting and dining experience</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
