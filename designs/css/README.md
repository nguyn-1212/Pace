# Pace — Hướng dẫn dùng theme.css

## Cách dùng

Thêm vào đầu mỗi file HTML, TRƯỚC mọi style khác:

```html
<link rel="stylesheet" href="theme.css">
```

Sau đó có thể xóa toàn bộ:
- `@import url(...)` Google Fonts
- `:root { ... }` định nghĩa variables
- `[data-theme="dark"] { ... }` 
- Các class dùng chung: `.btn-primary`, `.inp`, `.chip`, `.tg`, `.tab-bar`, `.sheet-bd`, v.v.

---

## Variables có sẵn

### Brand Colors
| Variable | Giá trị | Dùng cho |
|----------|---------|----------|
| `--ch`   | #BA541C | Accent chính, nút, icon active |
| `--wb`   | #2B0F04 | Header background, text đậm |
| `--sp`   | #6A3C16 | Text phụ |
| `--rw`   | #FFF6ED | Card/screen background |
| `--cr`   | #F5EDE0 | Page background |
| `--mu`   | #C4A882 | Muted text, placeholder |
| `--gd`   | #4A7C59 | Success, done, green |
| `--rs`   | #E8593C | Error, miss, red |

### Surfaces
| Variable     | Dùng cho |
|-------------|----------|
| `--bg`      | Main screen background |
| `--bg2`     | Secondary cards, surfaces |
| `--bg-header` | Dark header |

### Text
| Variable       | Dùng cho |
|---------------|----------|
| `--text`      | Primary text |
| `--text2`     | Secondary text |
| `--text-muted`| Placeholder, meta |

### Borders
| Variable     | Dùng cho |
|-------------|----------|
| `--border`   | Default border (subtle) |
| `--border-md`| Input, card border |
| `--border-hv`| Hover state |

### Spacing
`--sp-xs(4)` `--sp-sm(8)` `--sp-md(12)` `--sp-lg(16)` `--sp-xl(20)` `--sp-2xl(28)`

### Border Radius
`--r-sm(8)` `--r-md(12)` `--r-lg(14)` `--r-xl(20)` `--r-2xl(28)` `--r-full(999)`

### Transitions
`--t-fast(0.12s)` `--t-base(0.20s)` `--t-slow(0.35s)`

---

## Classes có sẵn

### Layout
- `.phone` — phone frame wrapper
- `.sb` — status bar
- `.hd` / `.hd-title` / `.hd-sub` — header
- `.screen` — main content area
- `.section-head` / `.section-label` / `.see-all`

### Components
- `.list-wrap` / `.list-row` / `.lr-icon` / `.lr-body` / `.lr-name` / `.lr-sub` / `.lr-right` / `.lr-badge` / `.lr-arrow`
- `.card-base` / `.card-surface` / `.card-dark`
- `.view-tabs` / `.vtab` / `.vtab.active`

### Buttons
- `.btn-primary` — nút chính màu chestnut
- `.btn-secondary` — nút viền
- `.btn-ghost` — nút text only
- `.btn-done` / `.btn-adjust` — nút inline trong goal cards
- `.btn-add-dashed` — nút thêm có viền dashed

### Forms
- `.inp-label` + `.inp` — label + input field
- `.chip-row` + `.chip` + `.chip.sel` — chip selector

### Toggles
- `.tg` + `.tg.on` — toggle lớn (42x23)
- `.tg-sm` + `.tg-sm.on` — toggle nhỏ (38x21)

### Progress
- `.prog-bar` + `.prog-fill` + `.prog-fill-ok/warn/over`

### Navigation
- `.tab-bar` / `.ti` / `.ti.a` / `.tic` / `.tl` / `.td-btn`

### Sheets & Sub-screens
- `.sheet-bd` + `.sheet-bd.open` → backdrop + sheet
- `.sheet` / `.sh-handle` / `.sh-title` / `.sh-sub`
- `.sub-screen` + `.sub-screen.open`
- `.sub-top` / `.sub-back` / `.sub-heading` / `.sub-body`

### Tags
- `.tag.tag-study` / `.tag-health` / `.tag-finance` / `.tag-personal`
- `.tag.tag-success` / `.tag-warn` / `.tag-danger` / `.tag-new`

### Special
- `.no-guilt` / `.no-guilt-title` / `.no-guilt-body`

---

## Dark mode

Dark mode được apply tự động khi set `data-theme="dark"` trên `<body>` hoặc `.phone`:

```js
// Toggle dark mode
document.body.setAttribute('data-theme', 'dark');
document.body.removeAttribute('data-theme'); // về light
```

---

## Thêm file HTML mới

Template tối thiểu cho 1 màn mới:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Pace — Tên màn</title>
  <link rel="stylesheet" href="theme.css">
  <style>
    /* Chỉ viết style đặc thù của màn này */
  </style>
</head>
<body>
<div class="phone">
  <div class="sb"><span>9:41</span><span>100%</span></div>
  <div class="hd">
    <div class="hd-title">Tên màn</div>
    <div class="hd-sub">Mô tả ngắn</div>
  </div>
  <div class="screen">
    <!-- Nội dung -->
  </div>
  <!-- Tab bar: copy từ navbar.js hoặc file khác -->
</div>
</body>
</html>
```
