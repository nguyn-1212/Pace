---
description: Phát triển API (backend) từ task-plan.md — implement Entity, LazyContext, Program.cs, Controller theo pattern lazy.flow
---

// turbo-all

# Workflow: Phát triển API (/develop-api)

## Trigger
- Người dùng nói: "code api", "develop api", "phát triển api", hoặc `/develop-api`

## Điều kiện tiên quyết
- `.agents/docs/task-plan.md` đã được approve

## Bước 1: Đọc skill
Đọc và làm theo hướng dẫn trong skill:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\api-developer\SKILL.md
```

## Bước 2: Implement API theo thứ tự modules
- Đọc `design-spec.md` → lấy Database Schema, Custom API Endpoints
- Đọc `docs/modules/[mã].md` → lấy nghiệp vụ chi tiết từng module
- Implement từng module: Entity → LazyContext → Program.cs → Controller

## Bước 3: Review checkpoint
- Module S: implement 2-3 rồi review
- Module M/L: review ngay sau mỗi module
- Dùng `notify_user`, chờ approve

## Bước 4: Cập nhật task-plan.md
Đánh dấu `[x]` cho từng API task đã hoàn thành.

## Bước 5: Kết thúc
Dùng `notify_user` báo hoàn thành API, chờ người dùng cho phép chuyển sang UI.
