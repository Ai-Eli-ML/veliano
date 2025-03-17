export interface ProductOption {
  name: string
  value: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  options?: ProductOption[]
}

export interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  paymentMethod: "creditCard" | "paypal"
  notes?: string
} 