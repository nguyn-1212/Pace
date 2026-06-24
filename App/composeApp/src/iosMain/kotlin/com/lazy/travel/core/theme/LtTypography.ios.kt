package com.lazy.travel.core.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import lazytravel.composeapp.generated.resources.*
import org.jetbrains.compose.resources.Font

@Composable
actual fun nunitoFontFamily(): FontFamily = FontFamily(
    Font(Res.font.nunito_light,     FontWeight.Light),
    Font(Res.font.nunito_regular,   FontWeight.Normal),
    Font(Res.font.nunito_medium,    FontWeight.Medium),
    Font(Res.font.nunito_semibold,  FontWeight.SemiBold),
    Font(Res.font.nunito_bold,      FontWeight.Bold),
    Font(Res.font.nunito_extrabold, FontWeight.ExtraBold),
    Font(Res.font.nunito_black,     FontWeight.Black),
)
