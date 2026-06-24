---
description: Kiểm thử từ requirements.md và task-plan.md — tạo test cases, chạy browser tests, output test-report.md
---

# Workflow: QA Testing (/qa)

## Trigger
- Người dùng nói: "kiểm thử", "test", "qa", hoặc `/qa`

## Điều kiện tiên quyết
- Developer Agent đã hoàn thành
- App đang chạy locally

## Bước 1: Đọc skill
Đọc và làm theo hướng dẫn trong skill:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\qa-tester\SKILL.md
```

## Bước 2: Tạo test cases
Đọc `requirements.md` và tạo test cases cho toàn bộ FR.

## Bước 3: Chạy browser tests
Dùng `browser_subagent` để kiểm tra từng màn hình:
- Navigate đến URL
- Thực hiện thao tác CRUD cơ bản
- Ghi lại kết quả + screenshot

## Bước 4: Tạo test-report.md
Tạo file `.agents/docs/test-report.md` với đầy đủ kết quả.

## Bước 5: Báo cáo & chờ phản hồi
Dùng `notify_user` để gửi report cho người dùng.
Với bug Priority High → đề xuất cụ thể cách fix.
