package com.lazy.travel.core.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

val LtShapes = Shapes(
    extraSmall = RoundedCornerShape(6.dp),
    small      = RoundedCornerShape(8.dp),
    medium     = RoundedCornerShape(12.dp),
    large      = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(24.dp)
)

private val LtLightColorScheme = lightColorScheme(
    primary              = LtColors.Pink,
    onPrimary            = LtColors.White,
    primaryContainer     = LtColors.PinkLight,
    onPrimaryContainer   = LtColors.Pink,
    secondary            = LtColors.Orange,
    onSecondary          = LtColors.White,
    secondaryContainer   = LtColors.OrangeLight,
    tertiary             = LtColors.Blue,
    onTertiary           = LtColors.White,
    tertiaryContainer    = LtColors.BlueLight,
    background           = LtColors.Background,
    onBackground         = LtColors.Dark,
    surface              = LtColors.White,
    onSurface            = LtColors.Dark,
    surfaceVariant       = LtColors.Background,
    onSurfaceVariant     = LtColors.Gray,
    outline              = LtColors.Border,
    error                = LtColors.Error,
    onError              = LtColors.White,
)

@Composable
fun LazyTravelTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LtLightColorScheme,
        typography  = ltTypography(),
        shapes      = LtShapes,
        content     = content
    )
}
