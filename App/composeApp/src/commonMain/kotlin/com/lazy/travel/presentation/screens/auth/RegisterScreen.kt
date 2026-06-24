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
import androidx.compose.ui.unit.dp
import com.lazy.travel.core.theme.LtColors
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun RegisterScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToOtp: (email: String) -> Unit,
    vm: RegisterViewModel = koinViewModel(),
) {
    val state = vm.state
    LaunchedEffect(state.navigateToOtp) {
        if (state.navigateToOtp) { vm.clearNavigation(); onNavigateToOtp(state.email) }
    }

    Box(modifier = Modifier.fillMaxSize().background(LtColors.Background)) {
        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {

            AuthHero(
                title = "Tạo tài khoản\nmiễn phí ✨",
                subtitle = "Bắt đầu hành trình đầu tiên của bạn",
                gradientColors = listOf(LtColors.Pink, LtColors.Orange)
            )

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .padding(top = 24.dp, bottom = 140.dp),
            ) {
                if (state.error != null) {
                    AuthErrorBanner(state.error)
                    Spacer(Modifier.height(16.dp))
                }

                AuthTextField(value = state.fullName, onValueChange = vm::onFullNameChange, label = "👤 Họ tên", placeholder = "Nguyễn Văn A")
                Spacer(Modifier.height(16.dp))
                AuthTextField(value = state.email, onValueChange = vm::onEmailChange, label = "📧 Email", placeholder = "email@example.com", isError = state.emailError != null, errorText = state.emailError)
                Spacer(Modifier.height(16.dp))
                AuthTextField(value = state.password, onValueChange = vm::onPasswordChange, label = "🔑 Mật khẩu", placeholder = "Nhập mật khẩu", isPassword = true, isError = state.passwordError != null, errorText = state.passwordError)

                // Password strength bar
                if (state.password.isNotEmpty()) {
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        repeat(3) { i ->
                            Box(modifier = Modifier.weight(1f).height(4.dp).clip(RoundedCornerShape(4.dp))
                                .background(when {
                                    i <= state.passwordStrength -> when(state.passwordStrength) { 0 -> LtColors.Error; 1 -> LtColors.Yellow; else -> LtColors.Green }
                                    else -> LtColors.Border
                                }))
                        }
                    }
                    Text(
                        when(state.passwordStrength) { 0 -> "Yếu"; 1 -> "Trung bình"; else -> "Mạnh" },
                        style = MaterialTheme.typography.labelSmall,
                        color = when(state.passwordStrength) { 0 -> LtColors.Error; 1 -> LtColors.Yellow; else -> LtColors.Green },
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }

                Spacer(Modifier.height(16.dp))
                AuthTextField(value = state.confirmPassword, onValueChange = vm::onConfirmChange, label = "🔑 Xác nhận mật khẩu", placeholder = "Nhập lại mật khẩu", isPassword = true, isError = state.confirmError != null, errorText = state.confirmError)

                Spacer(Modifier.height(20.dp))
                SocialLoginSection()
            }
        }

        AuthBottomBar(
            buttonText = "Tạo tài khoản",
            onButtonClick = vm::register,
            isLoading = state.isLoading,
            buttonGradient = listOf(LtColors.Pink, LtColors.Orange),
            footerContent = {
                Row {
                    Text("Đã có tài khoản? ", style = MaterialTheme.typography.bodyMedium, color = LtColors.Gray)
                    Text("Đăng nhập", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.ExtraBold, color = LtColors.Blue), modifier = Modifier.clickable { onNavigateToLogin() })
                }
            },
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}
