package com.lazy.travel.presentation.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.unit.sp
import com.lazy.travel.core.theme.LtColors
import com.lazy.travel.data.remote.dto.SetupProfileRequest
import org.koin.compose.viewmodel.koinViewModel

private val travelStyles = listOf(
    "backpacker" to "🎒 Backpacker",
    "comfort"    to "Comfort",
    "luxury"     to "Luxury",
    "spontaneous" to "Spontaneous",
    "planner"    to "📋 Kế hoạch",
    "foodlover"  to "Food lover",
)
private val interestItems = listOf(
    "beach" to "🏖️ Biển", "mountain" to "⛰️ Núi", "food" to "🍜 Ẩm thực",
    "checkin" to "📍 Check-in", "backpack" to "🎒 Backpack",
    "nature" to "🌿 Thiên nhiên", "culture" to "🏛️ Văn hóa", "roadtrip" to "🛣️ Road trip",
)

@Composable
fun SetupScreen(
    onSetupComplete: () -> Unit,
    vm: SetupViewModel = koinViewModel(),
) {
    val state = vm.state
    LaunchedEffect(state.navigateToHome) {
        if (state.navigateToHome) { vm.clearNavigation(); onSetupComplete() }
    }

    Box(modifier = Modifier.fillMaxSize().background(LtColors.Background)) {
        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {

            AuthHero(
                title = "BƯỚC CUỐI CÙNG\nHoàn thiện profile 🌏",
                subtitle = "Giúp bạn bè tìm thấy bạn dễ hơn",
                gradientColors = listOf(LtColors.Green, LtColors.Cyan)
            )

            Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp).padding(top = 24.dp, bottom = 140.dp)) {

                if (state.error != null) { AuthErrorBanner(state.error); Spacer(Modifier.height(16.dp)) }

                // Avatar placeholder
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
                    Box(
                        modifier = Modifier.size(80.dp).clip(CircleShape)
                            .background(LtColors.GreenLight)
                            .border(2.dp, LtColors.Green, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("📷", fontSize = 32.sp)
                    }
                }
                Spacer(Modifier.height(20.dp))

                // Username
                FieldLabel("@ USERNAME")
                OutlinedTextField(
                    value = state.username,
                    onValueChange = vm::onUsernameChange,
                    placeholder = { Text("username", style = MaterialTheme.typography.bodyMedium, color = LtColors.Gray2) },
                    prefix = { Text("lazytv.app/@", style = MaterialTheme.typography.bodyMedium.copy(color = LtColors.Gray2)) },
                    singleLine = true,
                    shape = RoundedCornerShape(11.dp),
                    isError = state.usernameStatus == UsernameStatus.TAKEN,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = when(state.usernameStatus) {
                            UsernameStatus.AVAILABLE -> LtColors.Green
                            UsernameStatus.TAKEN -> LtColors.Pink
                            else -> LtColors.Blue
                        },
                        unfocusedBorderColor = LtColors.Border,
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White,
                    ),
                    textStyle = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold),
                    modifier = Modifier.fillMaxWidth()
                )
                when(state.usernameStatus) {
                    UsernameStatus.CHECKING -> Text("Đang kiểm tra...", style = MaterialTheme.typography.labelSmall, color = LtColors.Gray2, modifier = Modifier.padding(top = 4.dp, start = 4.dp))
                    UsernameStatus.AVAILABLE -> Text("✓ Tên người dùng hợp lệ", style = MaterialTheme.typography.labelSmall, color = LtColors.Green, modifier = Modifier.padding(top = 4.dp, start = 4.dp))
                    UsernameStatus.TAKEN -> Text("Tên đã được sử dụng", style = MaterialTheme.typography.labelSmall, color = LtColors.Pink, modifier = Modifier.padding(top = 4.dp, start = 4.dp))
                    else -> {}
                }

                Spacer(Modifier.height(16.dp))

                // Bio
                FieldLabel("💬 BIO")
                OutlinedTextField(
                    value = state.bio,
                    onValueChange = vm::onBioChange,
                    placeholder = { Text("Không bắt buộc", color = LtColors.Gray2) },
                    singleLine = false, maxLines = 3,
                    suffix = { Text("${state.bio.length}/120", style = MaterialTheme.typography.labelSmall, color = LtColors.Gray2) },
                    shape = RoundedCornerShape(11.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = LtColors.Blue, unfocusedBorderColor = LtColors.Border, focusedContainerColor = Color.White, unfocusedContainerColor = Color.White),
                    textStyle = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(Modifier.height(20.dp))

                // Travel Style
                FieldLabel("✈️ PHONG CÁCH DU LỊCH")
                Text("Không bắt buộc", style = MaterialTheme.typography.labelSmall, color = LtColors.Gray2)
                Spacer(Modifier.height(8.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(travelStyles) { (key, label) ->
                        val sel = state.travelStyle == key
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (sel) LtColors.Blue else Color.White)
                                .border(1.5.dp, if (sel) LtColors.Blue else LtColors.Border, RoundedCornerShape(20.dp))
                                .clickable { vm.onTravelStyleChange(key) }
                                .padding(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Text(label, style = MaterialTheme.typography.labelLarge.copy(
                                fontWeight = FontWeight.Bold,
                                color = if (sel) Color.White else LtColors.Dark
                            ))
                        }
                    }
                }

                Spacer(Modifier.height(20.dp))

                // Interests
                FieldLabel("🌟 SỞ THÍCH")
                Text("Không bắt buộc", style = MaterialTheme.typography.labelSmall, color = LtColors.Gray2)
                Spacer(Modifier.height(8.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    interestItems.forEach { (key, label) ->
                        val sel = state.interests.contains(key)
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (sel) LtColors.GreenLight else Color.White)
                                .border(1.5.dp, if (sel) LtColors.Green else LtColors.Border, RoundedCornerShape(20.dp))
                                .clickable { vm.toggleInterest(key) }
                                .padding(horizontal = 12.dp, vertical = 7.dp)
                        ) {
                            Text(label, style = MaterialTheme.typography.labelLarge.copy(
                                fontWeight = FontWeight.SemiBold,
                                color = if (sel) LtColors.Green else LtColors.Gray
                            ))
                        }
                    }
                }
            }
        }

        AuthBottomBar(
            buttonText = "Hoàn tất & Vào app! 🚀",
            onButtonClick = {
                vm.setup()
            },
            isLoading = state.isLoading,
            buttonGradient = listOf(LtColors.Green, LtColors.Cyan),
            footerContent = {
                Text(
                    "Bỏ qua, làm sau",
                    style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray, fontWeight = FontWeight.SemiBold),
                    modifier = Modifier.clickable { onSetupComplete() }
                )
            },
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

