package com.lazy.travel.core.i18n

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

/**
 * Lazy Travel i18n — JSON-based string loading
 *
 * File structure: vi.json / en.json
 * Keys: "Screen.key" → e.g. "Auth.login_title", "General.save"
 * Server message codes are also stored under their screen: "Auth.AUTH_LOGIN_FAILED"
 * Flat codes (from server) are resolved by scanning all sections.
 */
object LtStrings {

    fun setLocale(lang: String) {
        // Locale is applied when load() is called with the language code
        // This method exists for compatibility; call load() to actually change language
    }

    private val json = Json { ignoreUnknownKeys = true }
    private var strings: JsonObject? = null
    private var fallback: JsonObject? = null  // always vi

    // ── Load ─────────────────────────────────────────────────────────────
    suspend fun load(lang: String, loader: suspend (fileName: String) -> String) {
        val content = loader("$lang.json")
        strings = json.parseToJsonElement(content).jsonObject

        if (lang != "vi") {
            val viContent = loader("vi.json")
            fallback = json.parseToJsonElement(viContent).jsonObject
        } else {
            fallback = strings
        }
    }

    // ── Get by "Screen.key" ───────────────────────────────────────────────
    fun get(screenKey: String, vararg args: Any): String {
        val parts = screenKey.split(".", limit = 2)
        val value = if (parts.size == 2) {
            resolve(parts[0], parts[1]) ?: resolveFlat(parts[1]) ?: screenKey
        } else {
            resolveFlat(screenKey) ?: screenKey
        }
        return interpolate(value, args)
    }

    // ── Resolve server message code (flat scan) ───────────────────────────
    fun resolve(code: String): String {
        return resolveFlat(code) ?: code
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    private fun resolve(section: String, key: String): String? {
        return strings?.get(section)?.jsonObject?.get(key)?.jsonPrimitive?.content
            ?: fallback?.get(section)?.jsonObject?.get(key)?.jsonPrimitive?.content
    }

    private fun resolveFlat(key: String): String? {
        // Scan all sections for the key
        strings?.forEach { (_, sectionValue) ->
            sectionValue.jsonObject[key]?.jsonPrimitive?.content?.let { return it }
        }
        fallback?.forEach { (_, sectionValue) ->
            sectionValue.jsonObject[key]?.jsonPrimitive?.content?.let { return it }
        }
        return null
    }

    private fun interpolate(template: String, args: Array<out Any>): String {
        if (args.isEmpty()) return template
        return args.foldIndexed(template) { i, acc, arg ->
            acc.replace("{$i}", arg.toString())
        }
    }
}

// ── Convenience extensions ────────────────────────────────────────────────
fun str(key: String, vararg args: Any) = LtStrings.get(key, *args)
fun serverMsg(code: String, vararg args: Any) = LtStrings.resolve(code).let {
    LtStrings.interpolate(it, args)
}

// Make interpolate accessible
fun LtStrings.interpolate(template: String, args: Array<out Any>): String {
    if (args.isEmpty()) return template
    return args.foldIndexed(template) { i, acc, arg -> acc.replace("{$i}", arg.toString()) }
}

