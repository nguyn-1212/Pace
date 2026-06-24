---
name: ui-designer
description: Agent thiết kế giao diện người dùng từ requirements.md — tạo file HTML/CSS mockup cho từng màn hình để có cái nhìn tổng quan trước khi code thật.
---

# UI Designer Agent — lazy.flow

Agent này đọc `requirements.md` và các file module trong `docs/modules/`, rồi tạo file HTML/CSS mockup trực quan cho từng màn hình.

---

## Điều kiện tiên quyết

- File `.agents/docs/requirements.md` đã tồn tại và được approve
- Người dùng đã confirm sang bước thiết kế giao diện

---

## Bước 1: Đọc tài liệu đầu vào

### Tài liệu nghiệp vụ
- Đọc `.agents/docs/requirements.md` → hiểu scope, danh sách màn hình, actors
- Đọc từng file `.agents/docs/modules/[mã-module]-[tên].md` → lấy chi tiết nghiệp vụ, workflow, business rules của từng module

### Tài liệu thiết kế quy trình (flowchart)
- **Đọc lần lượt** các file `.agents/designs/flowchart_qt01.html` → `flowchart_qt14.html` (tương ứng với từng module)
- Mỗi flowchart mô tả quy trình nghiệp vụ thực tế: các bước xử lý, điều kiện rẽ nhánh, actor thực hiện
- Dùng thông tin này để thiết kế đúng layout và flow của từng màn hình (ví dụ: màn hình có bao nhiêu trạng thái, có cần timeline/stepper không)

### Design reference (CSS/style)
- **Đọc `.agents/designs/mockup_qt01.html`** — đây là file design chuẩn của dự án
- Kế thừa **toàn bộ** CSS variables, component classes, color palette, typography từ file này
- Không tự bịa style mới — chỉ dùng design system đã có

---

## Bước 2: Lập danh sách màn hình cần thiết kế

Với mỗi module, liệt kê:
- Tên màn hình
- Loại: **Grid** (danh sách) / **Form** (nhập liệu) / **Dashboard** / **Custom** (workflow, timeline...)
- Actors có quyền truy cập
- Mô tả ngắn về nội dung chính

> **Review checkpoint:** Dùng `notify_user` để người dùng **approve danh sách màn hình** trước khi tạo mockup.

---

## Bước 3: Tạo file HTML mockup cho từng màn hình

### Nơi lưu output
```
.agents/designs/mockup_[mã-module].html
```
Ví dụ: `mockup_qt01.html`, `mockup_qt02.html`, `mockup_qt03.html`...

### Nguyên tắc thiết kế

**Bắt buộc:**
- Kế thừa **hoàn toàn** CSS variables và component classes từ file `mockup_qt01.html` (nếu có)
- Không bịa style mới — chỉ dùng design system đã có
- Layout: sidebar navigation + main content area
- Responsive cho màn hình desktop (min 1280px)

**Thứ tự ưu tiên trong mỗi file mockup:**
1. **Grid màn hình chính** — header với title + nút action; toolbar search/filter; table/grid với columns; pagination
2. **Form/Edit panel** — có thể là sidebar slide-in, popup, hoặc trang riêng
3. **Màn hình đặc thù** — workflow timeline, approval steps, dashboard...

**Nếu chưa có file reference:**
- Tạo design system riêng với: màu chủ đạo, font chữ, spacing, border-radius
- Dùng CSS variables đầy đủ để dễ duy trì
- Style: modern, clean, professional — phù hợp ứng dụng quản lý doanh nghiệp

### Nội dung tối thiểu mỗi file mockup

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <!-- CSS variables + design system (kế thừa từ reference) -->
  <!-- Component styles: button, table, form, badge, ... -->
</head>
<body>
  <!-- Sidebar navigation (nếu cần) -->
  <!-- Main layout: header + toolbar + content -->
  
  <!-- [1] Grid màn hình chính -->
  <!-- [2] Detail/Form panel (popup hoặc slide) -->
  <!-- [3] Màn hình đặc thù của module nếu có -->
  
  <!-- JavaScript: tab switching, mock interactions -->
