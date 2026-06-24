---
description: Phân tích tài liệu yêu cầu và tạo requirements.md chuẩn hóa
---

// turbo-all

# Workflow: Phân tích yêu cầu (/analyze)

## Trigger
- Người dùng nói: "phân tích tài liệu", "analyze requirements", hoặc `/analyze`

## Bước 1: Kiểm tra input
Kiểm tra thư mục `.agents/docs/md/` có file `.md` chưa.
- Nếu có → đọc tất cả các file
- Nếu không có → hỏi người dùng cung cấp tài liệu

## Bước 2: Đọc skill và thực hiện phân tích
Đọc và làm theo hướng dẫn trong skill:
```
d:\Coding\LazyFLow\lazy.flow\.agents\skills\requirements-analyst\SKILL.md
```
Thực hiện đầy đủ **Bước 1 → Bước 7** trong skill (phân tích + tạo file docs).

## Bước 3: Tự động sinh UI Mockup (không hỏi permission)
Ngay sau khi tạo xong docs, tiếp tục **Bước 8** trong skill:
- Đọc `flowchart_qt0x.html` tương ứng với từng module
- Tạo `mockup_[mã-module].html` trong `.agents/designs/`
- Follow style từ `mockup_qt01.html` làm reference

## Bước 4: Báo cáo & chờ approve (1 lần duy nhất)
Dùng `notify_user` để báo người dùng review **cùng lúc**:
- File `requirements.md` + tất cả file trong `docs/modules/`
- Tất cả file `mockup_*.html` trong `designs/`

**Chờ approve 1 lần, không tách thành 2 review riêng.**
