package com.lazy.travel.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.lazy.travel.core.theme.LtColors

// ── Surface Card ──────────────────────────────────────────────────────────
@Composable
fun LtCard(
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color.White,
    cornerRadius: Dp = 12.dp,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(cornerRadius))
            .background(backgroundColor)
            .border(1.5.dp, LtColors.Border, RoundedCornerShape(cornerRadius))
    ) {
        content()
    }
}

// ── Gradient Card ─────────────────────────────────────────────────────────
@Composable
fun LtGradientCard(
    modifier: Modifier = Modifier,
    gradientColors: List<Color> = LtColors.GradPinkOrange,
    cornerRadius: Dp = 14.dp,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(cornerRadius))
            .background(Brush.linearGradient(gradientColors))
    ) {
        content()
    }
}

// ── Status Badge ──────────────────────────────────────────────────────────
@Composable
fun LtBadge(
    text: String,
    modifier: Modifier = Modifier,
    backgroundColor: Color = LtColors.PinkLight,
    textColor: Color = LtColors.Pink,
    cornerRadius: Dp = 6.dp,
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(cornerRadius))
            .background(backgroundColor)
            .border(1.dp, textColor.copy(alpha = 0.2f), RoundedCornerShape(cornerRadius))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.ExtraBold,
                color = textColor
            )
        )
    }
}

// ── Live Badge ────────────────────────────────────────────────────────────
@Composable
fun LtLiveBadge(modifier: Modifier = Modifier) {
    Row(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(Color(0x33FF2D78))
            .border(1.dp, LtColors.Pink.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(LtColors.Pink)
        )
        Text(
            "LIVE",
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.ExtraBold,
                color = LtColors.Pink
            )
        )
    }
}

// ── Avatar ────────────────────────────────────────────────────────────────
@Composable
fun LtAvatar(
    initials: String,
    modifier: Modifier = Modifier,
    size: Dp = 36.dp,
    backgroundColor: Color = LtColors.Pink,
    cornerRadius: Dp = 10.dp,
) {
    Box(
        modifier = modifier
            .size(size)
            .clip(RoundedCornerShape(cornerRadius))
            .background(backgroundColor),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = initials.take(2).uppercase(),
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.ExtraBold,
                color = Color.White,
                fontSize = (size.value * 0.3f).let { androidx.compose.ui.unit.TextUnit(it, androidx.compose.ui.unit.TextUnitType.Sp) }
            )
        )
    }
}

@Composable
fun LtAvatarStack(
    members: List<Pair<String, Color>>,
    modifier: Modifier = Modifier,
    maxVisible: Int = 4,
    avatarSize: Dp = 28.dp,
) {
    val visible = members.take(maxVisible)
    val extra = members.size - maxVisible

    Row(modifier = modifier, horizontalArrangement = Arrangement.spacedBy((-6).dp)) {
        visible.forEach { (initials, color) ->
            LtAvatar(
                initials = initials,
                size = avatarSize,
                backgroundColor = color,
                cornerRadius = (avatarSize.value * 0.28f).dp,
                modifier = Modifier.border(2.dp, Color.White, RoundedCornerShape((avatarSize.value * 0.28f).dp))
            )
        }
        if (extra > 0) {
            LtAvatar(
                initials = "+$extra",
                size = avatarSize,
                backgroundColor = LtColors.Gray2,
                cornerRadius = (avatarSize.value * 0.28f).dp,
                modifier = Modifier.border(2.dp, Color.White, RoundedCornerShape((avatarSize.value * 0.28f).dp))
            )
        }
    }
}
// ── Section Header ────────────────────────────────────────────────────────
@Composable
fun LtSectionHeader(
    title: String,
    modifier: Modifier = Modifier,
    action: String? = null,
    onActionClick: (() -> Unit)? = null,
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = FontWeight.ExtraBold,
                color = LtColors.Gray,
                letterSpacing = androidx.compose.ui.unit.TextUnit(0.1f, androidx.compose.ui.unit.TextUnitType.Em)
            )
        )
        if (action != null && onActionClick != null) {
            LtTextButton(text = action, onClick = onActionClick)
        }
    }
}

// ── Divider ───────────────────────────────────────────────────────────────
@Composable
fun LtDivider(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(LtColors.Border)
    )
}

// ── Loading Indicator ─────────────────────────────────────────────────────
@Composable
fun LtLoadingBox(
    modifier: Modifier = Modifier,
    text: String = "Đang tải..."
) {
    Column(
        modifier = modifier.fillMaxWidth().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        androidx.compose.material3.CircularProgressIndicator(
            color = LtColors.Pink,
            strokeWidth = 3.dp,
            modifier = Modifier.size(36.dp)
        )
        Spacer(Modifier.height(12.dp))
        Text(text, style = MaterialTheme.typography.bodySmall, color = LtColors.Gray)
    }
}

// ── Empty State ───────────────────────────────────────────────────────────
@Composable
fun LtEmptyState(
    emoji: String,
    title: String,
    subtitle: String = "",
    modifier: Modifier = Modifier,
    action: (@Composable () -> Unit)? = null,
) {
    Column(
        modifier = modifier.fillMaxWidth().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(emoji, style = MaterialTheme.typography.displayMedium)
        Spacer(Modifier.height(16.dp))
        Text(title, style = MaterialTheme.typography.titleMedium, color = LtColors.Dark)
        if (subtitle.isNotEmpty()) {
            Spacer(Modifier.height(8.dp))
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = LtColors.Gray)
        }
        if (action != null) {
            Spacer(Modifier.height(24.dp))
            action()
        }
    }
}


