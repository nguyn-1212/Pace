package com.lazy.travel.presentation.screens.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.lazy.travel.core.network.LtResult
import com.lazy.travel.data.repository.AuthRepository
import com.lazy.travel.data.remote.dto.SetupProfileRequest
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// ══════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════
data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val rememberMe: Boolean = false,
    val isLoading: Boolean = false,
    val error: String? = null,
    val navigateToHome: Boolean = false,
    val emailError: String? = null,
    val passwordError: String? = null,
)

class LoginViewModel(private val repo: AuthRepository) : ViewModel() {
    var state by mutableStateOf(LoginUiState())
        private set

    fun onEmailChange(v: String)    { state = state.copy(email = v, emailError = null, error = null) }
    fun onPasswordChange(v: String) { state = state.copy(password = v, passwordError = null, error = null) }
    fun onRememberMe(v: Boolean)    { state = state.copy(rememberMe = v) }

    fun login() {
        val email = state.email.trim()
        val password = state.password

        var emailErr: String? = null
        var passErr: String? = null
        if (email.isEmpty() || !email.contains("@")) emailErr = "Email không hợp lệ"
        if (password.length < 8) passErr = "Mật khẩu ít nhất 8 ký tự"
        if (emailErr != null || passErr != null) {
            state = state.copy(emailError = emailErr, passwordError = passErr); return
        }

        viewModelScope.launch {
            state = state.copy(isLoading = true, error = null)
            when (val r = repo.login(email, password, state.rememberMe)) {
                is LtResult.Success -> state = state.copy(isLoading = false, navigateToHome = true)
                is LtResult.Error   -> state = state.copy(isLoading = false, error = r.code)
                else -> {}
            }
        }
    }

    fun clearNavigation() { state = state.copy(navigateToHome = false) }
}

// ══════════════════════════════════════════════════════
// REGISTER
// ══════════════════════════════════════════════════════
data class RegisterUiState(
    val email: String = "",
    val fullName: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val navigateToOtp: Boolean = false,
    val emailError: String? = null,
    val passwordError: String? = null,
    val confirmError: String? = null,
    val passwordStrength: Int = 0,  // 0=weak 1=medium 2=strong
)

class RegisterViewModel(private val repo: AuthRepository) : ViewModel() {
    var state by mutableStateOf(RegisterUiState())
        private set

    fun onEmailChange(v: String)    { state = state.copy(email = v, emailError = null, error = null) }
    fun onFullNameChange(v: String) { state = state.copy(fullName = v) }
    fun onPasswordChange(v: String) {
        val strength = when {
            v.length >= 10 && v.any { it.isUpperCase() } && v.any { it.isDigit() } -> 2
            v.length >= 8 -> 1
            else -> 0
        }
        state = state.copy(password = v, passwordStrength = strength, passwordError = null)
    }
    fun onConfirmChange(v: String) { state = state.copy(confirmPassword = v, confirmError = null) }

    fun register() {
        val email = state.email.trim()
        val fullName = state.fullName.trim()
        val password = state.password

        var emailErr: String? = null
        var passErr: String? = null
        var confirmErr: String? = null
        if (email.isEmpty() || !email.contains("@")) emailErr = "Email không hợp lệ"
        if (password.length < 8) passErr = "Mật khẩu ít nhất 8 ký tự"
        if (password != state.confirmPassword) confirmErr = "Mật khẩu không khớp"
        if (emailErr != null || passErr != null || confirmErr != null) {
            state = state.copy(emailError = emailErr, passwordError = passErr, confirmError = confirmErr); return
        }

        viewModelScope.launch {
            state = state.copy(isLoading = true, error = null)
            when (val r = repo.register(email, fullName, password)) {
                is LtResult.Success -> state = state.copy(isLoading = false, navigateToOtp = true)
                is LtResult.Error   -> state = state.copy(isLoading = false, error = r.code)
                else -> {}
            }
        }
    }
    fun clearNavigation() { state = state.copy(navigateToOtp = false) }
}

// ══════════════════════════════════════════════════════
// OTP VERIFY
// ══════════════════════════════════════════════════════
data class OtpUiState(
    val otp: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val navigateNext: Boolean = false,
    val countdown: Int = 60,
    val canResend: Boolean = false,
)

class OtpViewModel(private val repo: AuthRepository) : ViewModel() {
    var state by mutableStateOf(OtpUiState())
        private set

    private var countdownJob: Job? = null

    fun start() { startCountdown() }

    fun onOtpChange(v: String) { state = state.copy(otp = v, error = null) }

    fun verify(email: String, type: Int = 0) {
        if (state.otp.length < 6) { state = state.copy(error = "Nhập đủ 6 số"); return }
        viewModelScope.launch {
            state = state.copy(isLoading = true, error = null)
            when (val r = repo.verifyOtp(email, state.otp, type)) {
                is LtResult.Success -> state = state.copy(isLoading = false, navigateNext = true)
                is LtResult.Error   -> state = state.copy(isLoading = false, error = r.code)
                else -> {}
            }
        }
    }

