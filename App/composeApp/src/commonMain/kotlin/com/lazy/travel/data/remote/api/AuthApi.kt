package com.lazy.travel.data.remote.api

import com.lazy.travel.core.network.ApiResult
import com.lazy.travel.data.models.AuthToken
import com.lazy.travel.data.models.MessageResponse
import com.lazy.travel.data.models.OtpResponse
import com.lazy.travel.data.remote.dto.ChangePasswordRequest
import com.lazy.travel.data.remote.dto.ForgotPasswordRequest
import com.lazy.travel.data.remote.dto.LoginRequest
import com.lazy.travel.data.remote.dto.RegisterRequest
import com.lazy.travel.data.remote.dto.ResetPasswordRequest
import com.lazy.travel.data.remote.dto.SetupProfileRequest
import com.lazy.travel.data.remote.dto.VerifyOtpRequest
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody

class AuthApi(private val client: HttpClient) {

    /** POST /api/app/auth/login → AppAuthTokenModel */
    suspend fun login(req: LoginRequest): ApiResult<AuthToken> =
        client.post("/api/app/auth/login") { setBody(req) }.body()

    /** POST /api/app/auth/register → { Email, Message } */
    suspend fun register(req: RegisterRequest): ApiResult<OtpResponse> =
        client.post("/api/app/auth/register") { setBody(req) }.body()

    /** POST /api/app/auth/verify-otp → AppAuthTokenModel (type=0) hoặc { Email, Message } (type=1) */
    suspend fun verifyOtp(req: VerifyOtpRequest): ApiResult<AuthToken> =
        client.post("/api/app/auth/verify-otp") { setBody(req) }.body()

    /** POST /api/app/auth/forgot-password → { Email, Message } */
    suspend fun forgotPassword(req: ForgotPasswordRequest): ApiResult<OtpResponse> =
        client.post("/api/app/auth/forgot-password") { setBody(req) }.body()

    /** POST /api/app/auth/reset-password → { Message } */
    suspend fun resetPassword(req: ResetPasswordRequest): ApiResult<MessageResponse> =
        client.post("/api/app/auth/reset-password") { setBody(req) }.body()

    /** POST /api/app/auth/resend-otp → { Email, Message } */
    suspend fun resendOtp(req: ForgotPasswordRequest): ApiResult<OtpResponse> =
        client.post("/api/app/auth/resend-otp") { setBody(req) }.body()

    /** POST /api/app/auth/setup-profile → { Message } */
    suspend fun setupProfile(req: SetupProfileRequest): ApiResult<MessageResponse> =
        client.post("/api/app/auth/setup-profile") { setBody(req) }.body()

    /** POST /api/app/auth/change-password → { Message } */
    suspend fun changePassword(req: ChangePasswordRequest): ApiResult<MessageResponse> =
        client.post("/api/app/auth/change-password") { setBody(req) }.body()

    /** GET /api/app/auth/check-username?username=xxx → Boolean */
    suspend fun checkUsername(username: String): ApiResult<Boolean> =
        client.get("/api/app/auth/check-username") {
            parameter("username", username)
        }.body()

    /** GET /api/app/auth/me → AppUserProfileModel */
    suspend fun me(): ApiResult<com.lazy.travel.data.models.UserProfile> =
        client.get("/api/app/auth/me").body()

    /** POST /api/app/auth/logout → { Message } */
    suspend fun logout(): ApiResult<MessageResponse> =
        client.post("/api/app/auth/logout") { }.body<ApiResult<MessageResponse>>()
}
