package com.lazy.travel.presentation.screens.auth

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lazy.travel.core.theme.LtColors
import kotlin.math.abs

private data class OnboardSlide(
    val emoji: String,
    val tag: String,
    val titleNormal: String,
    val titleEmphasis: String,
    val titleEnd: String,
    val desc: String,
    val bgGradient: List<Color>,
    val blobColor: Color,
    val blobTopEnd: Boolean = true,
)

@Composable
fun OnboardingScreen(onGetStarted: () -> Unit, onSkip: () -> Unit) {
    val slides = listOf(
        OnboardSlide(
            emoji = "✈️",
            tag = "✦ LAZY TRAVEL",
            titleNormal = "Du lịch nhóm\n",
            titleEmphasis = "dễ hơn bao giờ\n",
            titleEnd = "hết.",
            desc = "Lên kế hoạch, chia tiền, lưu kỷ niệm — tất cả trong một app. Cùng nhóm bạn, không còn ai bị bỏ lại phía sau.",
            bgGradient = listOf(Color(0xFF0C0C14), Color(0xFF1a0530), LtColors.Pink),
            blobColor = LtColors.Pink,
            blobTopEnd = true,
        ),
        OnboardSlide(
            emoji = "🗺️",
            tag = "✦ KẾT NỐI CẢ NHÓM",
            titleNormal = "Xem nhóm\n",
            titleEmphasis = "đang ở đâu\n",
            titleEnd = "theo realtime.",
            desc = "Không còn nhắn \"mày đang ở đâu?\" 50 lần. Map live, check-in, lịch trình — mọi người cùng nhìn thấy.",
            bgGradient = listOf(Color(0xFF0C0C14), Color(0xFF0a1e3d), LtColors.Blue),
            blobColor = LtColors.Blue,
            blobTopEnd = false,
        ),
        OnboardSlide(
            emoji = "💸",
            tag = "✦ HẾT CHUYỆN TIỀN BẠC",
            titleNormal = "Chia tiền\n",
            titleEmphasis = "minh bạch",
            titleEnd = ",\nkhông tranh cãi.",
            desc = "Ghi chi phí, chia tự động, quyết toán cuối chuyến. Bạn bè vẫn là bạn bè sau mỗi chuyến đi.",
            bgGradient = listOf(Color(0xFF0C0C14), Color(0xFF0a2d1a), LtColors.Green),
            blobColor = LtColors.Cyan,
            blobTopEnd = false,
        ),
    )

    var currentSlide by remember { mutableStateOf(0) }
    var dragStartX by remember { mutableStateOf(0f) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectHorizontalDragGestures(
                    onDragStart = { dragStartX = it.x },
                    onDragEnd = {},
                    onHorizontalDrag = { _, dragAmount ->
                        // handled in onDragEnd via accumulated
                    }
                )
            }
    ) {
        // Current slide
        val slide = slides[currentSlide]

        // Slide background
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Brush.linearGradient(slide.bgGradient))
                .pointerInput(currentSlide) {
                    detectHorizontalDragGestures(
                        onDragStart = { dragStartX = it.x },
                        onDragEnd = {},
                        onHorizontalDrag = { change, dragAmount ->
                            // detect swipe direction
                        }
                    )
                    // Simple swipe detection
                    awaitPointerEventScope {
                        while (true) {
                            val event = awaitPointerEvent()
                            val x = event.changes.firstOrNull()?.position?.x ?: continue
                            if (event.changes.firstOrNull()?.pressed == false) {
                                val diff = dragStartX - x
                                if (abs(diff) > 50) {
                                    if (diff > 0 && currentSlide < slides.size - 1) currentSlide++
                                    else if (diff < 0 && currentSlide > 0) currentSlide--
                                }
                                dragStartX = 0f
                            } else if (event.changes.firstOrNull()?.pressed == true) {
                                dragStartX = x
                            }
                        }
                    }
                }
        ) {
            // Grid overlay
            Box(modifier = Modifier.fillMaxSize().background(
                Brush.verticalGradient(
                    listOf(Color.White.copy(alpha = 0.02f), Color.Transparent, Color.Transparent)
                )
            ))

            // Blob
            Box(
                modifier = Modifier
                    .size(280.dp)
                    .offset(
                        x = if (slide.blobTopEnd) 40.dp else (-40).dp,
                        y = (-40).dp
                    )
                    .align(if (slide.blobTopEnd) Alignment.TopEnd else Alignment.TopStart)
                    .clip(CircleShape)
                    .background(slide.blobColor.copy(alpha = 0.3f))
                    .blur(60.dp)
            )

            // Content
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .statusBarsPadding()
                    .padding(horizontal = 28.dp)
            ) {
                // Status bar space
                Spacer(Modifier.height(20.dp))

                // Emoji
                Text(
                    slide.emoji,
                    fontSize = 72.sp,
                    modifier = Modifier.padding(top = 40.dp)
                )

                Spacer(Modifier.height(28.dp))

                // Tag
                Text(
                    slide.tag,
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        color = Color.White.copy(alpha = 0.5f),
                        letterSpacing = 1.5.sp,
                        fontSize = 9.sp
                    )
                )

                Spacer(Modifier.height(12.dp))

                // Title with emphasis
                Text(
                    buildAnnotatedString {
                        withStyle(SpanStyle(fontWeight = FontWeight.Black, color = Color.White, fontSize = 28.sp, letterSpacing = (-0.5).sp)) {
                            append(slide.titleNormal)
                        }
                        withStyle(SpanStyle(fontWeight = FontWeight.Black, color = Color.White.copy(alpha = 0.65f), fontSize = 28.sp)) {
                            append(slide.titleEmphasis)
                        }
                        withStyle(SpanStyle(fontWeight = FontWeight.Black, color = Color.White, fontSize = 28.sp)) {
                            append(slide.titleEnd)
                        }
                    },
                    lineHeight = 36.sp,
                )

                Spacer(Modifier.height(16.dp))

                // Description
                Text(
                    slide.desc,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = Color.White.copy(alpha = 0.65f),
                        fontWeight = FontWeight.Medium,
                        lineHeight = 22.sp
                    )
                )

                Spacer(Modifier.weight(1f))

                // Dots
                Row(
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth().padding(bottom = 28.dp)
                ) {
                    repeat(slides.size) { i ->
                        val isActive = i == currentSlide
                        val width by animateDpAsState(
                            targetValue = if (isActive) 24.dp else 8.dp,
                            animationSpec = tween(300), label = "dot"
                        )
                        Box(
                            modifier = Modifier
                                .padding(horizontal = 4.dp)
                                .height(8.dp)
                                .width(width)
                                .clip(RoundedCornerShape(4.dp))
                                .background(if (isActive) Color.White else Color.White.copy(alpha = 0.25f))
                                .clickable { currentSlide = i }
                        )
                    }
                }

                // Button
                val isLastSlide = currentSlide == slides.size - 1
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(
                            if (isLastSlide)
                                Brush.horizontalGradient(listOf(LtColors.Pink, LtColors.Orange))
                            else
                                Brush.horizontalGradient(listOf(Color.White, Color.White))
                        )
                        .clickable {
                            if (isLastSlide) onGetStarted()
                            else currentSlide++
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        if (isLastSlide) "✦ Bắt đầu ngay!" else "Tiếp theo →",
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = if (isLastSlide) Color.White else LtColors.Dark,
                            letterSpacing = 0.3.sp
                        )
                    )
                }

                Spacer(Modifier.height(14.dp))

                // Skip
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 40.dp)
                        .navigationBarsPadding()
                        .clickable { onSkip() },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        if (isLastSlide) "Đã có tài khoản? Đăng nhập" else "Bỏ qua",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = Color.White.copy(alpha = 0.4f),
                            fontWeight = FontWeight.SemiBold
                        )
                    )
                }
            }
        }
    }
}
