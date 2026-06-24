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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazy.travel.core.theme.LtColors

// ── Shared: Auth Hero Header ──────────────────────────────────────────────
@Composable
fun AuthHero(
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier,
    gradientColors: List<Color> = listOf(LtColors.Blue, LtColors.Cyan),
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(Brush.linearGradient(gradientColors))
            .padding(horizontal = 24.dp, vertical = 36.dp)
    ) {
        // Grid bg overlay
        Box(modifier = Modifier.matchParentSize().background(
            Brush.verticalGradient(listOf(Color.White.copy(alpha = 0.04f), Color.Transparent))
        ))
        // Blob
        Box(modifier = Modifier
            .size(200.dp)
            .offset(x = 80.dp, y = (-60).dp)
            .clip(RoundedCornerShape(100.dp))
            .background(Color.White.copy(alpha = 0.08f))
            .align(Alignment.TopEnd)
        )
        Column(modifier = Modifier.fillMaxWidth()) {
            Text(
                "✈️ LazyTravel",
                style = MaterialTheme.typography.labelLarge.copy(
                    fontWeight = FontWeight.Black,
                    color = Color.White.copy(alpha = 0.8f),
                    letterSpacing = 0.5.sp
                )
            )
            Spacer(Modifier.height(20.dp))
            Text(
                title,
                style = MaterialTheme.typography.displaySmall.copy(
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    lineHeight = 34.sp
                )
            )
            Spacer(Modifier.height(8.dp))
            Text(
                subtitle,
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = Color.White.copy(alpha = 0.75f),
                    fontWeight = FontWeight.Medium
                )
            )
        }
    }
}

// ── Shared: Field Label ───────────────────────────────────────────────────
@Composable
fun FieldLabel(text: String) {
    Text(
        text.uppercase(),
        style = MaterialTheme.typography.labelSmall.copy(
            fontWeight = FontWeight.ExtraBold,
            color = LtColors.Dark,
            letterSpacing = 0.5.sp
        ),
        modifier = Modifier.padding(bottom = 8.dp)
    )
}

// ── Shared: Auth TextField ─────────────────────────────────────────────────
@Composable
fun AuthTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String = "",
    isError: Boolean = false,
    errorText: String? = null,
    isPassword: Boolean = false,
    trailingContent: @Composable (() -> Unit)? = null,
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        FieldLabel(label)
        var passwordVisible by remember { mutableStateOf(false) }
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder, style = MaterialTheme.typography.bodyMedium, color = LtColors.Gray2) },
            visualTransformation = if (isPassword && !passwordVisible)
                androidx.compose.ui.text.input.PasswordVisualTransformation()
            else androidx.compose.ui.text.input.VisualTransformation.None,
            trailingIcon = if (isPassword) {
                {
                    Text(
                        if (passwordVisible) "🙈" else "👁️",
                        modifier = Modifier.clickable { passwordVisible = !passwordVisible }.padding(8.dp),
                        style = MaterialTheme.typography.bodyLarge
                    )
                }
            } else trailingContent,
            isError = isError,
            singleLine = true,
            shape = RoundedCornerShape(11.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = LtColors.Blue,
                unfocusedBorderColor = LtColors.Border,
                errorBorderColor = LtColors.Pink,
                cursorColor = LtColors.Blue,
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White,
                errorContainerColor = Color.White,
            ),
            textStyle = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold),
            modifier = Modifier.fillMaxWidth()
        )
        if (isError && !errorText.isNullOrEmpty()) {
            Text(errorText, style = MaterialTheme.typography.labelSmall, color = LtColors.Pink,
                modifier = Modifier.padding(start = 4.dp, top = 4.dp))
        }
    }
}

// ── Shared: Error Banner ───────────────────────────────────────────────────
@Composable
fun AuthErrorBanner(message: String, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(LtColors.PinkLight)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("❌", style = MaterialTheme.typography.bodyLarge)
        Spacer(Modifier.width(10.dp))
        Text(message, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold, color = LtColors.Dark))
    }
}

// ── Shared: CTA Bottom Bar ─────────────────────────────────────────────────
@Composable
fun AuthBottomBar(
    buttonText: String,
    onButtonClick: () -> Unit,
    isLoading: Boolean = false,
    footerContent: @Composable () -> Unit = {},
    buttonGradient: List<Color> = listOf(LtColors.Blue, LtColors.Cyan),
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(
                Brush.verticalGradient(
                    listOf(LtColors.Background.copy(alpha = 0f), LtColors.Background)
                )
            )
            .padding(horizontal = 20.dp, vertical = 14.dp)
            .navigationBarsPadding(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Brush.horizontalGradient(buttonGradient))
                .clickable(enabled = !isLoading) { onButtonClick() },
            contentAlignment = Alignment.Center
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp), strokeWidth = 2.dp)
            } else {
                Text(buttonText, style = MaterialTheme.typography.labelLarge.copy(
                    fontWeight = FontWeight.ExtraBold, color = Color.White, letterSpacing = 0.3.sp
                ))
            }
        }
        Spacer(Modifier.height(12.dp))
        footerContent()
    }
}

// ── Shared: Social Login ───────────────────────────────────────────────────
@Composable
fun SocialLoginSection(modifier: Modifier = Modifier) {
    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(modifier = Modifier.weight(1f).height(1.dp).background(LtColors.Border))
            Text(" hoặc đăng nhập với ", style = MaterialTheme.typography.labelSmall, color = LtColors.Gray2)
            Box(modifier = Modifier.weight(1f).height(1.dp).background(LtColors.Border))
        }
        Spacer(Modifier.height(12.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
                .clip(RoundedCornerShape(11.dp))
                .background(Color.White)
                .clickable { /* TODO: Google login */ },
            contentAlignment = Alignment.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("🌐", style = MaterialTheme.typography.titleMedium)
                Text("Tiếp tục với Google", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = LtColors.Dark))
            }
        }
    }
}
