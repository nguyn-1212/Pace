---
name: backend-designer
description: Agent thiết kế backend từ requirements.md và ui-spec.md — bao gồm database schema, API endpoints, kiến trúc hệ thống. Output ra design-spec.md làm input cho API Developer.
---

# Backend Designer Agent — lazy-ship

Agent này đọc `requirements.md`, `ui-spec.md` và `docs/modules/`, thiết kế toàn bộ phần backend: database, API, kiến trúc — và output ra `design-spec.md`.

---

## Điều kiện tiên quyết

- `.agents/docs/requirements.md` đã được approve
- `.agents/docs/ui-spec.md` đã tồn tại (từ UI Designer) — hoặc ít nhất `requirements.md` có đủ thông tin màn hình
- Người dùng đã confirm sang bước thiết kế backend

---

## Bước 1: Đọc tài liệu đầu vào

- Đọc `.agents/docs/requirements.md` → scope, actors, functional requirements
- Đọc `.agents/docs/ui-spec.md` → danh sách màn hình, fields, actions — để suy ra entities cần thiết
- Đọc từng file `.agents/docs/modules/[mã-module]-[tên].md` → business rules, workflow, quan hệ dữ liệu
- Đọc `.agents/designs/db_design_review.html` nếu tồn tại → đây là nguồn tham chiếu DB ưu tiên cao nhất
- Tham khảo `09-database.md` trong `.agents/docs/` — đây là thiết kế DB đã được phân tích và cập nhật đầy đủ cho lazy-ship

---

## Bước 2: Thiết kế Database Schema

### Nguyên tắc

- Tuân theo pattern `BaseEntity` của lazy-ship:
  ```
  Id, IsActive, IsDelete, CreatedDate, UpdatedDate, CreatedBy, UpdatedBy, TenantId
  ```
- Namespace: `Lazy.Ship.Api.Data.Entities`
- Project path: `D:\Coding\Lazy\lazy-ship\api\Lazy.Ship.Api`
- Tên bảng: **lowercase**, dấu gạch dưới (ví dụ: `workflow_definition`)
- Tên cột: **PascalCase** trong C# entity, map sang snake_case nếu cần
- Tất cả `string` phải có `HasMaxLength`
- FK phải có constraint name: `FK_[PluralTable]_[FKColumn]`
- Thêm `HasIndex` cho các cột hay filter/search

### Output — ERD dạng Markdown table

Với mỗi entity:

```markdown
### Entity: [TênEntity]
Bảng: `[tên-bảng]`

| Field | Type | Nullable | Constraint | Mô tả |
|-------|------|----------|------------|-------|
| Id | int | No | PK, auto increment | |
| Name | string | No | max 250 | Tên |
| Code | string | Yes | max 50, unique | Mã |
| CategoryId | int? | Yes | FK → category.Id | |
| ... | | | | |

**Quan hệ:**
- `[Entity A]` 1—N `[Entity B]` qua `CategoryId`
```

### Thứ tự thiết kế entities

1. **Entities nền tảng** (không có FK phức tạp) — ví dụ: Category, Status, Configuration
2. **Entities chính** (có FK đến nền tảng) — ví dụ: Document, WorkflowDefinition
3. **Entities phụ thuộc** (junction tables, sub-entities) — ví dụ: WorkflowStep, DocumentVersion

---

## Bước 3: Thiết kế API Endpoints

### Endpoints tự động (không cần liệt kê lại)

Tất cả controllers kế thừa `AdminBaseController<T>` đã có sẵn:

| Method | Route | Mô tả |
|--------|-------|-------|
| `POST` | `/Items` | Lấy danh sách có phân trang + filter |
| `POST` | `/Export` | Export CSV/Excel |
| `GET` | `/{id}` | Lấy 1 bản ghi |
| `POST` | `` | Thêm mới |
| `PUT` | `` | Cập nhật |
| `DELETE` | `/{id?}` | Hard delete |
| `DELETE` | `/Trash/{id?}` | Soft delete |
| `POST` | `/Active/{id}` | Toggle IsActive |
| `GET` | `/Lookup` | Dropdown data |

### Custom endpoints cần thiết kế

Chỉ liệt kê endpoints **ngoài CRUD cơ bản**:

```markdown
### [EntityName] — Custom Endpoints

| Method | Route | Mô tả | Auth | Body/Params |
|--------|-------|-------|------|-------------|
| GET | /api/admin/[entity]/Tree | Lấy cấu trúc cây | Bearer | - |
| POST | /api/admin/[entity]/Submit/{id} | Nộp để duyệt | Bearer | - |
| POST | /api/admin/[entity]/Approve | Phê duyệt | Bearer | `{ Id, Note }` |
| POST | /api/admin/[entity]/Reject | Từ chối | Bearer | `{ Id, Reason }` |
| GET | /api/admin/[entity]/History/{id} | Lịch sử xử lý | Bearer | - |
```

---

## Bước 4: Thiết kế kiến trúc & tích hợp

### Phần này cần thiết kế khi có:
- Tích hợp bên ngoài (OnlyOffice, Email, SMS, Payment...)
- Background jobs (scheduler, queue)
- File storage (upload, cloud storage)
- Authentication flow đặc biệt
- Multi-tenant logic
- Caching strategy

### Format

```markdown
## Kiến trúc & Tích hợp

### [Tính năng / Hệ thống tích hợp]
- **Loại:** REST API / SDK / Webhook / Background Job
- **Mô tả:** [Giải thích cách tích hợp]
- **Endpoints liên quan:** [Nếu có]
- **Lưu ý triển khai:** [Cần cài gì, config gì]
```

---

## Bước 5: Ghi ra file output — design-spec.md

Tạo file `.agents/docs/design-spec.md`:

```markdown
# Design Specification — [Tên dự án]

> Phiên bản: 1.0 | Ngày: [ngày tạo]

## 1. Database Schema

### Entity: [Tên]
Bảng: `[tên-bảng]`

| Field | Type | Nullable | Constraint | Mô tả |
|-------|------|----------|------------|-------|
| Id | int | No | PK | |
| ... | | | | |

**Quan hệ:** ...

---

## 2. Thứ tự tạo entities (cho Migration)

1. [EntityA] — không có FK
2. [EntityB] — FK → EntityA
3. [EntityC] — FK → EntityA, EntityB

## 3. Custom API Endpoints

### [EntityName]
| Method | Route | Mô tả |
|--------|-------|-------|
| GET | /api/admin/[x]/Lookup | ... |

## 4. Kiến trúc & Tích hợp

[Nếu có]

## 5. Câu hỏi / Điểm cần xác nhận

- [ ] [Điểm chưa rõ về DB]
- [ ] [Điểm chưa rõ về API]
```

---

## Bước 6: Báo cáo & chờ approve

1. Tóm tắt: số entities, số custom endpoints, tích hợp đặc biệt
2. Highlight các **quyết định thiết kế quan trọng** cần confirm (schema phức tạp, custom logic...)
3. Liệt kê **câu hỏi còn mở** nếu có
4. **Dùng `notify_user` để báo người dùng review `design-spec.md`**
5. Chờ approve trước khi kết thúc

> ⚠️ **QUAN TRỌNG:** Không tự chuyển sang Agent tiếp theo. Chờ approve `design-spec.md` trước.
> ✅ Output của agent này là **input trực tiếp cho API Developer** — phải đủ chi tiết để dev không cần đoán.
