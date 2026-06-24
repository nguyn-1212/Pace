package com.lazy.travel

import android.app.Application
import com.lazy.travel.core.di.initKoin
import com.lazy.travel.core.storage.initDataStore
import org.koin.android.ext.koin.androidContext

class LazyTravelApp : Application() {
    override fun onCreate() {
        super.onCreate()
        initDataStore(this)
        initKoin {
            androidContext(this@LazyTravelApp)
        }
    }
}
