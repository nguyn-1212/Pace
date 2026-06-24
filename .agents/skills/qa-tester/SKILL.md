---
name: qa-tester
description: Agent kiểm thử từ requirements.md và task-plan.md — tạo test cases, dùng browser tool kiểm tra UI, và output ra test-report.md.
---

# QA Tester Agent — lazy.flow

Agent này kiểm thử hệ thống sau khi Developer Agent hoàn thành, đảm bảo code match với requirements.

---

## Điều kiện tiên quyết

- Developer Agent đã hoàn thành và báo cáo xong
- App đang chạy locally (Angular dev server + API)
- Người dùng đã confirm sang bước kiểm thử

---

## Bước 1: Đọc tài liệu

- Đọc `.agents/docs/requirements.md` → lấy danh sách FR cần test
- Đọc `.agents/docs/task-plan.md` → lấy danh sách màn hình đã implement

---

## Bước 2: Tạo Test Cases

Với mỗi màn hình/module, tạo test cases:

### Template test case:
```
TC-001: [Tên test case]
- Màn hình: [route]
- Mô tả: [Kiểm tra gì]
- Steps: [Các bước thực hiện]
- Expected: [Kết quả mong đợi]
- Priority: High / Medium / Low
```

### Loại test cần cover:
- **Smoke test:** Màn hình load được không, API phản hồi được không
- **CRUD test:** Thêm/Sửa/Xóa/Xem hoạt động đúng
- **Validation test:** Form validate đúng (required, maxlength, unique...)
- **UI test:** Grid hiển thị đúng columns, actions hoạt động
- **Navigation test:** Routing giữa các màn hình đúng

---

## Bước 3: Chạy Browser Tests

Dùng `browser_subagent` tool để kiểm tra từng màn hình:

1. Mở URL của app (localhost)
2. Navigate đến từng màn hình trong task-plan
3. Kiểm tra:
   - Màn hình load không lỗi
   - Grid hiển thị đúng columns
   - Button Add/Edit/Delete hoạt động
   - Form save được
4. Chụp screenshot kết quả

---

## Bước 4: Kiểm tra theo FR

Với mỗi Functional Requirement trong `requirements.md`:
- Tìm màn hình tương ứng
- Kiểm tra FR đó đã được implement chưa
- Đánh dấu: ✅ Pass / ❌ Fail / ⚠️ Partial

---

## Bước 5: Ghi kết quả ra test-report.md

Tạo file `.agents/docs/test-report.md`:

```markdown
# Test Report — [Tên dự án]

> Ngày test: [date] | Tester: AI Agent

## Tóm tắt

| Tổng TC | Pass | Fail | Partial |
|---------|------|------|---------|
| [N] | [N] | [N] | [N] |

## Kết quả theo FR

| Mã FR | Tính năng | Kết quả | Ghi chú |
|-------|-----------|---------|---------|
| FR-001 | ... | ✅ Pass | |
| FR-002 | ... | ❌ Fail | Lỗi tại... |

## Chi tiết Test Cases

### TC-001: [Tên]
- **Steps:** ...
- **Expected:** ...
- **Actual:** ...
- **Result:** ✅ / ❌
- **Screenshot:** ![](../designs/tc-001.png)

## Bugs Found

| # | Màn hình | Mô tả lỗi | Priority |
|---|---------|-----------|----------|
| 1 | /admin/x | Lỗi khi... | High |
```

---

## Bước 6: Báo cáo kết quả

1. Tóm tắt: tổng test cases, pass/fail ratio
2. Liệt kê bugs theo priority
3. **Dùng `notify_user` để gửi report cho người dùng**
4. Với mỗi bug **Priority High:** đề xuất cụ thể cần fix gì

> ⚠️ **QUAN TRỌNG:** Nếu có bug Priority High, đừng kết thúc — đợi người dùng quyết định có fix ngay không.
