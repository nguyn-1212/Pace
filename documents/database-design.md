# Pace — Database Design Document
**Version:** 1.0  
**Database:** MySQL 8.x  
**ORM:** Entity Framework Core (.NET 10)  
**Framework:** URF.Core.EF.Trackable  
**Namespace:** `Pace.Api`  
**Updated:** 2026-06-24

---

## Tổng quan

| Nhóm | Bảng | Mô tả |
|------|------|--------|
| Framework (có sẵn) | ~24 | User, Role, Team, Permission, Notify, Audit, EmailTemplate... |
| **Finance** | 4 | TransactionCategory, Transaction, SavingGoal, Debt |
| **Goals** | 2 | Goal, GoalLog |
| **Habits** | 2 | Habit, HabitLog |
| **Journey** | 1 | Journal |
| **Reminders** | 1 | Reminder |
| **Tổng Pace mới** | **10** | |

---

## BaseEntity (framework — tất cả entity kế thừa)

```
Id INT PK AUTO_INCREMENT
IsActive BIT DEFAULT 1
IsDelete BIT DEFAULT 0
TenantId VARCHAR(100)
CreatedBy INT FK→User
UpdatedBy INT FK→User
CreatedDate DATETIME
UpdatedDate DATETIME
```

---

## NHÓM 1: Finance

### `transaction_category`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| UserId | int? | Yes | null = danh mục hệ thống |
| Name | varchar(100) | No | Tên danh mục |
| Icon | varchar(50) | Yes | Emoji icon |
| Color | varchar(20) | Yes | Hex color |
| Type | int | No | 0=expense, 1=income |
| IsDefault | bool | No | Có phải default không |

**Quan hệ:** `UserId` FK→User (null = system-wide)

---

### `transaction`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| UserId | int | No | FK→User |
| CategoryId | int? | Yes | FK→transaction_category |
| Amount | decimal(18,2) | No | Số tiền |
| Type | int | No | 0=expense, 1=income |
| Note | varchar(500) | Yes | Ghi chú |
| TransactionDate | datetime | No | Ngày giao dịch |
| Tags | varchar(200) | Yes | Tags phân cách bởi dấu phẩy |

**Index:** `UserId`, `CategoryId`, `TransactionDate`

---

### `saving_goal`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| UserId | int | No | FK→User |
| Name | varchar(200) | No | Tên mục tiêu |
| TargetAmount | decimal(18,2) | No | Số tiền cần đạt |
| CurrentAmount | decimal(18,2) | No | Số tiền hiện có |
| Icon | varchar(50) | Yes | Emoji |
| Color | varchar(20) | Yes | Hex color |
| Deadline | datetime? | Yes | Hạn chót |
| Status | int | No | 0=active, 1=completed, 2=cancelled |

---

### `debt`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| UserId | int | No | FK→User |
| PersonName | varchar(200) | No | Tên người liên quan |
| Amount | decimal(18,2) | No | Số tiền |
| Type | int | No | 0=tôi vay (I owe), 1=họ vay (they owe) |
| Note | varchar(500) | Yes | Ghi chú |
| DueDate | datetime? | Yes | Hạn trả |
| IsPaid | bool | No | Đã thanh toán |
| PaidDate | datetime? | Yes | Ngày thanh toán |

---

## NHÓM 2: Goals

### `goal`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| UserId | int | No | FK→User |
| Name | varchar(200) | No | Tên mục tiêu |
| Area | int | No | 0=Study, 1=Health, 2=Finance, 3=Personal |
| Description | varchar(1000) | Yes | Mô tả chi tiết |
| TargetDate | datetime? | Yes | Ngày mục tiêu |
| Status | int | No | 0=active, 1=completed, 2=abandoned |
| Progress | int | No | 0–100 (%) |

**Quan hệ:** 1 Goal → N GoalLog (cascade delete)

---

### `goal_log`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| GoalId | int | No | FK→goal (cascade) |
| UserId | int | No | FK→User |
| Note | varchar(500) | Yes | Ghi chú |
| Progress | int | No | Tiến độ tại thời điểm log (0–100) |
| LogDate | datetime | No | Ngày log |

**Index:** `GoalId`, `UserId`, `LogDate`

---

## NHÓM 3: Habits

### `habit`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| UserId | int | No | FK→User |
| Name | varchar(200) | No | Tên thói quen |
| Type | int | No | 0=build (tạo mới), 1=break (bỏ) |
| Icon | varchar(50) | Yes | Emoji |
| Color | varchar(20) | Yes | Hex color |
| Frequency | int | No | 0=daily, 1=weekly, 2=custom |
| TargetDaysPerWeek | int? | Yes | Số ngày/tuần nếu Frequency=2 |
| StartDate | datetime | No | Ngày bắt đầu |
| Status | int | No | 0=active, 1=completed, 2=abandoned |
| CurrentStreak | int | No | Streak hiện tại (ngày liên tiếp) |
| LongestStreak | int | No | Streak dài nhất |

**Quan hệ:** 1 Habit → N HabitLog (cascade delete)

---

### `habit_log`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| HabitId | int | No | FK→habit (cascade) |
| UserId | int | No | FK→User |
| LogDate | datetime | No | Ngày check-in |
| IsCompleted | bool | No | Đã hoàn thành chưa |
| Note | varchar(200) | Yes | Ghi chú ngắn |

**Index:** `HabitId`, `UserId`, `LogDate`

---

## NHÓM 4: Journey

### `journal`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| UserId | int | No | FK→User |
| Title | varchar(300) | No | Tiêu đề |
| Content | text | Yes | Nội dung (markdown) |
| Mood | int? | Yes | 0=Happy, 1=Sad, 2=Angry, 3=Anxious, 4=Excited, 5=Calm, 6=Tired |
| JournalDate | datetime | No | Ngày viết |
| Tags | varchar(500) | Yes | Tags phân cách bởi dấu phẩy |
| CoverEmoji | varchar(10) | Yes | Emoji đại diện |

**Index:** `UserId`, `JournalDate`

---

## NHÓM 5: Reminders

### `reminder`
| Field | Type | Nullable | Mô tả |
|-------|------|----------|-------|
| Id | int | No | PK |
| UserId | int | No | FK→User |
| Title | varchar(200) | No | Tiêu đề nhắc |
| Type | int | No | 0=goal, 1=habit, 2=general |
| ReferenceId | int? | Yes | GoalId hoặc HabitId |
| DaysOfWeek | varchar(20) | Yes | "1,2,3,4,5,6,7" — ngày trong tuần |
| ReminderTime | varchar(10) | Yes | "08:00" — giờ nhắc |
| IsEnabled | bool | No | Bật/tắt |

---

## EF Migrations

```bash
cd api/Pace.Api
dotnet ef migrations add InitPace --output-dir Data/Migrations
dotnet ef database update
```

---

## Seed data mặc định

Sau khi migrate, `BackgroundInitialWorker` tự tạo user `admin` nếu chưa có.

Cần seed thêm (thủ công hoặc thêm vào worker):
- `transaction_category` default: Ăn uống, Di chuyển, Mua sắm, Tiền lương, Thưởng, Đầu tư, Sức khỏe, Giải trí, Hoá đơn