    fun resend(email: String) {
        viewModelScope.launch {
            repo.forgotPassword(email)
            startCountdown()
        }
    }

    private fun startCountdown() {
        countdownJob?.cancel()
        state = state.copy(countdown = 60, canResend = false)
        countdownJob = viewModelScope.launch {
            repeat(60) {
                delay(1000)
                state = state.copy(countdown = 59 - it)
            }
            state = state.copy(canResend = true)
        }
    }
    fun clearNavigation() { state = state.copy(navigateNext = false) }
}

// ══════════════════════════════════════════════════════
// FORGOT PASSWORD
// ══════════════════════════════════════════════════════
data class ForgotUiState(
    val email: String = "",
    val newPassword: String = "",
    val confirmPassword: String = "",
    val step: Int = 0,  // 0=email, 1=otp, 2=newpass, 3=success
    val isLoading: Boolean = false,
    val error: String? = null,
    val emailError: String? = null,
    val passwordError: String? = null,
)

class ForgotViewModel(private val repo: AuthRepository) : ViewModel() {
    var state by mutableStateOf(ForgotUiState())
        private set

    fun onEmailChange(v: String)    { state = state.copy(email = v, emailError = null, error = null) }
    fun onNewPassChange(v: String)  { state = state.copy(newPassword = v, passwordError = null) }
    fun onConfirmChange(v: String)  { state = state.copy(confirmPassword = v) }

    fun sendOtp() {
        val email = state.email.trim()
        if (email.isEmpty() || !email.contains("@")) {
            state = state.copy(emailError = "Email không hợp lệ"); return
        }
        viewModelScope.launch {
            state = state.copy(isLoading = true)
            when (repo.forgotPassword(email)) {
                is LtResult.Success -> state = state.copy(isLoading = false, step = 1)
                is LtResult.Error   -> state = state.copy(isLoading = false, error = "AUTH_OTP_INVALID")
                else -> {}
            }
        }
    }

    fun verifyOtp(otp: String) {
        state = state.copy(step = 2)  // move to new password step, verify on reset
    }

    fun resetPassword(otp: String) {
        if (state.newPassword.length < 8) {
            state = state.copy(passwordError = "Mật khẩu ít nhất 8 ký tự"); return
        }
        if (state.newPassword != state.confirmPassword) {
            state = state.copy(passwordError = "Mật khẩu không khớp"); return
        }
        viewModelScope.launch {
            state = state.copy(isLoading = true)
            when (repo.resetPassword(state.email, otp, state.newPassword)) {
                is LtResult.Success -> state = state.copy(isLoading = false, step = 3)
                is LtResult.Error   -> state = state.copy(isLoading = false, error = "AUTH_OTP_INVALID")
                else -> {}
            }
        }
    }
}

// ══════════════════════════════════════════════════════
// SETUP PROFILE
// ══════════════════════════════════════════════════════
data class SetupUiState(
    val username: String = "",
    val bio: String = "",
    val travelStyle: String = "",
    val interests: List<String> = emptyList(),
    val homeCity: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val navigateToHome: Boolean = false,
    val usernameStatus: UsernameStatus = UsernameStatus.IDLE,
)
enum class UsernameStatus { IDLE, CHECKING, AVAILABLE, TAKEN }

class SetupViewModel(private val repo: AuthRepository) : ViewModel() {
    var state by mutableStateOf(SetupUiState())
        private set

    private var checkJob: Job? = null

    fun onUsernameChange(v: String) {
        state = state.copy(username = v, usernameStatus = UsernameStatus.IDLE)
        checkJob?.cancel()
        if (v.length >= 3) {
            checkJob = viewModelScope.launch {
                delay(600)
                state = state.copy(usernameStatus = UsernameStatus.CHECKING)
                val available = repo.checkUsername(v)
                state = state.copy(usernameStatus = if (available) UsernameStatus.AVAILABLE else UsernameStatus.TAKEN)
            }
        }
    }
    fun onBioChange(v: String)         { state = state.copy(bio = v) }
    fun onTravelStyleChange(v: String) { state = state.copy(travelStyle = v) }
    fun onHomeCityChange(v: String)    { state = state.copy(homeCity = v) }
    fun toggleInterest(interest: String) {
        val list = state.interests.toMutableList()
        if (list.contains(interest)) list.remove(interest) else list.add(interest)
        state = state.copy(interests = list)
    }

    fun setup() {
        viewModelScope.launch {
            state = state.copy(isLoading = true, error = null)
            val req = SetupProfileRequest(
                UserName = state.username,
                Bio = state.bio.ifEmpty { null },
                TravelStyle = state.travelStyle.ifEmpty { null },
                Interests = state.interests,
                HomeCity = state.homeCity.ifEmpty { null },
            )
            when (val r = repo.setupProfile(req)) {
                is LtResult.Success -> state = state.copy(isLoading = false, navigateToHome = true)
                is LtResult.Error   -> state = state.copy(isLoading = false, error = r.code)
                else -> {}
            }
        }
    }
    fun clearNavigation() { state = state.copy(navigateToHome = false) }
}
