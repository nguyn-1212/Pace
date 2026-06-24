---
description: Chạy toàn bộ pipeline phát triển phần mềm — từ phân tích đến kiểm thử, có review ở mỗi bước
---

# Workflow: Full Pipeline (/pipeline)

## Trigger
- Người dùng nói: "chạy toàn bộ quy trình", "full pipeline", hoặc `/pipeline`

## Tổng quan

```
📄 Tài liệu
    ↓
[1]  🔍 Requirements Analysis  →  requirements.md + modules/   → REVIEW ⏸
     ↓ (sau approve)
[2a] 🖼  UI Design             →  ui-spec.md + mockup HTML     → REVIEW ⏸
     ↓ (sau approve)
[2b] 🗄  Backend Design        →  design-spec.md               → REVIEW ⏸
     ↓ (sau approve)
[3]  📋 Project Planning       →  task-plan.md                 → REVIEW ⏸
     ↓ (sau approve)
[4a] 💻 API Development        →  Entity/Controller/...        → REVIEW mỗi module M/L ⏸
     ↓ (sau approve)
[4b] 🎨 UI Development         →  Components/Modules/...       → REVIEW mỗi màn hình M/L ⏸
     ↓ (sau approve)
[5]  🧪 QA Testing             →  test-report.md               → REVIEW ⏸
```

---

## Bước 1: Requirements Analysis
Chạy workflow:
```
.agents/workflows/analyze-requirements.md
```
**⏸ Dừng, dùng `notify_user`, chờ approve `requirements.md`**

---

## Bước 2a: UI Design (Mockup HTML/CSS)
```
.agents/workflows/design-ui.md   (skill: ui-designer)
```
**⏸ Checkpoint: approve danh sách màn hình → tạo mockup HTML → approve `ui-spec.md`**

---

## Bước 2b: Backend Design (DB, API, Kiến trúc)
```
.agents/workflows/design-backend.md   (skill: backend-designer)
```
Dùng `ui-spec.md` vừa được approve làm input chính.
**⏸ Dừng, dùng `notify_user`, chờ approve `design-spec.md`**

---

## Bước 3: Project Planning
```
.agents/workflows/plan-project.md
```
**⏸ Dừng, dùng `notify_user`, chờ approve `task-plan.md`**

---

## Bước 4a: API Development
```
.agents/workflows/develop-feature.md   (skill: api-developer)
```
**⏸ Review mỗi module M/L**
**⏸ Dừng khi tất cả API tasks `[x]`, chờ approve sang UI**

---

## Bước 4b: UI Development
```
.agents/workflows/develop-ui.md   (skill: ui-developer)
```
**⏸ Review mỗi màn hình M/L**
**⏸ Dừng khi tất cả UI tasks `[x]`, chờ approve sang QA**

---

## Bước 5: QA Testing
```
.agents/workflows/run-qa.md
```
**⏸ Dừng, dùng `notify_user`, gửi `test-report.md`**

---

## Quy tắc bất biến

> ⚠️ **KHÔNG BAO GIỜ** chuyển sang bước tiếp theo khi chưa có approve từ người dùng.
> Mỗi bước kết thúc bằng `notify_user` — không tự động chạy tiếp.
> API Developer chỉ làm backend. UI Developer chỉ làm Angular.
