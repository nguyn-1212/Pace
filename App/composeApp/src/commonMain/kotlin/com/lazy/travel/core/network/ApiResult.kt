package com.lazy.travel.core.network

import kotlinx.serialization.Serializable

/**
 * Standard API response — matches server ResultApi exactly
 *
 * Server ResultType enum:
 *   Success   = 1
 *   Exception = 2
 *   Fail      = 3
 */
@Serializable
data class ApiResult<T>(
    val Type: Int = 3,
    val Object: T? = null,
    val Description: String? = null,
    val Total: Double? = null,
    val ObjectExtra: T? = null,
    val Success: Boolean? = null,
) {
    val isSuccess get() = Type == 1
    val isError   get() = Type != 1
    val messageCode get() = Description ?: ""
}

@Serializable
data class PagedResult<T>(
    val Type: Int = 3,
    val Object: List<T> = emptyList(),
    val Description: String? = null,
    val Total: Double? = null,
)  {
    val isSuccess get() = Type == 1
}

/** Sealed result for UI layer */
sealed class LtResult<out T> {
    data class Success<T>(val data: T) : LtResult<T>()
    data class Error(val code: String, val message: String? = null) : LtResult<Nothing>()
    data object Loading : LtResult<Nothing>()
}
