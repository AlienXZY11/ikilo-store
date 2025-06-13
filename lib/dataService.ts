import { collection, getDocs, doc, query, orderBy, serverTimestamp, writeBatch, addDoc } from "firebase/firestore"
import { db, debugLog } from "./firebase"
import { mockProducts, mockCategories, type Product, type Category } from "./mockData"

// Add Order interface and saveOrder function
export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  notes: string
  items: CartItem[]
  totalPrice: number
  status: "pending" | "completed" | "cancelled"
  createdAt: any // Firebase timestamp
}

export interface CartItem {
  productId: string
  productName: string
  variation: string
  price: number
  quantity: number
}

class DataService {
  async getProducts(): Promise<Product[]> {
    try {
      debugLog("DataService", "Fetching products from Firebase...")

      if (!db) {
        debugLog("DataService", "Firestore not initialized, using mock data")
        return mockProducts
      }

      const productsQuery = query(collection(db, "products"), orderBy("name"))
      const productsSnapshot = await getDocs(productsQuery)

      const products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]

      if (products.length > 0) {
        debugLog("DataService", `Loaded ${products.length} products from Firebase`)
        return products
      } else {
        debugLog("DataService", "No products found in Firebase, using mock data")
        return mockProducts
      }
    } catch (error) {
      debugLog("DataService", "Error loading products from Firebase", error)
      if (process.env.NEXT_PUBLIC_CUSTOMER_MODE !== "true") {
        console.warn("Using mock data due to Firebase error:", error)
      }
      return mockProducts
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      debugLog("DataService", "Fetching categories from Firebase...")

      if (!db) {
        debugLog("DataService", "Firestore not initialized, using mock data")
        return mockCategories
      }

      const categoriesQuery = query(collection(db, "categories"), orderBy("displayName"))
      const categoriesSnapshot = await getDocs(categoriesQuery)

      const categories = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[]

      const allCategories = [{ id: "all", name: "all", displayName: "Semua" }, ...categories]

      if (categories.length > 0) {
        debugLog("DataService", `Loaded ${categories.length} categories from Firebase`)
        return allCategories
      } else {
        debugLog("DataService", "No categories found in Firebase, using mock data")
        return mockCategories
      }
    } catch (error) {
      debugLog("DataService", "Error loading categories from Firebase", error)
      if (process.env.NEXT_PUBLIC_CUSTOMER_MODE !== "true") {
        console.warn("Using mock data due to Firebase error:", error)
      }
      return mockCategories
    }
  }

  async seedFirebaseData(): Promise<void> {
    try {
      if (!db) {
        throw new Error("Firestore not initialized")
      }

      debugLog("DataService", "Seeding Firebase with mock data...")

      const batch = writeBatch(db)

      // Seed categories first (excluding 'all')
      const categoriesToSeed = mockCategories.filter((cat) => cat.id !== "all")
      for (const category of categoriesToSeed) {
        const categoryRef = doc(db, "categories", category.id)
        batch.set(categoryRef, {
          name: category.name,
          displayName: category.displayName,
          createdAt: serverTimestamp(),
        })
      }

      // Seed products with description
      for (const product of mockProducts) {
        const productRef = doc(db, "products", product.id)
        batch.set(productRef, {
          name: product.name,
          category: product.category,
          image: product.image,
          description: product.description, // Add description field
          variations: product.variations,
          createdAt: serverTimestamp(),
        })
      }

      await batch.commit()
      debugLog("DataService", "Firebase seeding completed successfully")
    } catch (error) {
      console.error("❌ Error seeding Firebase:", error)
      throw error
    }
  }

  async checkFirebaseConnection(): Promise<boolean> {
    try {
      if (!db) {
        return false
      }

      // Try to read from a collection to test connection with timeout
      const testQuery = query(collection(db, "products"))

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firebase connection timeout")), 10000),
      )

      await Promise.race([getDocs(testQuery), timeoutPromise])
      return true
    } catch (error) {
      debugLog("DataService", "Firebase connection test failed", error)
      return false
    }
  }

  async saveOrder(order: Omit<Order, "createdAt">): Promise<string | null> {
    try {
      if (!db) {
        debugLog("DataService", "Firestore not initialized, cannot save order")
        return null
      }

      debugLog("DataService", "Saving order to Firebase...", order)

      const ordersRef = collection(db, "orders")
      const orderWithTimestamp = {
        ...order,
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(ordersRef, orderWithTimestamp)
      debugLog("DataService", `Order saved with ID: ${docRef.id}`)
      return docRef.id
    } catch (error) {
      console.error("❌ Error saving order:", error)
      return null
    }
  }
}

export const dataService = new DataService()
