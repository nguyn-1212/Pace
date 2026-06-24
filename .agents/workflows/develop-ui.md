---
description: Phát triển UI (Angular) từ task-plan.md — implement Entity FE, Grid, Edit, Module, Route theo pattern lazy.flow
---

// turbo-all

# Workflow: Phát triển UI (/develop-ui)

## Trigger
- Người dùng nói: "code ui", "develop ui", "phát triển ui", hoặc `/develop-ui`

## Điều kiện tiên quyết
- `.agents/docs/task-plan.md` đã được approve
- API Developer đã hoàn thành (hoặc API endpoint đã ready)

## Bước 1: Đọc skill
Đọc và làm theo hướng dẫn trong skill:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\ui-developer\SKILL.md
```

## Bước 2: Implement UI theo thứ tự modules
- Đọc `design-spec.md` → lấy danh sách màn hình, fields, actions
- Đọc `docs/modules/[mã].md` → lấy nghiệp vụ chi tiết từng module
- Đọc `.agents/designs/mockup_[mã].html` → UI mockup để follow style/layout
- Implement từng module: Entity FE → Grid → Edit → Module → Routes

## Bước 3: Review checkpoint
- Module S: implement 2-3 rồi review
- Module M/L hoặc màn hình UI phức tạp: review ngay sau mỗi màn hình
- Dùng `notify_user`, chờ approve

## Bước 4: Cập nhật task-plan.md
Đánh dấu `[x]` cho từng UI task đã hoàn thành.

## Bước 5: Kết thúc
Dùng `notify_user` báo hoàn thành UI, chờ người dùng cho phép chuyển sang QA.
