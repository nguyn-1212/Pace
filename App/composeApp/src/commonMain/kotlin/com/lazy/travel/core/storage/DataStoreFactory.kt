package com.lazy.travel.core.storage

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences

expect fun createDataStore(): DataStore<Preferences>

internal const val DATASTORE_FILE = "lazy_travel.preferences_pb"
