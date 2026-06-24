package com.lazy.travel.core.theme

import androidx.compose.ui.graphics.Color

// ── Lazy Travel Design Tokens ──────────────────────────────────────────
object LtColors {
    // Brand
    val Pink        = Color(0xFFFF2D78)
    val Orange      = Color(0xFFFF6B35)
    val Yellow      = Color(0xFFFFD600)
    val Blue        = Color(0xFF2B5BFF)
    val Cyan        = Color(0xFF00CFC0)
    val Green       = Color(0xFF00C48C)
    val Purple      = Color(0xFF7C3AED)

    // Neutrals
    val Dark        = Color(0xFF0C0C14)
    val Background  = Color(0xFFF4F2ED)
    val White       = Color(0xFFFFFFFF)
    val Gray        = Color(0xFF6B7280)
    val Gray2       = Color(0xFF9CA3AF)
    val Border      = Color(0xFFE5E2DA)

    // Light tints
    val PinkLight   = Color(0xFFFFE0EC)
    val OrangeLight = Color(0xFFFFF0EA)
    val YellowLight = Color(0xFFFFF9D6)
    val BlueLight   = Color(0xFFEEF2FF)
    val CyanLight   = Color(0xFFE0FAF8)
    val GreenLight  = Color(0xFFE0FAF0)
    val PurpleLight = Color(0xFFF3EEFF)

    // Status
    val Success     = Color(0xFF00C48C)
    val Warning     = Color(0xFFFFD600)
    val Error       = Color(0xFFFF2D78)
    val Info        = Color(0xFF2B5BFF)

    // Gradients (start/end pairs)
    val GradPinkOrange   = listOf(Pink, Orange)
    val GradBlueCyan     = listOf(Blue, Cyan)
    val GradGreenCyan    = listOf(Green, Cyan)
    val GradPurplePink   = listOf(Purple, Pink)
    val GradDarkBlue     = listOf(Dark, Blue)
}