</body>
</html>
```

> **Không dùng `generate_image`** — tạo file HTML trực tiếp để có thể chỉnh sửa và tái sử dụng.

---

## Bước 4: Xử lý màn hình đặc thù

Với module có workflow/approval phức tạp, thiết kế thêm:
- **Timeline** — các bước xử lý, trạng thái (pending/approved/rejected)
- **Stepper** — wizard nhiều bước
- **Split view** — danh sách + detail panel bên phải
- **Popup confirm** — dialog xác nhận, dialog nhập lý do từ chối...

### Flow Pipeline Architecture — Thiết kế Main-flow và Sub-flow

#### 1. Main-flow Node Structure

Mỗi bước trong main pipeline phải có **icon khác nhau**, **màu sắc ring đa dạng** (chọn từ palette), animation `p-circ cr` **chỉ kích hoạt khi được click**. Cấu trúc HTML bắt buộc:

```html
<div class="p-node" data-s="pm1" onclick="filterNode('pm1',this)">
  <!-- 1. Icon + vòng tròn (màu theo trạng thái hoặc chủ đề bước) -->
  <div class="p-circ cw">  <!-- cw=amber, cr=blue, cg=green, ct=purple, crd=red, ci=grey -->
    <span class="p-icon">📋</span>
    <div class="p-badge pb-am">2</div>  <!-- số task đang chờ -->
  </div>
  <!-- 2. Nhãn bước -->
  <div class="p-lbl">
    <div class="p-num">
      Bước 1
      <!-- Nếu bước có nhiều thông tin → thêm icon tooltip -->
      <span class="p-tip-icon" data-tip="Mô tả chi tiết bước này...">ℹ️</span>
    </div>
    <!-- 3. Tiêu đề bước -->
    <div class="p-name">Tiêu đề Bước 1</div>
    <!-- 4. (Tùy chọn) Ghi chú nhỏ, không in đậm -->
    <div class="p-note">Ghi chú nếu cần</div>
  </div>
  <!-- 5. Dots chỉ khi bước có sub-flow -->
  <div class="p-sdots">
    <div class="p-sdot" style="background:var(--gn)"></div>
    <div class="p-sdot" style="background:var(--bl)"></div>
    <div class="p-sdot" style="background:var(--bd2)"></div>
  </div>
</div>
```

**Quy tắc đặt tên bước:**
- Bước thường: `Bước 1`, `Bước 2`, ... `Bước N`
- Bước là trigger định kỳ: `Bước N · Trigger`
- Bước trong trigger tab: `Bước 1` (đánh lại từ 1 cho mỗi trigger)

**Palette màu ring (p-circ class) — phân bổ đa dạng:**
- `cr` — xanh dương (blue) — bước đang hoạt động / biên soạn
- `cw` — vàng (amber) — bước chờ phê duyệt
- `cg` — xanh lá (green) — bước lưu trữ / hoàn thành
- `ct` — tím (purple) — bước trigger / định kỳ
- `crd` — đỏ (red) — bước sự cố / khẩn
- `ci` — xám (grey) — bước chưa có task

**CSS cần thêm cho p-note và p-tip-icon:**
```css
.p-note {
  font-size: 10px;
  color: var(--t3);
  font-weight: 400;
  line-height: 1.3;
  margin-top: 1px;
  text-align: center
}
.p-tip-icon {
  font-size: 11px;
  cursor: help;
  position: relative;
  display: inline-block;
  margin-left: 4px
}
.p-tip-icon:hover::after {
  content: attr(data-tip);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 6px;
  background: var(--tx);
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  padding: 5px 10px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 99;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0,0,0,.2)
}
```

---

#### 2. Sub-flow Node Structure

Sub-flow dùng class `p-node-sm` (icon + vòng tròn **nhỏ hơn 70%** so với main-flow). Bước cuối trong sub-flow là tên của bước tiếp theo ở main-flow.

```html
<div class="p-node-sm">
  <!-- 1. Icon + vòng tròn nhỏ -->
  <div class="p-circ-sm" style="border-color:var(--amd);background:var(--amb)">
    <span class="p-icon-sm">📝</span>
  </div>
  <!-- 2. Nhãn bước con -->
  <div class="p-num-sm" style="color:var(--am)">
    Bước 1.1
    <span class="p-tip-icon" data-tip="Chi tiết bước con...">ℹ️</span>
  </div>
  <!-- 3. Tiêu đề -->
  <div class="p-name-sm" style="color:var(--am)">Tiêu đề bước con</div>
  <!-- 4. (Tùy chọn) Ghi chú nhỏ -->
  <div class="p-note" style="color:var(--t3)">Ghi chú nếu cần</div>
</div>
```

**Quy tắc đặt tên bước con:** `Bước X.1`, `Bước X.2`, `Bước X.3`... (X là số bước cha trong main-flow).

**Bước cuối sub-flow** (chuyển tiếp về main-flow):
```html
<!-- Bước cuối = tên bước tiếp theo trên main-flow, opacity thấp -->
<div class="p-node-sm" style="opacity:0.5">
  <div class="p-circ-sm" style="border-color:var(--bd);background:var(--s3)">
    <span class="p-icon-sm">→</span>
  </div>
  <div class="p-num-sm">Bước 2</div>
  <div class="p-name-sm">Tên bước tiếp theo</div>
