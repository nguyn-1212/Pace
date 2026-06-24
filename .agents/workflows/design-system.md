---
description: Thiết kế hệ thống từ requirements.md — database schema, API, UI mockup
---

# Workflow: Thiết kế hệ thống (/design-system)

> ⚡ Workflow này đã được tách thành 2 workflow chuyên biệt hơn. Nên dùng các workflow sau thay thế:
> - `/design-ui` — Thiết kế giao diện HTML/CSS mockup
> - `/design-backend` — Thiết kế Database, API, kiến trúc

## Trigger
- Người dùng nói: "thiết kế hệ thống", "design system", hoặc `/design-system`

## Khi nào dùng workflow này?
- Khi muốn làm cả UI lẫn Backend trong một lần (dự án nhỏ, module đơn giản)
- Khi không cần tách biệt hai giai đoạn

## Điều kiện tiên quyết
File `.agents/docs/requirements.md` phải tồn tại và đã được approve.

## Bước 1: Kiểm tra requirements.md
Nếu chưa có → yêu cầu chạy workflow `/analyze-requirements` trước.

## Bước 2: Thiết kế UI (đọc skill ui-designer)
Đọc và làm theo hướng dẫn:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\ui-designer\SKILL.md
```
**⏸ Checkpoint: approve danh sách màn hình → tạo mockup HTML → approve ui-spec.md**

## Bước 3: Thiết kế Backend (đọc skill backend-designer)
Đọc và làm theo hướng dẫn:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\backend-designer\SKILL.md
```
Dùng `ui-spec.md` vừa tạo làm nguồn tham chiếu chính cho entities và fields.

## Bước 4: Tạo design-spec.md
Tạo file `.agents/docs/design-spec.md` theo format trong skill backend-designer.

## Bước 5: Báo cáo & chờ approve
Dùng `notify_user` để báo người dùng review cả `ui-spec.md` lẫn `design-spec.md`.
**Chờ approve trước khi kết thúc.**
