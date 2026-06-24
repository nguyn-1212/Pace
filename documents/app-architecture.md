# Pace — App Architecture Document
**Version:** 1.0  
**Platform:** Flutter (Android + iOS)  
**Updated:** 2026-06-24

---

## Stack

| Layer | Technology |
|-------|-----------|
| Mobile UI | Flutter 3.x (Dart) |
| State Management | Riverpod hoặc BLoC |
| Networking | Dio + Retrofit |
| Realtime | SignalR (signalr_flutter) |
| Local Storage | Hive hoặc SharedPreferences |
| Images | cached_network_image |
| Push | Firebase FCM (firebase_messaging) |
| Font | Google Fonts — Inter |
| Auth | JWT Bearer token |
| Backend | ASP.NET Core .NET 10, MySQL 8.x |
| minSdk | Android 21 (Android 5.0) |
| iOS target | iOS 13+ |

---

## Project Structure (Flutter — `/App`)

```
lib/
├── core/
│   ├── network/         dio_client.dart, api_result.dart, interceptors
│   ├── storage/         token_storage.dart (SharedPreferences)
│   ├── theme/           app_colors.dart, app_typography.dart, app_theme.dart
│   ├── utils/           extensions, constants, validators
│   └── di/              providers.dart (Riverpod)
│
├── data/
│   ├── models/          Transaction, Goal, Habit, Journal, Reminder, User...
│   ├── remote/          api services (auth_api, finance_api, habit_api...)
│   └── repository/      repository implementations
│
├── domain/
│   ├── repository/      abstract interfaces
│   └── usecase/         business logic per feature
│
└── presentation/
    ├── navigation/      go_router setup, route definitions
    ├── components/      shared widgets (PaceButton, PaceCard, MoodPicker...)
    └── screens/
        ├── auth/        login, register, setup_profile
        ├── home/        dashboard, bottom_nav
        ├── finance/     transactions, categories, saving_goals, debts
        ├── goals/       goals_list, goal_detail, goal_log
        ├── habits/      habits_list, habit_detail, habit_checkin
        ├── journey/     journal_list, journal_editor, journal_detail
        ├── reminders/   reminders_list, reminder_form
        └── profile/     user_profile, settings
```

---

## Design Tokens

```dart
// Colors
const paceBlue    = Color(0xFF2B5BFF);  // Primary
const pacePurple  = Color(0xFF7C3AED);  // Secondary
const paceGreen   = Color(0xFF00C48C);  // Success
const pacePink    = Color(0xFFFF2D78);  // Accent
const paceOrange  = Color(0xFFFF6B35);  // Warning
const paceRed     = Color(0xFFDC2626);  // Danger
const paceDark    = Color(0xFF0C0C14);  // Text
const paceBG      = Color(0xFFF4F2ED);  // Background

// Shapes
borderRadius: 8, 12, 16, 24 dp
```

---

## Auth Flow

```
App launch
  → check token (SharedPreferences)
  → token valid?   → Home (Dashboard)
  → no token?      → Login
       Login        → Home
       Register     → SetupProfile → Home
```

---

## API Base URL

| Environment | URL |
|-------------|-----|
| Dev (local) | `http://localhost:5000/api` |
| Production  | `https://api-pace.lazy.vn/api` |

### Headers mặc định
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## API Endpoints

### Auth
| Method | Route | Mô tả |
|--------|-------|-------|
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/register` | Đăng ký |
| GET | `/auth/me` | Thông tin user |
| PUT | `/auth/me` | Cập nhật profile |
| POST | `/auth/change-password` | Đổi mật khẩu |

### Dashboard
| Method | Route | Mô tả |
|--------|-------|-------|
| GET | `/dashboard` | Home screen summary |

### Finance
| Method | Route | Mô tả |
|--------|-------|-------|
| GET | `/transactioncategories` | Danh sách danh mục |
| GET/POST/PUT/DELETE | `/transactioncategories/{id}` | CRUD |
| GET | `/transactions?page=&size=` | Lịch sử giao dịch |
| GET | `/transactions/summary?year=&month=` | Thống kê tháng |
| GET/POST/PUT/DELETE | `/transactions/{id}` | CRUD |
| GET/POST/PUT/DELETE | `/savinggoals/{id}` | Mục tiêu tiết kiệm CRUD |
| GET/POST/PUT/DELETE | `/debts/{id}` | Nợ CRUD |

### Goals
| Method | Route | Mô tả |
|--------|-------|-------|
| GET/POST/PUT/DELETE | `/goals/{id}` | CRUD |
| GET | `/goallogs?goalId=` | Lịch sử goal |
| GET/POST/PUT/DELETE | `/goallogs/{id}` | CRUD |

### Habits
| Method | Route | Mô tả |
|--------|-------|-------|
| GET | `/habits/today` | Habits hôm nay + trạng thái |
| GET/POST/PUT/DELETE | `/habits/{id}` | CRUD |
| GET | `/habitlogs?habitId=` | Lịch sử check-in |
| GET/POST/PUT/DELETE | `/habitlogs/{id}` | CRUD |

### Journey
| Method | Route | Mô tả |
|--------|-------|-------|
| GET | `/journals?page=&size=` | Danh sách nhật ký |
| GET/POST/PUT/DELETE | `/journals/{id}` | CRUD |

### Reminders
| Method | Route | Mô tả |
|--------|-------|-------|
| GET/POST/PUT/DELETE | `/reminders/{id}` | CRUD |

---

## Offline Strategy

- Token và user info lưu trong SharedPreferences
- Cache cơ bản với Hive cho: habits today, recent transactions, active goals
- Write operations: gửi trực tiếp, không queue (version 1)

---

## Navigation Routes (go_router)

```
/login          → LoginScreen
/register       → RegisterScreen
/setup          → SetupProfileScreen
/home           → HomeScreen (bottom nav: Dashboard, Finance, Habits, Journey, Goals)
/finance        → FinanceScreen
/transactions   → TransactionListScreen
/goals          → GoalListScreen
/goals/:id      → GoalDetailScreen
/habits         → HabitListScreen
/habits/:id     → HabitDetailScreen
/journey        → JournalListScreen
/journal/new    → JournalEditorScreen
/journal/:id    → JournalDetailScreen
/profile        → ProfileScreen
```

---

## Bottom Navigation (5 tabs)

| Tab | Icon | Screen |
|-----|------|--------|
| Home | house | Dashboard |
| Finance | wallet | Transactions + SavingGoals + Debts |
| Habits | check-circle | Habits list + today view |
| Journey | book-open | Journal list |
| Goals | target | Goals list |
