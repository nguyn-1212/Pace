package com.lazy.travel.data.remote.dto

import kotlinx.serialization.Serializable

/** POST /api/app/auth/login */
@Serializable
data class LoginRequest(
    val UserName: String,       // email hoặc username
    val Password: String,
    val RememberMe: Boolean = false,
    val DeviceToken: String? = null,  // FCM push token
)

/** POST /api/app/auth/register */
@Serializable
data class RegisterRequest(
    val Email: String,
    val FullName: String,
    val Password: String,
)

/** POST /api/app/auth/verify-otp */
@Serializable
data class VerifyOtpRequest(
    val Email: String,
    val Otp: String,
    val Type: Int = 0,   // 0=Register, 1=ForgotPassword
)

/** POST /api/app/auth/forgot-password & /resend-otp */
@Serializable
data class ForgotPasswordRequest(val Email: String)

/** POST /api/app/auth/reset-password */
@Serializable
data class ResetPasswordRequest(
    val Email: String,
    val Otp: String,
    val NewPassword: String,
)

/** POST /api/app/auth/change-password */
@Serializable
data class ChangePasswordRequest(
    val OldPassword: String,
    val NewPassword: String,
)

/** POST /api/app/auth/setup-profile */
@Serializable
data class SetupProfileRequest(
    val UserName: String,
    val Bio: String? = null,
    val TravelStyle: String? = null,
    val Interests: List<String> = emptyList(),
    val HomeCity: String? = null,
    val Avatar: String? = null,
)
