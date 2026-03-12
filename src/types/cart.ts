export interface CartItem {
  productId: string
  quantity: number
}

export interface AddToCartPayload {
  productId: string
  quantity: number
}

export interface UpdateCartItemQuantityPayload {
  productId: string
  quantity: number
}

export interface RemoveFromCartPayload {
  productId: string
}

export interface CartPreviewItem {
  productId: string
  title: string
  price: number
  quantity: number
  subtotal: number
}
