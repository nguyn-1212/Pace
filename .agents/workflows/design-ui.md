---
description: Thiết kế giao diện người dùng từ requirements.md — tạo HTML/CSS mockup cho từng màn hình
---

# Workflow: Thiết kế giao diện (/design-ui)

## Trigger
- Người dùng nói: "thiết kế giao diện", "design UI", "tạo mockup", hoặc `/design-ui`

## Điều kiện tiên quyết
File `.agents/docs/requirements.md` phải tồn tại và đã được approve.

## Bước 1: Kiểm tra requirements.md
Nếu chưa có → yêu cầu chạy workflow `/analyze-requirements` trước.

## Bước 2: Đọc skill
Đọc và làm theo hướng dẫn trong skill:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\ui-designer\SKILL.md
```

## Bước 3: Checkpoint — Approve danh sách màn hình
Sau khi lập danh sách màn hình, dùng `notify_user` để người dùng **approve trước khi tạo mockup**.

## Bước 4: Tạo HTML/CSS mockup
- Kiểm tra `.agents/designs/mockup_qt01.html` — nếu có → kế thừa design system đó
- Tạo file `mockup_[mã-module].html` cho từng module
- Không dùng `generate_image` — tạo file HTML trực tiếp

## Bước 5: Tạo ui-spec.md
Tạo file `.agents/docs/ui-spec.md` mô tả chi tiết từng màn hình (fields, actions, ghi chú UX).

## Bước 6: Báo cáo & chờ approve
Dùng `notify_user` để báo người dùng review toàn bộ mockup và `ui-spec.md`.
**Chờ approve trước khi kết thúc.**
