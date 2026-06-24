package com.lazy.travel.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.lazy.travel.core.theme.LtColors

// ── Bottom Navigation ─────────────────────────────────────────────────────
data class LtNavItem(
    val route: String,
    val label: String,
    val emoji: String,
    val badgeCount: Int = 0,
)

@Composable
fun LtBottomNav(
    items: List<LtNavItem>,
    currentRoute: String,
    onItemClick: (LtNavItem) -> Unit,
    modifier: Modifier = Modifier,
) {
    NavigationBar(
        modifier = modifier,
        containerColor = Color.White,
        tonalElevation = 0.dp
    ) {
        // Divider on top
        items.forEach { item ->
            val isSelected = item.route == currentRoute
            NavigationBarItem(
                selected = isSelected,
                onClick = { onItemClick(item) },
                icon = {
                    Box {
                        Text(item.emoji, style = MaterialTheme.typography.headlineSmall)
                        if (item.badgeCount > 0) {
                            Box(
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .size(16.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(LtColors.Pink),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    item.badgeCount.toString(),
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = Color.White,
                                        fontWeight = FontWeight.Black
                                    )
                                )
                            }
                        }
                    }
                },
                label = {
                    Text(
                        item.label,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Normal,
                            color = if (isSelected) LtColors.Pink else LtColors.Gray2
                        )
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = LtColors.Pink,
                    indicatorColor = LtColors.PinkLight,
                )
            )
        }
    }
}

// ── Top App Bar ───────────────────────────────────────────────────────────
@Composable
fun LtTopBar(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String = "",
    navigationIcon: (@Composable () -> Unit)? = null,
    actions: (@Composable () -> Unit)? = null,
    backgroundColor: Color = LtColors.Background,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(backgroundColor)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        navigationIcon?.invoke()
        if (navigationIcon != null) Spacer(Modifier.width(12.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                title,
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold),
                color = LtColors.Dark
            )
            if (subtitle.isNotEmpty()) {
                Text(
                    subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = LtColors.Gray
                )
            }
        }

        actions?.invoke()
    }
}

// ── Screen Scaffold ───────────────────────────────────────────────────────
@Composable
fun LtScreen(
    modifier: Modifier = Modifier,
    backgroundColor: Color = LtColors.Background,
    content: @Composable () -> Unit,
) {
    val snackbarHostState = remember { SnackbarHostState() }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = backgroundColor,
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            content()
        }
    }
}

// ── Auth Screen Layout ────────────────────────────────────────────────────
@Composable
fun LtAuthScreen(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(LtColors.Background)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        content()
    }
}

// ── Progress Bar ──────────────────────────────────────────────────────────
@Composable
fun LtProgressBar(
    progress: Float,  // 0f - 1f
    modifier: Modifier = Modifier,
    color: Color = LtColors.Pink,
    backgroundColor: Color = LtColors.Border,
    height: Int = 4,
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height.dp)
            .clip(RoundedCornerShape(height.dp))
            .background(backgroundColor)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(progress)
                .height(height.dp)
                .clip(RoundedCornerShape(height.dp))
                .background(color)
        )
    }
}

// ── Step Indicator ────────────────────────────────────────────────────────
@Composable
fun LtStepIndicator(
    currentStep: Int,  // 1-based
    totalSteps: Int,
    modifier: Modifier = Modifier,
    activeColor: Color = LtColors.Pink,
    inactiveColor: Color = LtColors.Border,
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        repeat(totalSteps) { i ->
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(4.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(if (i < currentStep) activeColor else inactiveColor)
            )
            if (i < totalSteps - 1) Spacer(Modifier.width(4.dp))
        }
    }
}
