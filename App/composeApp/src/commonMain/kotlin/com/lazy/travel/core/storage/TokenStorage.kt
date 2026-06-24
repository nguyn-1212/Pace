package com.lazy.travel.core.storage

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import com.lazy.travel.core.utils.AppConstants
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map

class TokenStorage(private val dataStore: DataStore<Preferences>) {

    private val keyAccessToken  = stringPreferencesKey(AppConstants.KEY_ACCESS_TOKEN)
    private val keyRefreshToken = stringPreferencesKey(AppConstants.KEY_REFRESH_TOKEN)
    private val keyUserId       = stringPreferencesKey(AppConstants.KEY_USER_ID)
    private val keyLanguage     = stringPreferencesKey(AppConstants.KEY_LANGUAGE)

    suspend fun saveTokens(accessToken: String, refreshToken: String) {
        dataStore.edit { prefs ->
            prefs[keyAccessToken]  = accessToken
            prefs[keyRefreshToken] = refreshToken
        }
    }

    suspend fun getAccessToken(): String? =
        dataStore.data.map { it[keyAccessToken] }.firstOrNull()

    suspend fun getRefreshToken(): String? =
        dataStore.data.map { it[keyRefreshToken] }.firstOrNull()

    suspend fun saveUserId(id: Int) {
        dataStore.edit { it[keyUserId] = id.toString() }
    }

    suspend fun getUserId(): Int? =
        dataStore.data.map { it[keyUserId]?.toIntOrNull() }.firstOrNull()

    suspend fun saveLanguage(lang: String) {
        dataStore.edit { it[keyLanguage] = lang }
    }

    suspend fun getLanguage(): String =
        dataStore.data.map { it[keyLanguage] ?: AppConstants.DEFAULT_LANGUAGE }.firstOrNull()
            ?: AppConstants.DEFAULT_LANGUAGE

    suspend fun clear() {
        dataStore.edit { it.clear() }
    }

    suspend fun isLoggedIn(): Boolean = getAccessToken() != null
}
