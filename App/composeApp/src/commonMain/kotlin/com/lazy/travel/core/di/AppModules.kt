package com.lazy.travel.core.di

import com.lazy.travel.data.remote.api.AuthApi
import com.lazy.travel.data.repository.AuthRepository
import com.lazy.travel.presentation.screens.auth.ForgotViewModel
import com.lazy.travel.presentation.screens.auth.LoginViewModel
import com.lazy.travel.presentation.screens.auth.OtpViewModel
import com.lazy.travel.presentation.screens.auth.RegisterViewModel
import com.lazy.travel.presentation.screens.auth.SetupViewModel
import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module

val dataModule = module {
    // APIs
    single { AuthApi(get()) }
    // Repositories
    single { AuthRepository(get(), get()) }
}

val presentationModule = module {
    viewModelOf(::LoginViewModel)
    viewModelOf(::RegisterViewModel)
    viewModelOf(::OtpViewModel)
    viewModelOf(::ForgotViewModel)
    viewModelOf(::SetupViewModel)
}
