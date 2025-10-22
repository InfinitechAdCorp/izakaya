import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    // Get token from Authorization header (sent from frontend)
    const authHeader = request.headers.get("authorization")

    console.log("GET Reservations - Auth Header:", authHeader ? "Present" : "Missing")

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    const response = await fetch(`${apiUrl}/api/reservations`, {
      method: "GET",
      headers,
    })

    console.log("Laravel Response Status:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Laravel Error:", errorData)
      throw new Error(`Failed to fetch reservations: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Reservations GET API Error:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY

    // Get auth token from Authorization header (sent from frontend)
    const authHeader = request.headers.get("authorization")

    console.log("=== POST Reservation to Laravel ===")
    console.log("Auth Header:", authHeader ? "Present" : "Missing")
    console.log("reCAPTCHA Token:", body.recaptcha_token ? "Present" : "Missing")

    // Verify reCAPTCHA token
    if (!body.recaptcha_token) {
      console.error("❌ No reCAPTCHA token provided")
      return NextResponse.json(
        {
          success: false,
          message: "reCAPTCHA verification is required",
        },
        { status: 400 }
      )
    }

    console.log("Verifying reCAPTCHA with secret key...")

    // Verify with Google reCAPTCHA API
    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${recaptchaSecretKey}&response=${body.recaptcha_token}`,
    })

    const recaptchaData = await recaptchaResponse.json()
    console.log("reCAPTCHA verification result:", recaptchaData)

    if (!recaptchaData.success) {
      console.error("❌ reCAPTCHA verification failed:", recaptchaData["error-codes"])
      return NextResponse.json(
        {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
          errors: recaptchaData["error-codes"],
        },
        { status: 400 }
      )
    }

    console.log("✅ reCAPTCHA verification successful")

    // Remove recaptcha_token from body before sending to Laravel
    const { recaptcha_token, ...reservationData } = body

    console.log("Reservation Data:", reservationData)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (authHeader) {
      headers["Authorization"] = authHeader
      console.log("Authorization header forwarded to Laravel")
    } else {
      console.warn("⚠️ No authorization header - reservation will be created as guest")
    }

    console.log("Sending to:", `${apiUrl}/api/reservations`)

    const response = await fetch(`${apiUrl}/api/reservations`, {
      method: "POST",
      headers,
      body: JSON.stringify(reservationData),
    })

    console.log("Laravel Response Status:", response.status)

    const responseText = await response.text()
    console.log("Laravel Response Text:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText)
      throw new Error("Invalid response from server")
    }

    if (!response.ok) {
      console.error("Laravel Error Response:", data)
      throw new Error(data.message || "Failed to create reservation")
    }

    console.log("✅ Success Response:", data)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("❌ Reservation POST API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create reservation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}