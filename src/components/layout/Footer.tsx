"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import Image from "next/image"

const Footer = () => {
  const pathname = usePathname()

  // Hide footer on any admin routes
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image src="/images/bonga-logo.jpg" alt="BONGA Logo" fill className="object-contain" />
              </div> */}
              <span className="text-xl font-bold">BONGA Restaurant</span>
            </div>
            <p className="text-white/80 text-sm">
              Authentic Korean cuisine with a modern twist. Experience the flavors of Korea in a warm, welcoming
              atmosphere.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link href="/menu" className="text-white/80 hover:text-white transition-colors text-sm">
                Menu
              </Link>
              <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm">
                About Us
              </Link>
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="https://www.google.com/maps/place/REMEDIOS+ST.+MALATE+MANILA+CITY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-yellow-400 transition-colors"
              >
                <MapPin className="h-4 w-4 text-white/60" />
                <span className="text-white/80">REMEDIOS ST. MALATE MANILA CITY</span>
              </Link>

              <Link
                href="tel:09777229947"
                className="flex items-center space-x-2 hover:text-yellow-400 transition-colors"
              >
                <Phone className="h-4 w-4 text-white/60" />
                <span className="text-white/80">0977 722 9947</span>
              </Link>

              <Link
                href="mailto:hello@bongarestaurant.com"
                className="flex items-center space-x-2 hover:text-yellow-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-white/60" />
                <span className="text-white/80">hello@bongarestaurant.com</span>
              </Link>
            </div>
          </div>

          {/* Hours (not clickable) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-white/60" />
                <span className="text-white/80">Open 24 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 BONGA Restaurant. All rights reserved. Made with ❤️ for Korean food lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
