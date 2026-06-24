---
name: project-planner
description: Agent lập kế hoạch phát triển từ requirements.md và design-spec.md — chia nhỏ thành modules, tasks, subtasks và tạo task-plan.md có thể dùng luôn làm task.md.
---

# Project Planner Agent — lazy.flow

Agent này đọc `requirements.md` và `design-spec.md`, lên kế hoạch phát triển chi tiết theo từng module.

---

## Điều kiện tiên quyết

- `.agents/docs/requirements.md` đã được approve
- `.agents/docs/design-spec.md` đã được approve
- Người dùng đã confirm sang bước lập kế hoạch

---

## Bước 1: Đọc tài liệu

Đọc cả 2 file:
- `requirements.md` → hiểu scope, actors, tính năng
- `design-spec.md` → hiểu database schema, màn hình, API

---

## Bước 2: Xác định thứ tự ưu tiên

Chia hệ thống thành các **module chính**, sắp xếp theo thứ tự phát triển hợp lý:
1. Module nền tảng (entities không có FK phức tạp) → làm trước
2. Module phụ thuộc (entities có FK) → làm sau
3. Module UI → sau khi có API

Ví dụ thứ tự:
```
Category → Product → Order → OrderItem
```

---

## Bước 3: Chia nhỏ từng module thành tasks

Với mỗi module, tạo checklist theo template:

```markdown
### Module: [Tên]

**API:**
- [ ] Tạo Entity: `[Feature].cs`
- [ ] Đăng ký LazyContext (DbSet + OnModelCreating)
- [ ] Đăng ký Repository trong Program.cs
- [ ] Tạo Controller: `[Feature]Controller.cs`
- [ ] [Custom endpoint nếu có]: `GET /api/admin/[feature]/[action]`

**UI:**
- [ ] Tạo Entity FE: `[feature].entity.ts`
- [ ] Tạo Grid Component: `[feature].component.ts`
- [ ] Tạo Edit Component: `edit.[feature].component.ts`
- [ ] Tạo Module + Routes: `[feature].module.ts`
- [ ] Đăng ký route lazy load trong `admin.routing.module.ts`

**Tích hợp:**
- [ ] Test API thủ công
- [ ] Test UI end-to-end
```

---

## Bước 4: Ước lượng độ phức tạp

Với mỗi module, đánh giá:
- **Đơn giản (S):** CRUD thuần, không có business logic phức tạp
- **Trung bình (M):** Có custom API, form phức tạp, quan hệ nhiều entity
- **Phức tạp (L):** Workflow nghiệp vụ, tích hợp bên ngoài, báo cáo

---

## Bước 5: Ghi ra file output

Tạo file `.agents/docs/task-plan.md`:

```markdown
# Task Plan — [Tên dự án]

> Phiên bản: 1.0 | Tổng modules: [N]

## Thứ tự phát triển

1. [Module A] (S) — không có phụ thuộc
2. [Module B] (M) — phụ thuộc [Module A]
3. ...

---

## Chi tiết tasks

### Module 1: [Tên] (S/M/L)

**API:**
- [ ] Tạo Entity: `Data/Entities/[Feature].cs`
- [ ] Cập nhật `LazyContext.cs`
- [ ] Cập nhật `Program.cs`
- [ ] Tạo `Controllers/Admin/[Feature]Controller.cs`

**UI:**
- [ ] Tạo `domains/entities/[feature].entity.ts`
- [ ] Tạo `modules/[feature]/[feature].component.ts`
- [ ] Tạo `modules/[feature]/edit/edit.[feature].component.ts`
- [ ] Tạo `modules/[feature]/[feature].module.ts`
- [ ] Cập nhật `admin.routing.module.ts`

**Verify:**
- [ ] API test: CRUD cơ bản hoạt động
- [ ] UI test: Grid hiển thị đúng, Form save/edit được

---

### Module 2: [Tên]
...
```

---

## Bước 6: Báo cáo & chờ approve

1. Tóm tắt: số modules, tổng tasks ước lượng
2. Highlight các module phức tạp hoặc có rủi ro
3. **Dùng `notify_user` để báo người dùng review `task-plan.md`**
4. Chờ approve trước khi agent Developer bắt đầu

> ⚠️ **QUAN TRỌNG:** Chờ người dùng approve `task-plan.md` trước khi kết thúc.
