# 📱 Lazy Travel — App Architecture Document
**Version:** 1.0  
**Platform:** Kotlin Multiplatform (Android + iOS)  
**Updated:** 2026-04-28

---

## Stack

| Layer | Technology |
|-------|-----------|
| UI | Compose Multiplatform |
| Font | Nunito (single font, 7 weights) |
| Navigation | Jetpack Navigation Compose |
| DI | Koin 4.x |
| Networking | Ktor 3.x |
| Realtime | SignalR (WebSocket via Ktor) |
| Offline DB | SQLDelight 2.x |
| Storage | DataStore Preferences |
| Images | Coil 3.x + Cloudflare R2 |
| Push | Firebase FCM |
| Maps | Mapbox |
| minSdk | 26 (Android 8.0) |

---

## Project Structure

```
composeApp/src/commonMain/kotlin/com/lazy/travel/
├── core/
│   ├── network/        ApiResult, HttpClientFactory, interceptors
│   ├── storage/        TokenStorage, DataStoreFactory
│   ├── di/             CoreModule, KoinInit
│   ├── theme/          LtColors, LtTypography, LtTheme, LtShapes
│   ├── utils/          AppConstants, Extensions
│   └── i18n/           LtStrings (client-side message mapping)
│
├── data/
│   ├── models/         Data classes (Trip, User, Expense...)
│   ├── remote/api/     API services
│   ├── remote/dto/     Request/Response DTOs
│   ├── local/          SQLDelight DAOs
│   └── repository/     Repository implementations
│
├── domain/
│   ├── repository/     Repository interfaces
│   └── usecase/        Business logic per feature
│
└── presentation/
    ├── navigation/     LtNavHost, Routes
    ├── components/     Shared UI components (Button, Card, TextField...)
    └── screens/        Feature screens (auth, home, trip, expense...)
```

---

## Design Tokens

```kotlin
// Colors
Pink    = #FF2D78  // Primary
Orange  = #FF6B35  // Secondary
Yellow  = #FFD600
Blue    = #2B5BFF
Cyan    = #00CFC0
Green   = #00C48C
Purple  = #7C3AED
Dark    = #0C0C14
BG      = #F4F2ED

// Shapes
extraSmall = 6dp, small = 8dp, medium = 12dp, large = 16dp, extraLarge = 24dp
```

---

## i18n Pattern

Server returns: `ResultApi { Type, Object, Description: "MESSAGE_CODE" }`

App resolves: `LtStrings.get("MESSAGE_CODE")` → locale string

```kotlin
// Example
val msg = LtStrings.get("TRIP_JOIN_SUCCESS")
// VI: "Bạn đã tham gia chuyến đi!"
// EN: "You joined the trip!"

// With args
val msg = LtStrings.get("CHECKIN_SUCCESS", "Cầu Vàng")
// VI: "Check-in thành công tại Cầu Vàng!"
```

---

## Auth Flow

```
App launch
  → check DataStore token
  → token exists? → Home
  → no token?     → Onboarding → Login/Register → Setup → Home
```

---

## Offline Strategy

- SQLDelight caches: trips, members, activities, expenses, photos
- Ktor requests fail gracefully → load from local DB
- Write operations queued → sync when online

---

## Navigation Routes

```
onboarding → login / register
login      → home (success) | forgot
register   → setup (new user)
setup      → home
home       → trip_detail/{id} | trip_create | explore | notifications
```
