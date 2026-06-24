---
description: Lên kế hoạch phát triển chi tiết từ requirements và design — tạo task-plan.md
---

# Workflow: Lập kế hoạch (/plan)

## Trigger
- Người dùng nói: "lên kế hoạch", "lập kế hoạch", "plan project", hoặc `/plan`

## Điều kiện tiên quyết
- `.agents/docs/requirements.md` đã được approve
- `.agents/docs/design-spec.md` đã được approve

## Bước 1: Kiểm tra input
Nếu thiếu file nào → yêu cầu chạy workflow tương ứng trước (`/analyze` hoặc `/design`).

## Bước 2: Đọc skill
Đọc và làm theo hướng dẫn trong skill:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\project-planner\SKILL.md
```

## Bước 3: Tạo task-plan.md
Tạo file `.agents/docs/task-plan.md` theo format trong skill.
- Sắp xếp modules theo thứ tự phụ thuộc
- Đánh giá độ phức tạp (S/M/L)
- Tạo checklist chi tiết cho từng module

## Bước 4: Báo cáo & chờ approve
Dùng `notify_user` để báo người dùng review `task-plan.md`.
**Chờ approve. File này sẽ được dùng làm task.md cho Developer Agent.**
