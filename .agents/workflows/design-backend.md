---
description: Thiết kế backend từ requirements.md — database schema, API endpoints, kiến trúc hệ thống
---

# Workflow: Thiết kế Backend (/design-backend)

## Trigger
- Người dùng nói: "thiết kế backend", "thiết kế database", "design BE", "design API", hoặc `/design-backend`

## Điều kiện tiên quyết
- File `.agents/docs/requirements.md` phải tồn tại và đã được approve.
- File `.agents/docs/ui-spec.md` nên có (từ workflow `/design-ui`) để biết chính xác fields cần thiết.

## Bước 1: Kiểm tra tài liệu
- Nếu `requirements.md` chưa có → yêu cầu chạy `/analyze-requirements` trước.
- Nếu `ui-spec.md` chưa có → thông báo, nhưng vẫn có thể tiếp tục (dùng requirements.md làm nguồn chính).

## Bước 2: Đọc skill
Đọc và làm theo hướng dẫn trong skill:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\backend-designer\SKILL.md
```

## Bước 3: Thiết kế Database Schema
Thiết kế entities theo thứ tự (nền tảng → chính → phụ thuộc).
Dùng pattern `BaseEntity` của lazy.flow.

## Bước 4: Thiết kế Custom API Endpoints
Chỉ liệt kê endpoints nằm ngoài CRUD cơ bản của `AdminBaseController<T>`.

## Bước 5: Thiết kế kiến trúc & tích hợp
Nếu có tích hợp bên ngoài, background jobs, file storage... thì thiết kế ở bước này.

## Bước 6: Tạo design-spec.md
Tạo file `.agents/docs/design-spec.md` — input trực tiếp cho API Developer.

## Bước 7: Báo cáo & chờ approve
Dùng `notify_user` để báo người dùng review `design-spec.md`.
**Chờ approve trước khi kết thúc.**
