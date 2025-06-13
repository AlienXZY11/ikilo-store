import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Debug logging
const debugLog = (message: string, data?: any) => {
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true" && process.env.NEXT_PUBLIC_CUSTOMER_MODE !== "true") {
    console.log(`🔥 Firebase Debug: ${message}`, data || "")
  }
}

// Initialize Firebase
let app: FirebaseApp | undefined
let db: Firestore | undefined

try {
  debugLog("Initializing Firebase...")

  // Check if all required config values are present
  const requiredConfig = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missingConfig = requiredConfig.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

  if (missingConfig.length > 0) {
    console.warn("Missing Firebase config:", missingConfig)
    throw new Error(`Missing Firebase configuration: ${missingConfig.join(", ")}`)
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    debugLog("Firebase app initialized successfully")
  } else {
    app = getApps()[0]
    debugLog("Using existing Firebase app")
  }

  // Initialize Firestore
  db = getFirestore(app)

  // Connect to emulator in development if needed (only for localhost)
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" &&
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    try {
      connectFirestoreEmulator(db, "localhost", 8080)
      debugLog("Connected to Firestore emulator")
    } catch (error) {
      debugLog("Firestore emulator connection failed", error)
    }
  }

  debugLog("Firestore initialized successfully")
} catch (error) {
  console.error("❌ Firebase initialization error:", error)
  // Don't throw error, let the app continue with mock data
}

export { db }
export { debugLog }