</div>
```

---

#### 3. Tooltip Pattern (p-tip-icon)

Chỉ dùng tooltip khi bước có **nhiều thông tin bổ sung** (điều kiện, actor, deadline, ghi chú). Tooltip hiện sang **bên phải**, ngang giữa icon, khi hover.

- **KHÔNG** dùng `data-tip` trực tiếp trên `p-circ` hay cấu trúc `.tip` cũ
- Tooltip nằm trong `p-num` hoặc `p-num-sm`, sau text nhãn bước
- **Bỏ** class `.tip` và `data-tip` kiểu cũ (đã deprecate)

---

### Quy tắc Pipeline Dots (p-sdots) — Sub-flow Indicator

Trong pipeline visualization, mỗi node bước (`p-node`) **chỉ hiển thị 3 chấm dưới (`p-sdots`) nếu bước đó CÓ sub-flow**. Các bước không có sub-flow thì **không có `p-sdots`**.

**Ý nghĩa từng chấm:**
- Mỗi chấm = 1 sub-step trong sub-flow
- `var(--gn)` = đã hoàn thành ✓ | `var(--bl)` = đang xử lý ⚡ | `var(--am)` = chờ duyệt ⏳ | `var(--bd2)` = chưa bắt đầu ○

**Cách xác định step nào CÓ sub-flow:** Dựa vào file `flowchart_qtXX.html`.

### Quy tắc Mũi tên Pipeline (p-arr) — Nét liền và Nét đứt

**Tất cả mũi tên đều là NÉT LIỀN, trừ 2 trường hợp:**
1. Mũi tên trước **bước cuối cùng** của main pipeline (lưu trữ/trigger)
2. Mũi tên **cuối sub-flow** (trước bước chuyển tiếp mờ)

```html
<!-- Nét liền (default) -->
<div class="p-arr"><svg viewBox="0 0 26 10">
    <line x1="0" y1="5" x2="20" y2="5" stroke="var(--bd2)" stroke-width="1.5" />
    <polygon points="18,2 26,5 18,8" fill="var(--bd2)" />
  </svg></div>

<!-- Nét đứt (chỉ dùng cho 2 TH trên) -->
<div class="p-arr"><svg viewBox="0 0 26 10">
    <line x1="0" y1="5" x2="20" y2="5" stroke="var(--bd2)" stroke-width="1.5" stroke-dasharray="4,2" />
    <polygon points="18,2 26,5 18,8" fill="var(--bd2)" />
  </svg></div>
```

---

## Bước 5: Viết mô tả màn hình kèm mockup

Tạo hoặc cập nhật file `.agents/docs/ui-spec.md`:

```markdown
# UI Specification — [Tên dự án]

> Phiên bản: 1.0 | Ngày: [ngày tạo]

## Danh sách màn hình

| # | Module | Màn hình | Loại | File mockup | Actors |
|---|--------|--------|------|-------------|--------|
| 1 | QT01 | Danh sách tài liệu | Grid | [mockup_qt01.html](../designs/mockup_qt01.html) | Staff, Manager |
| 2 | QT01 | Form tạo/sửa tài liệu | Form | (trong mockup_qt01.html) | Staff |

## Chi tiết từng màn hình

### [Tên màn hình]
- **Module:** [QT01]
- **Route:** /admin/[route]
- **Loại:** Grid / Form / Custom
- **Fields hiển thị (Grid):** Cột 1, Cột 2, Cột 3...
- **Fields nhập liệu (Form):** Field 1 (type, required), Field 2...
- **Actions:** Thêm mới, Sửa, Xóa, Duyệt...
- **Ghi chú UX:** [Điểm đặc biệt cần chú ý khi code thật]
```

---

## Bước 6: Báo cáo & chờ approve

1. Tóm tắt: số màn hình đã thiết kế, số file mockup đã tạo
2. Liệt kê path từng file: `.agents/designs/mockup_[x].html`
3. Highlight các màn hình phức tạp (workflow, approval, custom UI)
4. **Dùng `notify_user` để báo review toàn bộ mockup**
5. Chờ approve trước khi kết thúc

> ✅ Output của agent này là **input cho Backend Designer** (biết được entities cần thiết) và **UI Developer** (có HTML mockup để follow khi code Angular).
