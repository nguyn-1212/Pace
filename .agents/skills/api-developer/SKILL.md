---
name: api-developer
description: Agent phát triển API từ task-plan.md và design-spec.md — implement Entity, LazyContext, Program.cs, Controller theo pattern api-add-module của lazy.flow.
---

# API Developer Agent — lazy-ship

Agent này chỉ tập trung vào **backend**: Entity → LazyContext → Program.cs → Controller.

---

## Điều kiện tiên quyết

- `.agents/docs/task-plan.md` đã được approve
- `.agents/docs/design-spec.md` đã được approve

---

## Bước 1: Đọc tài liệu

- Đọc `task-plan.md` → danh sách modules và thứ tự ưu tiên
- Đọc `design-spec.md` → Database Schema và Custom API Endpoints của từng module
- **Đọc file chi tiết module** trong `.agents/docs/modules/` — khi implement module nào, đọc file tương ứng để hiểu nghiệp vụ, business rules, entities
- **Đọc `.agents/designs/db_design_review.html`** — đây là file thiết kế database chi tiết, là nguồn tham chiếu chính cho entity fields, kiểu dữ liệu, quan hệ, và constraint. Ưu tiên file này nếu có conflict với `design-spec.md`

---

## Bước 2: Đọc skill api-add-module

**BẮT BUỘC đọc trước khi code:**
```
D:\Coding\Lazy\lazy-ship\.agents\skills\api-add-module\SKILL.md
```

---

## Bước 3: Implement từng module (API only)

Với mỗi module theo thứ tự trong task-plan:

### 3.1 — Tạo Entity
File: `Data/Entities/[Feature].cs`
- Kế thừa `BaseEntity`
- Thêm fields theo `design-spec.md` (đúng kiểu dữ liệu, nullable, FK)

### 3.2 — Cập nhật LazyContext
File: `Data/LazyContext.cs`
- Thêm `DbSet<[Feature]>` property
- Thêm config trong `OnModelCreating`: `ToTable`, `HasKey`, `HasIndex`, `HasMaxLength`, FK, `CreatedByUser`, `UpdatedByUser`

### 3.3 — Cập nhật Program.cs
- Thêm `AddScoped<IRepositoryX<[Feature]>, RepositoryX<[Feature]>>()`
- Nhóm đúng với comment section (ví dụ: `// CRM`, `// HR`, ...)

### 3.4 — Tạo Controller
File: `Controllers/Admin/[Feature]Controller.cs`
- Trường hợp CRUD thuần: kế thừa `AdminBaseController<T>` (5 dòng)
- Trường hợp có custom endpoint: bổ sung action theo design-spec

---

## Bước 4: Review checkpoint

- **Module đơn giản (S):** Implement 2-3 module liên tiếp rồi báo review 1 lần
- **Module trung bình/phức tạp (M/L):** Báo review ngay sau mỗi module
- Dùng `notify_user` với danh sách file đã tạo/chỉnh sửa
- **Chờ approve trước khi tiếp tục**

---

## Bước 5: Cập nhật task-plan.md

Sau khi implement xong mỗi module, đánh dấu `[x]` cho phần **API tasks** trong `.agents/docs/task-plan.md`.

---

## Bước 6: Kết thúc API Development

Sau khi tất cả API modules done:
1. Tóm tắt toàn bộ entities, controllers đã tạo
2. Liệt kê các file đã chỉnh sửa
3. **Dùng `notify_user` để báo chuyển giao sang UI Developer**

> ⚠️ Không tự ý tạo file UI. Chỉ làm API.
