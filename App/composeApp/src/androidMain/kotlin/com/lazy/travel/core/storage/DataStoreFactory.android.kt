package com.lazy.travel.core.storage

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(
    name = DATASTORE_FILE,
    scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
)

private var _appContext: Context? = null

fun initDataStore(context: Context) {
    _appContext = context.applicationContext
}

actual fun createDataStore(): DataStore<Preferences> {
    return _appContext?.dataStore
        ?: error("Call initDataStore(context) before using DataStore")
}
