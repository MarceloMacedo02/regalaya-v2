// Application constants

/**
 * Application name
 */
export const APP_NAME = "Regalaya"

/**
 * Application description
 */
export const APP_DESCRIPTION = "Encontre o presente perfeito para cada ocasião"

/**
 * Site URL for production
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://regalaya.com.br"

/**
 * OTP expiration time in minutes
 */
export const OTP_EXPIRATION_MINUTES = 5

/**
 * Cart persistence key
 */
export const CART_STORAGE_KEY = "regalaya_cart"

/**
 * Wishlist persistence key
 */
export const WISHLIST_STORAGE_KEY = "regalaya_wishlist"

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 20

/**
 * Product image sizes
 */
export const IMAGE_SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 1200,
} as const

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/regalaya",
  facebook: "https://facebook.com/regalaya",
  whatsapp: "https://wa.me/55XXXXXXXXXXX",
} as const

/**
 * Contact email
 */
export const CONTACT_EMAIL = "contato@regalaya.com.br"
