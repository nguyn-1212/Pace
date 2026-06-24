package com.lazy.travel.presentation.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazy.travel.core.theme.LtColors
import org.koin.compose.viewmodel.koinViewModel

// ── OTP Screen ────────────────────────────────────────────────────────────
@Composable
fun OtpScreen(
    email: String,
    type: Int = 0,
    onVerified: () -> Unit,
    onBack: () -> Unit,
    vm: OtpViewModel = koinViewModel(),
) {
    val state = vm.state
    LaunchedEffect(Unit) { vm.start() }
    LaunchedEffect(state.navigateNext) { if (state.navigateNext) { vm.clearNavigation(); onVerified() } }

    Box(modifier = Modifier.fillMaxSize().background(LtColors.Background)) {
        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {

            AuthHero(
                title = "Nhập mã\nxác nhận 📧",
                subtitle = "Mã 6 chữ số đã được gửi đến\n$email",
                gradientColors = listOf(LtColors.Purple, LtColors.Pink)
            )

            Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp).padding(top = 32.dp, bottom = 140.dp)) {

                if (state.error != null) { AuthErrorBanner(state.error); Spacer(Modifier.height(16.dp)) }

                // 6 OTP boxes
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally)
                ) {
                    repeat(6) { i ->
                        val char = state.otp.getOrNull(i)?.toString() ?: ""
                        val isFocused = state.otp.length == i
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(
                                    when {
                                        state.error != null -> LtColors.PinkLight
                                        isFocused -> LtColors.BlueLight
                                        char.isNotEmpty() -> Color.White
                                        else -> LtColors.Background
                                    }
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(char, style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.Black,
                                color = if (state.error != null) LtColors.Pink else LtColors.Dark
                            ))
                        }
                    }
                }

                Spacer(Modifier.height(16.dp))

                // Hidden input field driving OTP
                OutlinedTextField(
                    value = state.otp,
                    onValueChange = { if (it.length <= 6 && it.all { c -> c.isDigit() }) vm.onOtpChange(it) },
                    modifier = Modifier.fillMaxWidth().height(1.dp).offset(y = (-9999).dp),
                    keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                )

                Spacer(Modifier.height(24.dp))

                // Resend countdown
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    if (state.canResend) {
                        Text("Gửi lại mã", style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Bold, color = LtColors.Pink
                        ), modifier = Modifier.clickable { vm.resend(email) })
                    } else {
                        Text("Gửi lại sau ${state.countdown}s", style = MaterialTheme.typography.bodyMedium, color = LtColors.Gray2)
                    }
                }

                Spacer(Modifier.height(12.dp))
                Text("← Quay lại", style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray, fontWeight = FontWeight.SemiBold),
                    modifier = Modifier.clickable { onBack() }.align(Alignment.CenterHorizontally))
            }
        }

        AuthBottomBar(
            buttonText = "Xác nhận mã",
            onButtonClick = { vm.verify(email, type) },
            isLoading = state.isLoading,
            buttonGradient = listOf(LtColors.Purple, LtColors.Pink),
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

// ── Forgot Password Screen ────────────────────────────────────────────────
@Composable
fun ForgotScreen(
    onLoginSuccess: () -> Unit,
    onBack: () -> Unit,
    vm: ForgotViewModel = koinViewModel(),
) {
    val state = vm.state
    var otpValue by remember { mutableStateOf("") }

    Box(modifier = Modifier.fillMaxSize().background(LtColors.Background)) {
        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {

            AuthHero(
                title = when(state.step) {
                    0 -> "Quên mật\nkhẩu? 🔐"
                    1 -> "Nhập mã\nxác nhận 📧"
                    2 -> "Tạo mật khẩu\nmới 🔑"
                    else -> "Đặt lại\nthành công! ✅"
                },
                subtitle = when(state.step) {
                    0 -> "Nhập email của bạn để đặt lại"
                    1 -> "Mã 6 chữ số đã gửi đến ${state.email}"
                    2 -> "Mật khẩu mới phải khác mật khẩu cũ"
                    else -> "Bạn có thể đăng nhập ngay bây giờ"
                },
                gradientColors = listOf(LtColors.Blue, LtColors.Purple)
            )

            Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp).padding(top = 24.dp, bottom = 140.dp)) {

                // Step indicator
                LtStepIndicator(currentStep = state.step + 1, totalSteps = 4, activeColor = LtColors.Blue)
                Spacer(Modifier.height(24.dp))

                if (state.error != null) { AuthErrorBanner(state.error); Spacer(Modifier.height(16.dp)) }

                when (state.step) {
                    0 -> {
                        AuthTextField(value = state.email, onValueChange = vm::onEmailChange,
                            label = "📧 Email đã đăng ký", placeholder = "email@example.com",
                            isError = state.emailError != null, errorText = state.emailError)
                        Spacer(Modifier.height(8.dp))
                        Text("Kiểm tra cả hộp thư spam nếu không thấy email", style = MaterialTheme.typography.bodySmall, color = LtColors.Gray2)
                    }
                    1 -> {
                        // OTP boxes
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally)) {
                            repeat(6) { i ->
                                val char = otpValue.getOrNull(i)?.toString() ?: ""
                                Box(modifier = Modifier.size(48.dp).clip(RoundedCornerShape(10.dp))
                                    .background(if (char.isNotEmpty()) Color.White else LtColors.Background),
                                    contentAlignment = Alignment.Center) {
                                    Text(char, style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black, color = LtColors.Dark))
                                }
                            }
                        }
                        Spacer(Modifier.height(16.dp))
                        OutlinedTextField(value = otpValue, onValueChange = { if (it.length <= 6 && it.all { c -> c.isDigit() }) otpValue = it },
                            modifier = Modifier.fillMaxWidth().height(1.dp).offset(y = (-9999).dp),
                            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = KeyboardType.NumberPassword))
                    }
                    2 -> {
                        AuthTextField(value = state.newPassword, onValueChange = vm::onNewPassChange, label = "🔑 Mật khẩu mới", isPassword = true, isError = state.passwordError != null, errorText = state.passwordError)
                        Spacer(Modifier.height(16.dp))
                        AuthTextField(value = state.confirmPassword, onValueChange = vm::onConfirmChange, label = "🔑 Xác nhận mật khẩu", isPassword = true)
                    }
                    3 -> {
                        Box(modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp), contentAlignment = Alignment.Center) {
                            Text("✅", fontSize = 72.sp)
                        }
                        Text("Mật khẩu đã được đặt lại thành công!", style = MaterialTheme.typography.bodyLarge.copy(textAlign = TextAlign.Center, color = LtColors.Green, fontWeight = FontWeight.Bold), modifier = Modifier.fillMaxWidth())
                    }
                }

                if (state.step < 3) {
                    Spacer(Modifier.height(16.dp))
                    Text("← Quay lại", style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray, fontWeight = FontWeight.SemiBold),
                        modifier = Modifier.clickable { onBack() })
                }
            }
        }

        if (state.step < 3) {
            AuthBottomBar(
                buttonText = when(state.step) { 0 -> "Gửi mã xác nhận"; 1 -> "Xác nhận mã"; else -> "Đặt lại mật khẩu" },
                onButtonClick = when(state.step) {
                    0 -> vm::sendOtp
                    1 -> { { vm.verifyOtp(otpValue) } }
                    else -> { { vm.resetPassword(otpValue) } }
                },
                isLoading = state.isLoading,
                buttonGradient = listOf(LtColors.Blue, LtColors.Purple),
                modifier = Modifier.align(Alignment.BottomCenter)
            )
        } else {
            AuthBottomBar(
                buttonText = "Đăng nhập ngay",
                onButtonClick = onLoginSuccess,
                buttonGradient = listOf(LtColors.Green, LtColors.Cyan),
                modifier = Modifier.align(Alignment.BottomCenter)
            )
        }
    }
}

@Composable
private fun LtStepIndicator(currentStep: Int, totalSteps: Int, activeColor: Color = LtColors.Pink) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        repeat(totalSteps) { i ->
            Box(modifier = Modifier.weight(1f).height(4.dp).clip(RoundedCornerShape(4.dp))
                .background(if (i < currentStep) activeColor else LtColors.Border))
        }
    }
}
