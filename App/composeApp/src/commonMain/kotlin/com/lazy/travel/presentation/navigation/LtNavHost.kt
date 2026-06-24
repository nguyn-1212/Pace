package com.lazy.travel.presentation.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.lazy.travel.core.storage.TokenStorage
import com.lazy.travel.core.theme.LtColors
import com.lazy.travel.presentation.screens.home.HomeEmptyScreen
import com.lazy.travel.presentation.screens.auth.*

object Routes {
    const val ONBOARDING    = "onboarding"
    const val LOGIN         = "login"
    const val REGISTER      = "register"
    const val FORGOT        = "forgot"
    const val SETUP         = "setup"
    const val OTP           = "otp/{email}/{type}"
    fun otp(email: String, type: Int = 0) = "otp/$email/$type"

    const val HOME          = "home"
    const val MAP           = "map"
    const val CHAT          = "chat"
    const val EXPENSE       = "expense"
    const val TRIP_LIST     = "trip_list"
    const val TRIP_CREATE   = "trip_create"
    fun tripDetail(id: Int) = "trip/$id"
    const val EXPLORE       = "explore"
    const val PROFILE       = "profile"
    const val SETTINGS      = "settings"
    const val NOTIFICATIONS = "notifications"
}

@Composable
fun LtNavHost(tokenStorage: TokenStorage) {
    val navController = rememberNavController()
    var startDestination by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        startDestination = if (tokenStorage.isLoggedIn()) Routes.HOME else Routes.ONBOARDING
    }

    if (startDestination == null) return

    NavHost(navController = navController, startDestination = startDestination!!) {

        composable(Routes.ONBOARDING) {
            OnboardingScreen(
                onGetStarted = { navController.navigate(Routes.REGISTER) },
                onSkip       = { navController.navigate(Routes.LOGIN) }
            )
        }

        composable(Routes.LOGIN) {
            LoginScreen(
                onNavigateToRegister = { navController.navigate(Routes.REGISTER) },
                onNavigateToForgot   = { navController.navigate(Routes.FORGOT) },
                onLoginSuccess       = {
                    navController.navigate(Routes.HOME) { popUpTo(0) { inclusive = true } }
                }
            )
        }

        composable(Routes.REGISTER) {
            RegisterScreen(
                onNavigateToLogin = { navController.navigate(Routes.LOGIN) },
                onNavigateToOtp   = { email -> navController.navigate(Routes.otp(email, 0)) }
            )
        }

        composable(
            route     = Routes.OTP,
            arguments = listOf(
                navArgument("email") { type = NavType.StringType },
                navArgument("type")  { type = NavType.IntType }
            )
        ) { back ->
            val email = back.arguments?.getString("email") ?: ""
            val type  = back.arguments?.getInt("type") ?: 0
            OtpScreen(
                email      = email,
                type       = type,
                onVerified = {
                    if (type == 0) navController.navigate(Routes.SETUP) { popUpTo(Routes.REGISTER) { inclusive = true } }
                    else           navController.navigate(Routes.LOGIN)  { popUpTo(Routes.FORGOT)   { inclusive = true } }
                },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Routes.FORGOT) {
            ForgotScreen(
                onLoginSuccess = {
                    navController.navigate(Routes.LOGIN) { popUpTo(Routes.FORGOT) { inclusive = true } }
                },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Routes.SETUP) {
            SetupScreen(
                onSetupComplete = {
                    navController.navigate(Routes.HOME) { popUpTo(0) { inclusive = true } }
                }
            )
        }

        composable(Routes.HOME) {
            HomeEmptyScreen(
                userName = "Nguyen",
                onCreateTrip = {},
                onJoinTrip = {},
                onJoinByCode = {},
                onViewTemplate = {},
            )
        }
    }
}
