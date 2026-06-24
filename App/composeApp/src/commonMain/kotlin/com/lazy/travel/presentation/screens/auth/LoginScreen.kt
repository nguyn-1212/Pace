package com.lazy.travel.presentation.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.lazy.travel.core.i18n.LtStrings
import com.lazy.travel.core.theme.LtColors
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun LoginScreen(
    onNavigateToRegister: () -> Unit,
    onNavigateToForgot: () -> Unit,
    onLoginSuccess: () -> Unit,
    vm: LoginViewModel = koinViewModel(),
) {
    val state = vm.state
    LaunchedEffect(state.navigateToHome) {
        if (state.navigateToHome) { vm.clearNavigation(); onLoginSuccess() }
    }

    Box(modifier = Modifier.fillMaxSize().background(LtColors.Background)) {
        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {

            // ── Hero Header (Blue → Cyan) ─────────────────────────────────
            AuthHero(
                title = "Chào mừng\ntrở lại! ✈️",
                subtitle = "Đăng nhập để tiếp tục hành trình của bạn",
                gradientColors = listOf(LtColors.Blue, LtColors.Cyan)
            )

            // ── Form Body ─────────────────────────────────────────────────
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .padding(top = 24.dp, bottom = 140.dp),
            ) {
                // Error banner
                if (state.error != null) {
                    AuthErrorBanner(LtStrings.resolve(state.error))
                    Spacer(Modifier.height(16.dp))
                }

                AuthTextField(
                    value = state.email,
                    onValueChange = vm::onEmailChange,
                    label = "📧 Email",
                    placeholder = "email@example.com",
                    isError = state.emailError != null,
                    errorText = state.emailError,
                )
                Spacer(Modifier.height(16.dp))

                AuthTextField(
                    value = state.password,
                    onValueChange = vm::onPasswordChange,
                    label = "🔑 Mật khẩu",
                    placeholder = "Nhập mật khẩu",
                    isPassword = true,
                    isError = state.passwordError != null,
                    errorText = state.passwordError,
                )

                // Forgot password link (right aligned)
                Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
                    Text(
                        "Quên mật khẩu?",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontWeight = FontWeight.Bold, color = LtColors.Blue
                        ),
                        modifier = Modifier
                            .padding(top = 8.dp)
                            .clickable { onNavigateToForgot() }
                    )
                }

                Spacer(Modifier.height(20.dp))
                SocialLoginSection()
            }
        }

        // ── Fixed Bottom CTA ──────────────────────────────────────────────
        AuthBottomBar(
            buttonText = "Đăng nhập",
            onButtonClick = vm::login,
            isLoading = state.isLoading,
            buttonGradient = listOf(LtColors.Blue, LtColors.Cyan),
            footerContent = {
                Row {
                    Text("Chưa có tài khoản? ", style = MaterialTheme.typography.bodyMedium, color = LtColors.Gray)
                    Text(
                        "Đăng ký miễn phí",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.ExtraBold, color = LtColors.Pink),
                        modifier = Modifier.clickable { onNavigateToRegister() }
                    )
                }
            },
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}
