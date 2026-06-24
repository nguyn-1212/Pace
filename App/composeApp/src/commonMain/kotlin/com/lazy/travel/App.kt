package com.lazy.travel

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import com.lazy.travel.core.storage.TokenStorage
import com.lazy.travel.core.theme.LazyTravelTheme
import com.lazy.travel.presentation.navigation.LtNavHost
import org.koin.compose.KoinContext
import org.koin.compose.koinInject

@Composable
fun App() {
    val tokenStorage: TokenStorage = koinInject()

    LaunchedEffect(Unit) {
        // language loaded on app start
    }

    KoinContext {
        LazyTravelTheme {
            LtNavHost(tokenStorage = tokenStorage)
        }
    }
}

