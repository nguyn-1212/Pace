# lazy.flow — Project Context

> Đọc file này trước khi bắt đầu bất kỳ task nào liên quan đến lazy.flow.

## 📁 Cấu trúc dự án

```
d:\Coding\LazyFLow\lazy.flow\
├── api\Lazy.Flow.Api\          ← ASP.NET Core API
│   ├── Controllers\Admin\      ← Controllers (WorkflowTaskController.cs, ...)
│   ├── Data\Entities\          ← EF Core entities
│   ├── Data\LazyContext.cs     ← DbContext
│   └── Migrations\             ← EF Migrations
└── ui\src\app\                 ← Angular 15+ app
    ├── modules\flow\flow1\     ← Module QT.01 (quy trình biên soạn tài liệu)
    │   ├── part1\diagram\      ← Pipeline diagram component
    │   ├── part1\steps\        ← Step components (step1a..step4)
    │   ├── part1\popups\       ← Popup components
    │   └── documents\bm01\     ← Form BM.01
    └── modules\flow\components\ ← Shared components (box.attachment, box.user...)
```

---

## 🔧 Tech Stack

- **API**: ASP.NET Core, EF Core, URF pattern, SignalR (RefreshDataService)
- **UI**: Angular 15+, SCSS, custom modal/dialog service, custom decorators
- **Pattern**: AdminBaseController, LazyContext, EditComponent

---

## 📦 Cấu trúc MetaJson (QT.01)

MetaJson được lưu trong `WorkflowTask.MetaJson` (string JSON). Cấu trúc **hiện tại**:

```json
{
  "bm01": {
    "loaiHinh": "Ban hành mới | Sửa đổi | Định kỳ | Đột xuất",
    "kinhGui": { "id": 1, "name": "Phòng QLCL" },
    "loaiTaiLieu": { "id": "Tài liệu hệ thống", "name": "..." },
    "lyDo": "...",
    "danhSachTaiLieu": [
      {
        "maTl": "QT.01",
        "phienBan": "01",
        "nguoiSoan":    { "id": 3, "name": "Nguyen Van A" },
        "nguoiXemXet":  { "id": 4, "name": "Tran Thi B" },
        "nguoiXemXetLQ":{ "id": 5, "name": "Le Van C" },
        "nguoiPheDuyet":{ "id": 6, "name": "Pham Thi D" },
        "tailieu": { "id": null, "name": "Tên tài liệu mới" }
      }
    ],
    "signatures": []
  }
}
```

> ⚠️ `tailieu.id = null` = tài liệu MỚI (biên soạn mới); `tailieu.id != null` = tài liệu SẴN CÓ.

**Đọc metaJson trong step components:**
```ts
const bm01 = this.metaJson?.bm01;
const loai = bm01?.loaiTaiLieu?.id;
const dsDocs = bm01?.danhSachTaiLieu || [];
```

---

## 🔄 QT.01 Workflow — Các bước

| Step | Selector | Component | Người làm |
|------|----------|-----------|-----------|
| B1 (main) | `flow1-step1a` | Step1aComponent | QLCL |
| B1.2 | `flow1-step1b` | Step1bComponent | Lãnh đạo Khoa |
| B1.3 | `flow1-step1c` | Step1cComponent | BGĐ |
| B1.4 | `flow1-step1d` | Step1dComponent | Người biên soạn |
| B2 (main) | `flow1-step2a` | Step2aComponent | Người xem xét |
| Return | `flow1-step1-returned` | Step1ReturnedComponent | Người nộp lại |

---

## 📋 AttachmentItem Pattern

Hàm `getAttachmentItems(data: MetaJsonData)` đã được tách ra trong `workflow.data.ts`.  
Tất cả step components chỉ cần gọi 1 dòng:

```ts
// Import
import { metaJsonData, parseMetaJsonData, getAttachmentItems } from '../../../../flow1/dtos/workflow.data';

// Trong class: thêm property
metaJsonData: MetaJsonData = {};

// Trong ngOnInit: parse
this.metaJson = JSON.parse(this.task.MetaJson);
this.metaJsonData = parseMetaJsonData(this.metaJson);

// getter (1 dòng)
get attachmentItems(): AttachmentItem[] {
    return getAttachmentItems(this.metaJsonData);
}
```

**Logic của `getAttachmentItems()`:**
1. BM.01 form data (`data.bm01`)
2. Tài liệu đã được API tạo ra (`data.documents[]`) — **KHÔNG** parse từ `danhSachTaiLieu`

---

## 🎨 Diagram Component — Badge & Tooltip

**Badge kép** `myPending | total` trên mỗi step node:
- Ẩn hoàn toàn nếu `total === 0`
- `myPending` = amber `#f59e0b`, `total` = dark `#374151`
- Hover → tooltip phải badge, mũi tên trái

**Tooltip popup:**
- Trái: 3 chỉ số (my=amber, others=blue, total=gray) + top 5 avatars
- Phải: Donut chart CSS `conic-gradient`
- API: `GET /workflowtask/StepTopPending?workflowCode=QT.01&stepOrder=1&isSubFlow=false&parentStepOrder=0`

**`getMetric(stepOrder)` tự cộng luôn sub-step counts** — không cần tính riêng.

---

## 🛠️ API Patterns

### Thêm endpoint mới
Thêm vào `WorkflowTaskController.cs` (partial class). Tham khảo skill `api-add-module`.

### StepCounts response shape
```json
[
  {
    "StepId": 1, "StepOrder": 1, "StepName": "Rà soát...",
    "IsSubFlow": true, "ParentStepId": 10, "ParentStepOrder": 1,
    "MyPendingCount": 2, "OthersPendingCount": 5, "TotalCount": 7
  }
]
```

### Entities quan trọng
- `WorkflowTask`: Id, InstanceId, StepId, AssignedUserId, Status(PENDING/COMPLETED), MetaJson (qua Instance)
- `WorkflowInstance`: Id, WorkflowId, MetaJson, Status
- `WorkflowStep`: Id, StepOrder, IsSubFlow, ParentStepId

---

## 📐 CSS Variables (diagram)

```scss
--qt-bl: #2563eb;  --qt-blb: #dbeafe;  --qt-bld: #93c5fd;   /* Blue */
--qt-am: #b45309;  --qt-amb: #fef3c7;  --qt-amd: #fcd34d;   /* Amber */
--qt-gn: #16a34a;  --qt-gnb: #dcfce7;  --qt-gnd: #86efac;   /* Green */
--qt-pu: #7c3aed;  --qt-pub: #ede9fe;  --qt-pud: #c4b5fd;   /* Purple */
--qt-rd: #dc2626;  --qt-rdb: #fee2e2;  --qt-rdd: #fca5a5;   /* Red */
--qt-t3: #6b7280;  --qt-bd2: #9ca3af;  --qt-sf: #ffffff;    /* Neutral */
```

---

## 🧩 Shared Components

| Component | Selector | Dùng cho |
|-----------|----------|---------|
| `BoxAttachmentComponent` | `box-attachment` | Hiển thị danh sách file đính kèm |
| `BoxUserComponent` | `box-user` | Hiển thị thông tin user |
| `PopupDocumentComponent` | — | Xem tài liệu OnlyOffice |
| `Bm01Component` | `app-bm01` | Preview form BM.01 |

---

*Cập nhật lần cuối: 2026-03-28*
