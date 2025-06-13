export interface Product {
  id: string
  name: string
  category: string
  image: string
  description: string
  variations: {
    name: string
    price: number
  }[]
}

export interface Category {
  id: string
  name: string
  displayName: string
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Tomat Segar",
    category: "sayur_kgan",
    image: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=300&h=300&fit=crop",
    description:
      "Tomat segar pilihan dengan kualitas premium, cocok untuk masakan sehari-hari. Kaya vitamin C dan antioksidan.",
    variations: [
      { name: "1 kg", price: 15000 },
      { name: "2 kg", price: 28000 },
      { name: "3 kg", price: 40000 },
    ],
  },
  {
    id: "2",
    name: "Beras Premium",
    category: "bahan_pokok",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
    description: "Beras premium kualitas terbaik dengan butiran yang pulen dan wangi. Ideal untuk keluarga Indonesia.",
    variations: [
      { name: "5 kg", price: 65000 },
      { name: "10 kg", price: 125000 },
      { name: "25 kg", price: 300000 },
    ],
  },
  {
    id: "3",
    name: "Apel Malang",
    category: "buah",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
    description:
      "Apel segar dari Malang dengan rasa manis dan tekstur renyah. Kaya serat dan vitamin untuk kesehatan keluarga.",
    variations: [
      { name: "1 kg", price: 25000 },
      { name: "2 kg", price: 48000 },
    ],
  },
  {
    id: "4",
    name: "Ayam Potong",
    category: "lauk",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop",
    description:
      "Ayam potong segar berkualitas tinggi, dipotong sesuai permintaan. Sumber protein terbaik untuk keluarga.",
    variations: [
      { name: "1 ekor", price: 35000 },
      { name: "1/2 ekor", price: 18000 },
    ],
  },
  {
    id: "5",
    name: "Cabai Merah",
    category: "rempah",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=300&fit=crop",
    description:
      "Cabai merah segar dengan tingkat kepedasan yang pas. Memberikan cita rasa pedas yang nikmat pada masakan.",
    variations: [
      { name: "250 gram", price: 12000 },
      { name: "500 gram", price: 22000 },
      { name: "1 kg", price: 40000 },
    ],
  },
  {
    id: "6",
    name: "Kangkung",
    category: "sayur_ikat",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop",
    description:
      "Kangkung segar yang baru dipetik, daun hijau dan batang yang renyah. Cocok untuk tumis dan sayur bening.",
    variations: [
      { name: "1 ikat", price: 3000 },
      { name: "2 ikat", price: 5500 },
      { name: "5 ikat", price: 12000 },
    ],
  },
  {
    id: "7",
    name: "Wortel",
    category: "sayur_kgan",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop",
    description:
      "Wortel segar berwarna orange cerah, manis dan renyah. Kaya beta karoten dan vitamin A untuk kesehatan mata.",
    variations: [
      { name: "500 gram", price: 8000 },
      { name: "1 kg", price: 15000 },
    ],
  },
  {
    id: "8",
    name: "Pisang Cavendish",
    category: "buah",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
    description:
      "Pisang cavendish premium dengan rasa manis alami. Kaya potasium dan energi, cocok untuk camilan sehat.",
    variations: [
      { name: "1 sisir", price: 18000 },
      { name: "2 sisir", price: 35000 },
    ],
  },
  {
    id: "9",
    name: "Bayam Segar",
    category: "sayur_ikat",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop",
    description:
      "Bayam hijau segar dengan daun yang lembut. Kaya zat besi dan folat, baik untuk ibu hamil dan anak-anak.",
    variations: [
      { name: "1 ikat", price: 2500 },
      { name: "3 ikat", price: 7000 },
    ],
  },
  {
    id: "10",
    name: "Daging Sapi",
    category: "lauk",
    image: "https://images.unsplash.com/photo-1588347818133-6b2e6d2e8b8a?w=300&h=300&fit=crop",
    description:
      "Daging sapi segar pilihan dengan kualitas premium. Tekstur empuk dan rasa yang lezat untuk berbagai olahan.",
    variations: [
      { name: "500 gram", price: 75000 },
      { name: "1 kg", price: 145000 },
    ],
  },
]

export const mockCategories: Category[] = [
  { id: "all", name: "all", displayName: "Semua" },
  { id: "bahan_pokok", name: "bahan_pokok", displayName: "Bahan Pokok" },
  { id: "buah", name: "buah", displayName: "Buah" },
  { id: "lauk", name: "lauk", displayName: "Lauk" },
  { id: "rempah", name: "rempah", displayName: "Rempah" },
  { id: "sayur_ikat", name: "sayur_ikat", displayName: "Sayur Ikat" },
  { id: "sayur_kgan", name: "sayur_kgan", displayName: "Sayur Kiloan" },
]

export const categoryLabels: Record<string, string> = {
  bahan_pokok: "Bahan Pokok",
  buah: "Buah",
  lauk: "Lauk",
  rempah: "Rempah",
  sayur_ikat: "Sayur Ikat",
  sayur_kgan: "Sayur Kiloan",
}

// Debug helper for categories
export const debugCategories = () => {
  console.log("Available categories:", mockCategories)
  console.log(
    "Products by category:",
    mockCategories.reduce(
      (acc, cat) => {
        acc[cat.name] = mockProducts.filter((p) => p.category === cat.name)
        return acc
      },
      {} as Record<string, Product[]>,
    ),
  )
}
