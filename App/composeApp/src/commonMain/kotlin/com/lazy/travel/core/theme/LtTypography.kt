package com.lazy.travel.core.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.compose.material3.Typography

// expect — each platform provides actual @Composable font loader
@Composable
expect fun nunitoFontFamily(): FontFamily

@Composable
fun ltTypography(): Typography {
    val f = nunitoFontFamily()
    return Typography(
        displayLarge  = TextStyle(fontFamily = f, fontWeight = FontWeight.Black,     fontSize = 32.sp, lineHeight = 40.sp, letterSpacing = (-0.5).sp),
        displayMedium = TextStyle(fontFamily = f, fontWeight = FontWeight.ExtraBold, fontSize = 28.sp, lineHeight = 36.sp),
        displaySmall  = TextStyle(fontFamily = f, fontWeight = FontWeight.Bold,      fontSize = 24.sp, lineHeight = 32.sp),
        headlineLarge  = TextStyle(fontFamily = f, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp, lineHeight = 28.sp),
        headlineMedium = TextStyle(fontFamily = f, fontWeight = FontWeight.Bold,      fontSize = 20.sp, lineHeight = 26.sp),
        headlineSmall  = TextStyle(fontFamily = f, fontWeight = FontWeight.Bold,      fontSize = 18.sp, lineHeight = 24.sp),
        titleLarge  = TextStyle(fontFamily = f, fontWeight = FontWeight.Bold,      fontSize = 16.sp, lineHeight = 22.sp),
        titleMedium = TextStyle(fontFamily = f, fontWeight = FontWeight.SemiBold,  fontSize = 14.sp, lineHeight = 20.sp),
        titleSmall  = TextStyle(fontFamily = f, fontWeight = FontWeight.SemiBold,  fontSize = 12.sp, lineHeight = 18.sp),
        bodyLarge  = TextStyle(fontFamily = f, fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 24.sp),
        bodyMedium = TextStyle(fontFamily = f, fontWeight = FontWeight.Normal, fontSize = 14.sp, lineHeight = 20.sp),
        bodySmall  = TextStyle(fontFamily = f, fontWeight = FontWeight.Normal, fontSize = 12.sp, lineHeight = 18.sp),
        labelLarge  = TextStyle(fontFamily = f, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, lineHeight = 18.sp),
        labelMedium = TextStyle(fontFamily = f, fontWeight = FontWeight.SemiBold, fontSize = 11.sp, lineHeight = 16.sp),
        labelSmall  = TextStyle(fontFamily = f, fontWeight = FontWeight.Medium,   fontSize = 9.sp,  lineHeight = 14.sp),
    )
}
