package com.lazy.travel.core.di

import com.lazy.travel.core.network.createHttpClient
import com.lazy.travel.core.storage.TokenStorage
import com.lazy.travel.core.storage.createDataStore
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module

val coreModule = module {
    single { createDataStore() }
    single { TokenStorage(get()) }
    single { createHttpClient(get()) }
}
