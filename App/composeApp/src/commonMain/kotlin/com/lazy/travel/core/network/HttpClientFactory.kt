package com.lazy.travel.core.network

import com.lazy.travel.core.storage.TokenStorage
import com.lazy.travel.core.utils.AppConstants
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.auth.providers.BearerTokens
import io.ktor.client.plugins.auth.providers.bearer
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logging
import io.ktor.client.plugins.websocket.WebSockets
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

fun createHttpClient(tokenStorage: TokenStorage): HttpClient = HttpClient {

    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
            isLenient = true
            encodeDefaults = true
            coerceInputValues = true
        })
    }

    install(HttpTimeout) {
        requestTimeoutMillis = AppConstants.API_TIMEOUT_MS
        connectTimeoutMillis = AppConstants.CONNECT_TIMEOUT_MS
    }

    install(Logging) {
        level = LogLevel.HEADERS  // BODY in debug only
    }

    install(WebSockets)

    install(Auth) {
        bearer {
            loadTokens {
                val token = tokenStorage.getAccessToken()
                if (token != null) BearerTokens(token, tokenStorage.getRefreshToken() ?: "")
                else null
            }
            refreshTokens {
                // TODO: implement token refresh
                val token = tokenStorage.getAccessToken()
                if (token != null) BearerTokens(token, "")
                else null
            }
        }
    }

    defaultRequest {
        contentType(ContentType.Application.Json)
        url(AppConstants.BASE_URL)
    }
}
