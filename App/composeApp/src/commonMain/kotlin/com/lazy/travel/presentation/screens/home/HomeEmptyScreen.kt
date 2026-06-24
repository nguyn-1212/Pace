package com.lazy.travel.presentation.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazy.travel.core.theme.LtColors

// ── Data models ────────────────────────────────────────────────────────────
data class ChecklistItem(val key: String, val title: String, val sub: String, val done: Boolean)
data class TrendingDest(val name: String, val emoji: String, val reason: String, val weather: String, val gradColors: List<Color>)
data class TripTemplateItem(val name: String, val emoji: String, val meta: String, val price: String, val gradColors: List<Color>)
data class FriendActivity(val name: String, val initials: String, val color: Color, val tripName: String, val isLive: Boolean)

@Composable
fun HomeEmptyScreen(
    userName: String = "Nguyên",
    onCreateTrip: () -> Unit = {},
    onJoinTrip: () -> Unit = {},
    onJoinByCode: (String) -> Unit = {},
    onViewTemplate: (String) -> Unit = {},
    onViewFriendTrip: (String) -> Unit = {},
) {
    val checklistItems = remember {
        listOf(
            ChecklistItem("register",  "Tạo tài khoản",            "Xong rồi! 🎉",                       true),
            ChecklistItem("trip",      "Tạo chuyến đi đầu tiên",   "Đặt tên, ngày đi, điểm đến",          false),
            ChecklistItem("invite",    "Mời bạn bè vào nhóm",      "Gửi mã 6 ký tự cho cả nhóm",          false),
            ChecklistItem("itinerary", "Thêm lịch trình ngày đầu", "Check-in, địa điểm, ghi chú",          false),
            ChecklistItem("budget",    "Thiết lập ngân sách nhóm", "Chia tiền tự động sau mỗi chi tiêu",   false),
        )
    }
    var checkState by remember { mutableStateOf(checklistItems.map { it.done }) }

    val trending = listOf(
        TrendingDest("Da Nang",  "🏖️", "Mua bien dep nhat\n23-32°C",       "☀️ Nang dep ca tuan",  listOf(Color(0xFF06B6D4), Color(0xFF2563EB))),
        TrendingDest("Hoi An",   "🛕", "Pho co lung linh\nmua hoa",          "🌸 Dep nhat thang 6",  listOf(Color(0xFFF59E0B), Color(0xFFEC4899))),
        TrendingDest("Sapa",     "🏔️", "Tranh nong\ngia phong re",           "🌡️ Mat me 18-24°C",    listOf(Color(0xFF10B981), Color(0xFF065F46))),
        TrendingDest("Phu Quoc", "🌊", "Mua kho ly tuong\nbien trong xanh",  "🌊 Bien dep nhat nam", listOf(Color(0xFF06B6D4), Color(0xFF10B981))),
    )

    val templates = listOf(
        TripTemplateItem("Da Nang 3N2D",   "🏖️", "6 nguoi • Ba Na, My Khe, Hoi An",     "~3.5M/nguoi", listOf(Color(0xFF06B6D4), Color(0xFF2563EB))),
        TripTemplateItem("Sapa 2N1D",      "🏔️", "4 nguoi • Fansipan, ruong bac thang",  "~1.8M/nguoi", listOf(Color(0xFF10B981), Color(0xFF065F46))),
        TripTemplateItem("Phu Quoc 4N3D",  "🌊", "5 nguoi • Bai Sao, VinWonders",        "~5.2M/nguoi", listOf(Color(0xFF7C3AED), Color(0xFFEC4899))),
    )

    val feedItems = listOf(
        Triple(LtColors.Green, "Mot nhom 5 nguoi vua tao chuyen Hoi An thang 6", "2 phut truoc"),
        Triple(LtColors.Blue,  "12 nhom dang len ke hoach cho thang 7",          "vua xong"),
        Triple(LtColors.Pink,  "Nhom 4 nguoi vua check-in Cau Vang – Ba Na Hills", "8 phut truoc"),
        Triple(LtColors.Orange,"Nhom ban tai Sapa vua hoan thanh chia tien chuyen di • 3.2M ÷ 5 nguoi", "15 phut truoc"),
    )

    var joinCode by remember { mutableStateOf("") }
    val doneCount = checkState.count { it }
    val progress = doneCount.toFloat() / checklistItems.size

    Box(modifier = Modifier.fillMaxSize().background(LtColors.Background)) {
        Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {

            // ── Status bar ─────────────────────────────────────────────────
            Row(modifier = Modifier.fillMaxWidth().background(LtColors.Background).padding(horizontal = 20.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text("9:41", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Black))
                Row(horizontalArrangement = Arrangement.spacedBy(5.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text("●●●●", style = MaterialTheme.typography.bodySmall)
                    Text("WiFi", style = MaterialTheme.typography.bodySmall)
                    Text("🔋", style = MaterialTheme.typography.bodySmall)
                }
            }

            // ── Top bar ────────────────────────────────────────────────────
            Row(modifier = Modifier.fillMaxWidth().background(LtColors.Background).padding(horizontal = 20.dp).padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text("👋 Xin chào!", style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray, fontWeight = FontWeight.Medium))
                    Text(buildAnnotatedString {
                        append("Hey, ")
                        withStyle(SpanStyle(color = LtColors.Pink)) { append(userName) }
                        append(" 🌟")
                    }, style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Black))
                }
                Text(buildAnnotatedString {
                    append("✈️ ")
                    withStyle(SpanStyle(color = LtColors.Pink)) { append("Lazy") }
                    append("Travel")
                }, style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Black))
            }

            Column(modifier = Modifier.fillMaxWidth().padding(bottom = 100.dp), verticalArrangement = Arrangement.spacedBy(0.dp)) {

                // ── Hero card ──────────────────────────────────────────────
                Box(modifier = Modifier.padding(horizontal = 16.dp).fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Brush.linearGradient(listOf(Color(0xFFFFF0EA), Color(0xFFFFE0EC), Color(0xFFEEF2FF))))
                    .border(1.5.dp, LtColors.Border, RoundedCornerShape(12.dp))
                    .padding(20.dp)
                ) {
                    // Blobs
                    Box(modifier = Modifier.size(160.dp).offset(x = 40.dp, y = (-50).dp)
                        .clip(RoundedCornerShape(80.dp))
                        .background(Brush.radialGradient(listOf(LtColors.Pink.copy(alpha = 0.08f), Color.Transparent)))
                        .align(Alignment.TopEnd))
                    Column {
                        // Eyebrow
                        Box(modifier = Modifier.clip(RoundedCornerShape(6.dp))
                            .background(LtColors.Pink.copy(alpha = 0.1f))
                            .border(1.dp, LtColors.Pink.copy(alpha = 0.2f), RoundedCornerShape(6.dp))
                            .padding(horizontal = 12.dp, vertical = 5.dp)) {
                            Text("✦ CONG DONG DU LICH NHOM", style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold, color = LtColors.Pink, letterSpacing = 0.8.sp, fontSize = 9.sp))
                        }
                        Spacer(Modifier.height(14.dp))
                        Text(buildAnnotatedString {
                            withStyle(SpanStyle(color = LtColors.Pink, fontWeight = FontWeight.Black)) { append("847 nhom") }
                            append(" da check-in\ntai Da Nang tuan truoc 🏖️")
                        }, style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Black, lineHeight = 28.sp, color = LtColors.Dark))
                        Spacer(Modifier.height(8.dp))
                        Text("Len ke hoach cung nhau, chia tien ro rang, luu ky niem chung — tat ca o mot noi.",
                            style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray, lineHeight = 18.sp))
                        Spacer(Modifier.height(16.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            ChipTag("● 1.200+ nhom dang hoat dong", LtColors.Green)
                            ChipTag("🇻🇳 Made for Viet Nam", LtColors.Blue)
                        }
                    }
                }

                Spacer(Modifier.height(20.dp))

                // ── CTA Buttons ────────────────────────────────────────────
                Column(modifier = Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(modifier = Modifier.fillMaxWidth().height(52.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Brush.horizontalGradient(listOf(LtColors.Pink, LtColors.Orange)))
                        .clickable { onCreateTrip() },
                        contentAlignment = Alignment.Center) {
                        Text("✦ Tao chuyen di moi", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.ExtraBold, color = Color.White))
                    }
                    Box(modifier = Modifier.fillMaxWidth().height(52.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(LtColors.White)
                        .border(1.5.dp, LtColors.Border, RoundedCornerShape(10.dp))
                        .clickable { onJoinTrip() },
                        contentAlignment = Alignment.Center) {
                        Text("🔗 Tham gia nhom ban be", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.ExtraBold, color = LtColors.Dark))
                    }
                }

                Spacer(Modifier.height(20.dp))

                // ── Join code ──────────────────────────────────────────────
                Row(modifier = Modifier.padding(horizontal = 16.dp).fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(LtColors.White)
                    .border(1.5.dp, LtColors.Border, RoundedCornerShape(10.dp))
                    .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(modifier = Modifier.size(34.dp).clip(RoundedCornerShape(8.dp))
                        .background(LtColors.BlueLight)
                        .border(1.dp, LtColors.Blue.copy(alpha = 0.15f), RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center) { Text("🎟️", fontSize = 16.sp) }
                    Spacer(Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Co ma moi?", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.ExtraBold))
                        Text("Ma 6 ky tu · het han sau 48h", style = MaterialTheme.typography.labelSmall.copy(color = LtColors.Gray))
                    }
                    Spacer(Modifier.width(8.dp))
                    OutlinedTextField(
                        value = joinCode, onValueChange = { if (it.length <= 6) joinCode = it.uppercase() },
                        placeholder = { Text("DN2025", style = MaterialTheme.typography.labelSmall.copy(color = LtColors.Gray2)) },
                        singleLine = true, modifier = Modifier.width(90.dp),
                        shape = RoundedCornerShape(7.dp),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = LtColors.Blue, unfocusedBorderColor = LtColors.Border, focusedContainerColor = LtColors.Background, unfocusedContainerColor = LtColors.Background),
                        textStyle = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.ExtraBold, letterSpacing = 2.sp, textAlign = androidx.compose.ui.text.style.TextAlign.Center),
                    )
                    Spacer(Modifier.width(7.dp))
                    Box(modifier = Modifier.clip(RoundedCornerShape(7.dp)).background(LtColors.Blue)
                        .clickable { if (joinCode.length >= 4) onJoinByCode(joinCode) }
                        .padding(horizontal = 14.dp, vertical = 9.dp)) {
                        Text("Vao →", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.ExtraBold, color = Color.White))
                    }
                }

                Spacer(Modifier.height(20.dp))

                // ── Trending destinations ──────────────────────────────────
                SectionTitle("🔥 Dang hot mua nay")
                Row(modifier = Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    trending.forEach { dest ->
                        DestCard(dest)
                    }
                }

                Spacer(Modifier.height(20.dp))

                // ── Activity feed ──────────────────────────────────────────
                SectionTitle("⚡ Dang dien ra")
                Column(modifier = Modifier.padding(horizontal = 16.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(LtColors.White)
                    .border(1.5.dp, LtColors.Border, RoundedCornerShape(10.dp))) {
                    feedItems.forEachIndexed { i, (color, text, time) ->
                        Row(modifier = Modifier.fillMaxWidth()
                            .then(if (i < feedItems.size - 1) Modifier.border(bottom = 1.dp, color = LtColors.Border) else Modifier)
                            .padding(horizontal = 14.dp, vertical = 11.dp),
                            verticalAlignment = Alignment.Top) {
                            Box(modifier = Modifier.size(8.dp).offset(y = 4.dp).clip(RoundedCornerShape(4.dp)).background(color))
                            Spacer(Modifier.width(10.dp))
                            Text(text, style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Dark, lineHeight = 17.sp), modifier = Modifier.weight(1f))
                            Spacer(Modifier.width(8.dp))
                            Text(time, style = MaterialTheme.typography.labelSmall.copy(color = LtColors.Gray2), modifier = Modifier.padding(top = 2.dp))
                        }
                    }
                }

                Spacer(Modifier.height(20.dp))

                // ── Feature highlights ─────────────────────────────────────
                SectionTitle("💡 Lazy Travel co gi?")
                val features = listOf(
                    "📍" to Pair("Khong con nhan 'may dang o dau' 50 lan nua", "Xem vi tri ca nhom theo thoi gian thuc"),
                    "💸" to Pair("Chia tien chuyen di? Xong trong 10 giay", "Tu tinh, tu chia, chuyen khoan mot cham"),
                    "🗳️" to Pair("Ca nhom khong the thong nhat? Vote la xong", "Bieu quyet dia diem, lich trinh minh bach"),
                    "📸" to Pair("Anh ca nhom, mot cho, khong ai bi thieu", "Timeline chung luu moi khoanh khac"),
                )
                Row(modifier = Modifier.padding(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        features.filterIndexed { i, _ -> i % 2 == 0 }.forEach { (emoji, pair) -> FeatCard(emoji, pair.first, pair.second) }
                    }
                    Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        features.filterIndexed { i, _ -> i % 2 == 1 }.forEach { (emoji, pair) -> FeatCard(emoji, pair.first, pair.second) }
                    }
                }

                Spacer(Modifier.height(20.dp))

                // ── Checklist ──────────────────────────────────────────────
                SectionTitle("✅ Chuan bi chuyen di dau tien")
                Column(modifier = Modifier.padding(horizontal = 16.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(LtColors.White)
                    .border(1.5.dp, LtColors.Border, RoundedCornerShape(10.dp))) {
                    // Header
                    Column(modifier = Modifier.fillMaxWidth().padding(14.dp, 14.dp, 14.dp, 0.dp)) {
                        Text("Bat dau tu day — 5 buoc don gian", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.ExtraBold))
                        Spacer(Modifier.height(2.dp))
                        Text("Hoan thanh de tao chuyen di dau tien cua ban", style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray))
                        Spacer(Modifier.height(10.dp))
                        // Progress bar
                        Box(modifier = Modifier.fillMaxWidth().height(4.dp).clip(RoundedCornerShape(4.dp)).background(LtColors.Border)) {
                            Box(modifier = Modifier.fillMaxWidth(progress).height(4.dp).clip(RoundedCornerShape(4.dp))
                                .background(Brush.horizontalGradient(listOf(LtColors.Pink, LtColors.Orange))))
                        }
                        Spacer(Modifier.height(4.dp))
                    }
                    Divider(color = LtColors.Border, thickness = 1.dp)
                    checklistItems.forEachIndexed { i, item ->
                        val isDone = checkState[i]
                        Row(modifier = Modifier.fillMaxWidth().clickable {
                            val newState = checkState.toMutableList()
                            newState[i] = !newState[i]
                            checkState = newState
                        }.padding(horizontal = 16.dp, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(22.dp).clip(RoundedCornerShape(6.dp))
                                .background(if (isDone) LtColors.Green else Color.Transparent)
                                .border(if (isDone) 0.dp else 1.5.dp, LtColors.Border, RoundedCornerShape(6.dp)),
                                contentAlignment = Alignment.Center) {
                                if (isDone) Text("✓", style = MaterialTheme.typography.labelSmall.copy(color = Color.White, fontWeight = FontWeight.Black))
                            }
                            Spacer(Modifier.width(12.dp))
                            Column {
                                Text(item.title, style = MaterialTheme.typography.bodyMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = if (isDone) LtColors.Gray2 else LtColors.Dark,
                                    textDecoration = if (isDone) androidx.compose.ui.text.style.TextDecoration.LineThrough else null
                                ))
                                Text(item.sub, style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray))
                            }
                        }
                        if (i < checklistItems.size - 1) Divider(color = LtColors.Border, thickness = 1.dp, modifier = Modifier.padding(start = 50.dp))
                    }
                }

                Spacer(Modifier.height(20.dp))

                // ── Trip templates ─────────────────────────────────────────
                SectionTitle("🗂️ Chuyen di pho bien — dung ngay")
                Column(modifier = Modifier.padding(horizontal = 16.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(LtColors.White)
                    .border(1.5.dp, LtColors.Border, RoundedCornerShape(10.dp))) {
                    templates.forEachIndexed { i, tpl ->
                        Row(modifier = Modifier.fillMaxWidth().clickable { onViewTemplate(tpl.name) }
                            .padding(horizontal = 14.dp, vertical = 13.dp),
                            verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(44.dp).clip(RoundedCornerShape(8.dp))
                                .background(Brush.linearGradient(tpl.gradColors)),
                                contentAlignment = Alignment.Center) { Text(tpl.emoji, fontSize = 20.sp) }
                            Spacer(Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(tpl.name, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.ExtraBold))
                                Text(tpl.meta, style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray))
                            }
                            Text(tpl.price, style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black, color = LtColors.Green))
                            Spacer(Modifier.width(8.dp))
                            Text("›", style = MaterialTheme.typography.titleLarge.copy(color = LtColors.Gray2))
                        }
                        if (i < templates.size - 1) Divider(color = LtColors.Border, thickness = 1.dp)
                    }
                }

                Spacer(Modifier.height(20.dp))
            }
        }

        // ── Bottom nav ─────────────────────────────────────────────────────
        Row(modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth()
            .background(LtColors.Background.copy(alpha = 0.96f))
            .padding(horizontal = 8.dp, vertical = 10.dp)
            .navigationBarsPadding(),
            horizontalArrangement = Arrangement.SpaceEvenly, verticalAlignment = Alignment.CenterVertically) {
            NavItem("🏠", "Home", true)
            NavItem("🗺️", "Kham pha")
            // Plus button
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(modifier = Modifier.size(48.dp).offset(y = (-16).dp).clip(RoundedCornerShape(10.dp))
                    .background(Brush.linearGradient(listOf(LtColors.Pink, LtColors.Orange)))
                    .clickable { onCreateTrip() },
                    contentAlignment = Alignment.Center) { Text("+", style = MaterialTheme.typography.headlineSmall.copy(color = Color.White, fontWeight = FontWeight.Black)) }
                Text("Tao nhom", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = LtColors.Pink, fontSize = 9.sp))
            }
            NavItem("👥", "Ban be")
            NavItem("👤", "Toi")
        }
    }
}

