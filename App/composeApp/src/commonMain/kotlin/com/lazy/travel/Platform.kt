package com.lazy.travel

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform