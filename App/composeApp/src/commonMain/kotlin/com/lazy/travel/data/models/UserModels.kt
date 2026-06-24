package com.lazy.travel.data.models

import kotlinx.serialization.Serializable

/**
 * Matches server AppAuthTokenModel:
 * UserId, FullName, Email, UserName, Avatar, AccessToken, RefreshToken, IsProfileSetup
 */
@Serializable
data class AuthToken(
    val UserId: Int = 0,
    val FullName: String = "",
    val Email: String = "",
    val UserName: String = "",
    val Avatar: String? = null,
    val AccessToken: String = "",
    val RefreshToken: String = "",
    val IsProfileSetup: Boolean = false,
)

/**
 * Matches server AppUserProfileModel:
 * Id, FullName, Email, UserName, Avatar, Bio, TravelStyle, HomeCity, TotalTrips, TotalKm
 */
@Serializable
data class UserProfile(
    val Id: Int = 0,
    val FullName: String = "",
    val Email: String = "",
    val UserName: String = "",
    val Avatar: String? = null,
    val Bio: String? = null,
    val TravelStyle: String? = null,
    val HomeCity: String? = null,
    val TotalTrips: Int? = null,
    val TotalKm: Int? = null,
)

/** Verify OTP / register response */
@Serializable
data class OtpResponse(
    val Email: String = "",
    val Message: String = "",
)

/** Check username response — server trả Boolean trực tiếp trong Object */
@Serializable
data class UsernameAvailable(val available: Boolean = false)

/** Setup profile response */
@Serializable
data class MessageResponse(
    val Message: String = "",
)
