"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/toaster"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error("Missing Information 정보 누락", {
        description: "Please fill in all required fields. 필수 항목을 모두 입력해 주세요.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        const token = data.token || data.data?.token || data.access_token
        const user = data.user || data.data?.user || data.data

        if (token) {
          localStorage.setItem("auth_token", token)
        }

        if (user) {
          localStorage.setItem("user_data", JSON.stringify(user))
        }

        window.dispatchEvent(new CustomEvent("userDataUpdated"))

        toast.success("Login Successful!", {
          description: "Welcome back to BONGA Restaurant!",
        })

        const userRole = user?.role?.toLowerCase?.() || user?.role || ""
        const isAdmin = userRole === "admin"
        const isCustomer = userRole === "customer" || userRole === "user"

        let redirectPath = "/"
        if (isAdmin) {
          redirectPath = "/admin/dashboard"
        } else if (isCustomer) {
          redirectPath = "/"
        }

        await new Promise((resolve) => setTimeout(resolve, 100))

        setTimeout(() => {
          router.push(redirectPath)
        }, 1500)
      } else {
        toast.error("Login Failed 로그인 실패", {
          description: data.message || "Login failed. Please try again. 로그인에 실패했습니다.",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Connection Error 연결 오류", {
        description: "Unable to login. Please check your connection and try again. 연결을 확인하고 다시 시도해 주세요.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen py-8 bg-gradient-to-br from-green-50 via-amber-50 to-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-green-200 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border-2 border-amber-200 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-green-200 rounded-full"></div>
          <div className="absolute bottom-32 right-10 w-28 h-28 border-2 border-amber-200 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-green-200/50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-800 mb-2">BONGA Restaurant</CardTitle>
              <h2 className="text-2xl text-gray-800">
                {" "}
                <span className="text-transparent bg-gradient-to-r from-green-600 to-green-700 bg-clip-text">
                  Login
                </span>
              </h2>
              <p className="text-gray-600 mt-2">Welcome back!</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address 이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 text-base"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" />
                    Password 비밀번호
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="border-green-200 focus:border-green-400 focus:ring-green-200 h-12 text-base pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 h-14 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: "linear-gradient(to right, #16a34a, #15803d) !important",
                    color: "#ffffff !important",
                    opacity: "1 !important",
                  }}
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2" style={{ color: "#ffffff !important" }}>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span style={{ color: "#ffffff !important" }}>Logging in... 로그인 중...</span>
                    </span>
                  ) : (
                    <span className="flex items-center" style={{ color: "#ffffff !important" }}>
                      <LogIn className="w-4 h-4 mr-2" style={{ color: "#ffffff !important" }} />
                      <span style={{ color: "#ffffff !important" }}>로그인 Login</span>
                    </span>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have an account? 계정이 없으신가요?{" "}
                    <Link
                      href="/register"
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                    >
                      Register here 회원가입
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </>
  )
}
