package com.lazy.travel.data.repository

import com.lazy.travel.core.network.LtResult
import com.lazy.travel.core.storage.TokenStorage
import com.lazy.travel.data.models.AuthToken
import com.lazy.travel.data.remote.api.AuthApi
import com.lazy.travel.data.remote.dto.ChangePasswordRequest
import com.lazy.travel.data.remote.dto.ForgotPasswordRequest
import com.lazy.travel.data.remote.dto.LoginRequest
import com.lazy.travel.data.remote.dto.RegisterRequest
import com.lazy.travel.data.remote.dto.ResetPasswordRequest
import com.lazy.travel.data.remote.dto.SetupProfileRequest
import com.lazy.travel.data.remote.dto.VerifyOtpRequest

class AuthRepository(
    private val api: AuthApi,
    private val tokenStorage: TokenStorage,
) {

    // ── Login ──────────────────────────────────────────────────────────────
    suspend fun login(
        email: String,
        password: String,
        rememberMe: Boolean = false,
        deviceToken: String? = null,
    ): LtResult<AuthToken> = runCatching {
        val result = api.login(LoginRequest(email.trim(), password, rememberMe, deviceToken))
        if (result.isSuccess && result.Object != null) {
            val token = result.Object
            tokenStorage.saveTokens(token.AccessToken, token.RefreshToken)
            tokenStorage.saveUserId(token.UserId)
            LtResult.Success(token)
        } else {
            LtResult.Error(result.messageCode.ifEmpty { "AUTH_LOGIN_FAILED" })
        }
    }.getOrElse { LtResult.Error("NETWORK_ERROR", it.message) }

    // ── Register ───────────────────────────────────────────────────────────
    suspend fun register(
        email: String,
        fullName: String,
        password: String,
    ): LtResult<String> = runCatching {
        val result = api.register(RegisterRequest(email.trim(), fullName.trim(), password))
        if (result.isSuccess) {
            LtResult.Success(result.Object?.Email ?: email)
        } else {
            LtResult.Error(result.messageCode.ifEmpty { "AUTH_REGISTER_FAILED" })
        }
    }.getOrElse { LtResult.Error("NETWORK_ERROR", it.message) }

    // ── Verify OTP ─────────────────────────────────────────────────────────
    suspend fun verifyOtp(
        email: String,
        otp: String,
        type: Int = 0,
    ): LtResult<AuthToken> = runCatching {
        val result = api.verifyOtp(VerifyOtpRequest(email.trim(), otp.trim(), type))
        if (result.isSuccess) {
            if (type == 0 && result.Object != null) {
                // Đăng ký: server trả token → tự động login
                val token = result.Object
                tokenStorage.saveTokens(token.AccessToken, token.RefreshToken)
                tokenStorage.saveUserId(token.UserId)
                LtResult.Success(token)
            } else {
                // Quên MK: server trả OtpResponse, không có token
                LtResult.Success(AuthToken())
            }
        } else {
            LtResult.Error(result.messageCode.ifEmpty { "AUTH_OTP_INVALID" })
        }
    }.getOrElse { LtResult.Error("NETWORK_ERROR", it.message) }

    // ── Forgot Password ────────────────────────────────────────────────────
    suspend fun forgotPassword(email: String): LtResult<Unit> = runCatching {
        val result = api.forgotPassword(ForgotPasswordRequest(email.trim()))
        if (result.isSuccess) LtResult.Success(Unit)
        else LtResult.Error(result.messageCode.ifEmpty { "AUTH_OTP_FAILED" })
    }.getOrElse { LtResult.Error("NETWORK_ERROR", it.message) }

    // ── Reset Password ─────────────────────────────────────────────────────
    suspend fun resetPassword(
        email: String,
        otp: String,
        newPassword: String,
    ): LtResult<Unit> = runCatching {
        val result = api.resetPassword(ResetPasswordRequest(email.trim(), otp.trim(), newPassword))
        if (result.isSuccess) LtResult.Success(Unit)
        else LtResult.Error(result.messageCode.ifEmpty { "AUTH_RESET_FAILED" })
    }.getOrElse { LtResult.Error("NETWORK_ERROR", it.message) }

    // ── Resend OTP ─────────────────────────────────────────────────────────
    suspend fun resendOtp(email: String): LtResult<Unit> = runCatching {
        val result = api.resendOtp(ForgotPasswordRequest(email.trim()))
        if (result.isSuccess) LtResult.Success(Unit)
        else LtResult.Error(result.messageCode.ifEmpty { "AUTH_OTP_FAILED" })
    }.getOrElse { LtResult.Error("NETWORK_ERROR", it.message) }

    // ── Setup Profile ──────────────────────────────────────────────────────
    suspend fun setupProfile(req: SetupProfileRequest): LtResult<Unit> = runCatching {
        val result = api.setupProfile(req)
        if (result.isSuccess) LtResult.Success(Unit)
        else LtResult.Error(result.messageCode.ifEmpty { "AUTH_SETUP_FAILED" })
    }.getOrElse { LtResult.Error("NETWORK_ERROR", it.message) }

    // ── Change Password ────────────────────────────────────────────────────
    suspend fun changePassword(oldPassword: String, newPassword: String): LtResult<Unit> = runCatching {
        val result = api.changePassword(ChangePasswordRequest(oldPassword, newPassword))
        if (result.isSuccess) LtResult.Success(Unit)
        else LtResult.Error(result.messageCode.ifEmpty { "AUTH_RESET_FAILED" })
    }.getOrElse { LtResult.Error("NETWORK_ERROR", it.message) }

    // ── Check Username ─────────────────────────────────────────────────────
    suspend fun checkUsername(username: String): Boolean = runCatching {
        val result = api.checkUsername(username.trim())
        result.isSuccess && result.Object == true
    }.getOrElse { false }

    // ── Logout ─────────────────────────────────────────────────────────────
    suspend fun logout() {
        runCatching { api.logout() }
        tokenStorage.clear()
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    suspend fun isLoggedIn() = tokenStorage.isLoggedIn()
}
