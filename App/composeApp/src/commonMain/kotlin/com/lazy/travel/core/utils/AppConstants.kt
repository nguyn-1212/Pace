package com.lazy.travel.core.utils

object AppConstants {
    // API
    const val BASE_URL = "https://api-travel.lazy.vn"
    const val API_TIMEOUT_MS = 30_000L
    const val CONNECT_TIMEOUT_MS = 15_000L

    // Pagination
    const val PAGE_SIZE = 20

    // Storage keys
    const val KEY_ACCESS_TOKEN  = "access_token"
    const val KEY_REFRESH_TOKEN = "refresh_token"
    const val KEY_USER_ID       = "user_id"
    const val KEY_LANGUAGE      = "app_language"
    const val KEY_THEME         = "app_theme"

    // Invite code
    const val INVITE_LINK_BASE  = "https://lazytravel.app/join/"

    // Supported languages
    val SUPPORTED_LANGUAGES = listOf("vi", "en", "ja", "ko")
    const val DEFAULT_LANGUAGE = "vi"
}