// ── Helper composables ────────────────────────────────────────────────────

@Composable
private fun SectionTitle(text: String) {
    Text(text, style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.ExtraBold, color = LtColors.Dark),
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 0.dp).padding(bottom = 12.dp))
}

@Composable
private fun ChipTag(text: String, color: Color) {
    Box(modifier = Modifier.clip(RoundedCornerShape(20.dp)).background(LtColors.White)
        .border(1.5.dp, LtColors.Border, RoundedCornerShape(20.dp)).padding(horizontal = 11.dp, vertical = 5.dp)) {
        Text(text, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = LtColors.Dark))
    }
}

@Composable
private fun DestCard(dest: TrendingDest) {
    Column(modifier = Modifier.width(155.dp).clip(RoundedCornerShape(10.dp))
        .background(LtColors.White).border(1.5.dp, LtColors.Border, RoundedCornerShape(10.dp))) {
        Box(modifier = Modifier.fillMaxWidth().height(96.dp).background(Brush.linearGradient(dest.gradColors))) {
            Text(dest.emoji, fontSize = 42.sp, modifier = Modifier.align(Alignment.Center))
            Box(modifier = Modifier.matchParentSize().background(Brush.verticalGradient(listOf(Color.Transparent, Color.Black.copy(alpha = 0.35f)))))
            Text(dest.reason, style = MaterialTheme.typography.labelSmall.copy(color = Color.White, fontWeight = FontWeight.Bold, fontSize = 9.sp, lineHeight = 12.sp),
                modifier = Modifier.align(Alignment.BottomStart).padding(6.dp))
        }
        Column(modifier = Modifier.padding(9.dp)) {
            Text(dest.name, style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Black))
            Text(dest.weather, style = MaterialTheme.typography.bodySmall.copy(color = LtColors.Gray))
        }
    }
}

@Composable
private fun FeatCard(emoji: String, title: String, sub: String) {
    Column(modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp))
        .background(LtColors.White).border(1.5.dp, LtColors.Border, RoundedCornerShape(10.dp)).padding(13.dp)) {
        Text(emoji, fontSize = 24.sp)
        Spacer(Modifier.height(10.dp))
        Text(title, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold, lineHeight = 16.sp))
        Spacer(Modifier.height(4.dp))
        Text(sub, style = MaterialTheme.typography.labelSmall.copy(color = LtColors.Gray, lineHeight = 14.sp))
    }
}

@Composable
private fun NavItem(emoji: String, label: String, active: Boolean = false) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(4.dp)) {
        Text(emoji, fontSize = 21.sp)
        Text(label, style = MaterialTheme.typography.labelSmall.copy(
            fontWeight = FontWeight.Bold, fontSize = 9.sp,
            color = if (active) LtColors.Pink else LtColors.Gray2
        ))
    }
}

// Helper for bottom border on Row
fun Modifier.border(bottom: androidx.compose.ui.unit.Dp, color: Color): Modifier = this.then(
    Modifier.padding(bottom = bottom)
)
