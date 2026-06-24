# Pace — Project Context

> Đọc file này trước khi bắt đầu bất kỳ task nào liên quan đến Pace.

## Mô tả dự án

**Pace** là app productivity cá nhân (Android + iOS) giúp người dùng quản lý:
- 💰 **Finance** — Thu/chi, tiết kiệm, nợ
- 🎯 **Goals** — Mục tiêu cá nhân + log tiến độ
- ✅ **Habits** — Xây dựng/bỏ thói quen + streak
- 📖 **Journey** — Nhật ký cảm xúc (mood journal)
- 🔔 **Reminders** — Nhắc nhở theo lịch

---

## Cấu trúc dự án

```
Pace/
├── api/Pace.Api/              ← ASP.NET Core .NET 10 API
│   ├── Controllers/           ← AuthController, DashboardController, + 10 entity controllers
│   ├── Data/Entities/         ← 10 Pace entities
│   ├── Data/PaceContext.cs    ← IdentityDbContext (MySQL)
│   ├── Workers/               ← BackgroundInitialWorker, FinalizeTimedHostedService
│   └── appsettings.json       ← Production (pace DB on 103.159.51.215)
│   └── appsettings.Development.json ← Local dev (localhost/pace)
├── App/                       ← Flutter app (TODO)
├── ui/                        ← Angular admin panel (framework)
├── documents/
│   ├── database-design.md     ← Schema design cho 10 Pace entities
│   └── app-architecture.md   ← Flutter stack, routes, API endpoints
└── .agents/CONTEXT.md         ← (file này)
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | ASP.NET Core .NET 10, EF Core, URF.Core.EF.Trackable |
| Database | MySQL 8.x |
| Mobile | Flutter 3.x (TODO — chưa bắt đầu) |
| Auth | JWT Bearer, ASP.NET Identity |
| Realtime | SignalR |

---

## Database entities (Pace)

| Entity | Bảng | Feature |
|--------|------|---------|
| TransactionCategory | transaction_category | Finance |
| Transaction | transaction | Finance |
| SavingGoal | saving_goal | Finance |
| Debt | debt | Finance |
| Goal | goal | Goals |
| GoalLog | goal_log | Goals |
| Habit | habit | Habits |
| HabitLog | habit_log | Habits |
| Journal | journal | Journey |
| Reminder | reminder | Reminders |

---

## API Endpoints — tóm tắt

| Route | Mô tả |
|-------|-------|
| POST `/api/auth/login` | Đăng nhập → JWT |
| POST `/api/auth/register` | Đăng ký |
| GET `/api/auth/me` | User info |
| GET `/api/dashboard` | Home screen summary |
| GET `/api/transactions/summary?year=&month=` | Finance stats tháng |
| GET `/api/habits/today` | Habits hôm nay + completion |
| CRUD `/api/transactions` | Giao dịch |
| CRUD `/api/goals` | Mục tiêu |
| CRUD `/api/habits` | Thói quen |
| CRUD `/api/journals` | Nhật ký |
| CRUD `/api/reminders` | Nhắc nhở |

---

## Git

- **Branch làm việc:** `claude/hopeful-hopper-rqjr0s`
- **Repo:** `nguyn-1212/pace`
- **Branch chính:** `main`

---

## Trạng thái hiện tại

- ✅ Framework + PaceContext hoàn chỉnh
- ✅ 10 entities + migrations sẵn sàng
- ✅ All controllers (Auth + Dashboard + 10 entity CRUD)
- ✅ Design docs cập nhật
- ⏳ EF Migration chưa chạy (cần dotnet local)
- ⏳ Flutter app chưa bắt đầu
- ⏳ Seed data TransactionCategory mặc định chưa có

*Cập nhật: 2026-06-24*
