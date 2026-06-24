---
name: ui-add-module
description: Cách thêm module UI mới (Grid + Edit form) vào lazy.flow Angular — từ Entity, Module, Grid, Edit đến Route. Dựa trên pattern thực tế.
---

# Thêm module UI mới — lazy-ship

Flow: **Entity (FE) → Module → Grid Component → Edit Component → Route**.
Tham khảo: `CategoryComponent`, `EmailTemplateComponent`.

---

## Bước 1: Tạo Entity (Frontend)

File: `domains/entities/{feature}.entity.ts`

### ⚠️ Quy tắc quan trọng về `LookupData.Reference(T)`

`LookupData.Reference(T)` mặc định dùng `propertyDisplay: ['Name']` và `propertyValue: 'Id'`.

**Bắt buộc** phải chỉ định `propertyDisplay` rõ ràng khi entity T **không có trường `Name`** hoặc cần hiển thị khác:

```typescript
// ✅ Entity có trường Name — dùng mặc định OK
lookup: LookupData.Reference(ShopEntity)
// → hiển thị Name

// ✅ Bank — dùng ShortName + Code (ngắn gọn hơn Name)
lookup: LookupData.Reference(BankEntity, ['ShortName', 'Code'])

// ✅ Carrier — dùng Code + Name
lookup: LookupData.Reference(CarrierEntity, ['Code', 'Name'])

// ✅ Order — không có Name, dùng Code + RecipientName
lookup: LookupData.Reference(OrderEntity, ['Code', 'RecipientName'])

// ✅ Settlement — không có Name, chỉ có Code
lookup: LookupData.Reference(SettlementEntity, ['Code'])

// ✅ CarrierReconciliation — không có Name, chỉ có Code
lookup: LookupData.Reference(CarrierReconciliationEntity, ['Code'])

// ✅ ShopBankAccount — không có Name, dùng AccountNumber + AccountName
lookup: LookupData.Reference(ShopBankAccountEntity, ['AccountNumber', 'AccountName'])

// ✅ SettlementShop — không có Name
lookup: LookupData.Reference(SettlementShopEntity, ['ShopId'])
```

**Quy tắc chọn propertyDisplay:**

| Entity | propertyDisplay | Lý do |
|--------|----------------|-------|
| Entity có `Name` | `['Name']` (default) | Đủ rõ |
| Entity có `Code` + `Name` | `['Code', 'Name']` | Code ngắn gọn hơn |
| Entity chỉ có `Code` | `['Code']` | Không có Name |
| Bank | `['ShortName', 'Code']` | ShortName ngắn hơn Name dài |
| Order | `['Code', 'RecipientName']` | Nhận dạng đơn qua mã + người nhận |
| TK ngân hàng | `['AccountNumber', 'AccountName']` | Số TK + tên chủ TK |

---

```typescript
import { TableDecorator } from '../../core/decorators/table.decorator';
import { StringDecorator } from '../../core/decorators/string.decorator';
import { NumberDecorator } from '../../core/decorators/number.decorator';
import { BooleanDecorator } from '../../core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../core/decorators/dropdown.decorator';
import { ImageDecorator } from '../../core/decorators/image.decorator';
import { DateTimeDecorator } from '../../core/decorators/datetime.decorator';

@TableDecorator({ name: 'product' })
export class ProductEntity {
  Id: number;

  @StringDecorator({ label: 'Tên', required: true, max: 250 })
  Name: string;

  @StringDecorator({ label: 'Mã', max: 50, unique: { url: '/product/exists' } })
  Code: string;

  @StringDecorator({ label: 'Mô tả', type: StringType.TextArea, max: 1000 })
  Description: string;

  @DropDownDecorator({ label: 'Danh mục', lookup: { url: '/category/lookup', key: 'Id', value: 'Name' } })
  CategoryId: number;

  @NumberDecorator({ label: 'Giá', type: NumberType.Currency, min: 0 })
  Price: number;

  @BooleanDecorator({ label: 'Hiển thị' })
  IsVisible: boolean;

  @ImageDecorator({ label: 'Ảnh', url: 'product' })
  Image: string;

  @DateTimeDecorator({ label: 'Ngày tạo', type: DateTimeType.DateTime })
  CreatedDate: Date;
}
```

> **@TableDecorator**: `name` phải khớp tên controller BE (lowercase).  
> Decorators quyết định: label, validation, editor type, lookup...

---

## Bước 2: Tạo Grid Component

File: `modules/product/product.component.ts`

```typescript
import { Component } from '@angular/core';
import { GridData } from '../../core/domains/data/grid.data';
import { ProductEntity } from '../../domains/entities/product.entity';
import { GridComponent } from '../../core/components/grid/grid.component';
import { ActionType } from '../../core/domains/enums/action.type';

@Component({
  templateUrl: '../../core/components/grid/grid.component.html',
})
export class ProductComponent extends GridComponent {
  obj: GridData = {
    Reference: ProductEntity,
    // Hiển thị các cột
    Properties: ['Code', 'Name', 'CategoryId', 'Price', 'IsVisible', 'CreatedDate'],

    // Actions: dùng mặc định hoặc tùy chỉnh
    Actions: [
      { icon: 'la la-eye', name: ActionType.View },
      { icon: 'la la-pen', name: ActionType.Edit },
      { icon: 'la la-trash', name: ActionType.Delete },
    ],

    // Features tùy chọn
    Checkable: true,           // checkbox chọn nhiều
    Search: true,              // ô tìm kiếm
    ClassName: 'product-grid', // CSS class tùy chỉnh

    // Ẩn nếu cần (set [] để ẩn)
    // Exports: [],
    // Imports: [],
    // Filters: [],
  };

  ngOnInit() {
    this.render(this.obj);
  }

  // Override navigation
  addNew = () => this.router.navigate(['/admin/product/add']);
  edit = (item) => this.router.navigate(['/admin/product/edit', item.Id]);
  view = (item) => this.router.navigate(['/admin/product/view', item.Id]);
}
```

### Dùng popup thay navigation:

```typescript
addNew = () => {
  this.popupAsync({
    object: EditProductComponent,
    title: 'Thêm sản phẩm',
    size: ModalSizeType.Large,
    confirmText: 'Lưu',
  }, async () => { await this.loadItems(); });
};
```

### Dùng auto-form (không cần Edit component):

```typescript
addNew = () => {
  this.popupAutoAsync({
    title: 'Thêm nhanh',
    size: ModalSizeType.Medium,
    objectValue: {
      reference: ProductEntity,
      properties: ['Name', 'Code', 'CategoryId'],
      object: new ProductEntity(),
    },
    confirmText: 'Lưu',
    confirmFunction: async (item) => {
      await this.service.save('product', item);
      await this.loadItems();
    },
  });
};
```

---

## Bước 3: Tạo Edit Component (nếu cần form riêng)

File: `modules/product/edit/edit.product.component.ts`

```typescript
import { Component } from '@angular/core';
import { ProductEntity } from '../../../domains/entities/product.entity';
import { EditComponent } from '../../../core/components/edit/edit.component';

@Component({
  templateUrl: '../../../core/components/edit/edit.component.html',
})
export class EditProductComponent extends EditComponent {
  obj: ProductEntity = new ProductEntity();
  properties: string[] = ['Code', 'Name', 'Description', 'CategoryId', 'Price', 'Image'];

  async ngOnInit() {
    await this.autoLoadItem(this.activatedRoute, ProductEntity);
    this.render(this.obj, this.properties);
  }

  async confirm(): Promise<boolean> {
    let valid = await this.validate();
    if (!valid) return false;
    let result = await this.service.save('product', this.item);
    if (ResultApi.IsSuccess(result)) {
      this.dialogService.Success('Đã lưu!');
      return true;
    }
    return false;
  }
}
```

---

## Bước 4: Tạo Module + Routes

File: `modules/product/product.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentModule } from '../../core/components/component.module';
import { ProductComponent } from './product.component';
import { EditProductComponent } from './edit/edit.product.component';

@NgModule({
  declarations: [ProductComponent, EditProductComponent],
  imports: [
    ComponentModule,
    RouterModule.forChild([
      { path: '', component: ProductComponent },
      { path: 'add', component: EditProductComponent },
      { path: 'edit/:id', component: EditProductComponent },
      { path: 'view/:id', component: EditProductComponent },
    ]),
  ],
})
export class ProductModule {}
```

**Lazy load** trong `admin.routing.module.ts`:

```typescript
{ path: 'product', loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule) },
```

---

## Tóm tắt — Checklist

```
[ ] domains/entities/{feature}.entity.ts    → @TableDecorator + field decorators
[ ] modules/{feature}/{feature}.component.ts → extends GridComponent, obj: GridData, this.render(obj)
[ ] modules/{feature}/edit/edit.{feature}.component.ts → extends EditComponent (nếu cần form)
[ ] modules/{feature}/{feature}.module.ts    → NgModule + RouterModule.forChild
[ ] admin.routing.module.ts                  → loadChildren lazy load
```

---

## Các hàm quan trọng từ GridComponent

| Hàm | Mô tả |
|-----|-------|
| `this.render(obj)` | Render grid từ GridData |
| `this.loadItems()` | Reload danh sách |
| `this.popupAsync(dialogData, okFn)` | Mở popup component tùy chỉnh |
| `this.popupAutoAsync(dialogAutoData)` | Mở auto-form popup từ Entity |
| `this.popupSubGrid(gridData, items?, okFn)` | Mở sub-grid trong popup |
| `this.popupAboveAsync(dialogData, okFn)` | Mở popup lớp 2 |
| `this.exportExcel(fileName, url)` | Export Excel |

## Các hàm quan trọng từ EditComponent

| Hàm | Mô tả |
|-----|-------|
| `this.render(obj, properties)` | Render form |
| `this.validate()` | Validate form, trả boolean |
| `this.autoLoadItem(route, Entity)` | Load item từ URL param `:id` |
| `this.popupAsync(dialogData, okFn)` | Mở popup |
| `this.popupAutoAsync(dialogAutoData)` | Auto-form popup |
| `this.getParamPopup(key)` | Lấy params khi mở từ popup |

## Gọi API từ Component

```typescript
// GridComponent / EditComponent đã inject this.service (AdminApiService)
let result = await this.service.save('product', obj);         // POST/PUT
let result = await this.service.item('product', 123);         // GET /{id}
let result = await this.service.delete('product', 123);       // DELETE
let result = await this.service.callApiUrl('/product/tree');   // Custom GET
let result = await this.service.callApi('product', 'summary', { year: 2024 }); // Custom POST

if (ResultApi.IsSuccess(result)) {
  let data = result.Object;
}
```

## Đa ngôn ngữ

```typescript
// Trong TypeScript (đã inject this.translate)
let text = this.translate.transform('General.Save');

// Trong HTML template
{{ 'General.Save' | translate }}
```

## Phân quyền

```typescript
// Inject AdminAuthService
let user = this.authen.account;           // User hiện tại
let allow = await this.authen.permissionAllow('product', 'Edit');
```

---

## HTML Mockup — Pipeline Sub-flow: Ghost Node Pattern

Khi một sub-flow kết thúc và **trả điều khiển về bước tiếp theo của main-flow**, bước cuối cùng trong sub-flow phải dùng **ghost node** theo pattern sau:

### Quy tắc

- **Icon**: giống hệt bước tương ứng ở main-flow (ví dụ: Bước 4 dùng 📤, Bước 2 dùng 🔍)
- **Badge ↩** ở góc trên phải: thể hiện "quay lên main-flow"
- **opacity: .65**: mờ hơn để phân biệt với bước thật
- **border-style: dashed**: viền nét đứt
- **Màu xám** (`var(--t3)`): p-num-sm và p-name-sm

### HTML Template

```html
<!-- Mũi tên dẫn vào ghost node phải là nét đứt -->
<div class="p-arr"><svg viewBox="0 0 26 10">
    <line x1="0" y1="5" x2="20" y2="5" stroke="var(--bd2)" stroke-width="1.5" stroke-dasharray="4,2" />
    <polygon points="18,2 26,5 18,8" fill="var(--bd2)" />
  </svg></div>

<!-- Ghost node — icon giống main-flow, badge ↩, opacity 65% -->
<div class="p-node-sm" onclick="sfClick(this)" style="opacity:.65">
  <div class="p-circ-sm" style="border-color:var(--bd2);background:var(--s3);border-style:dashed">
    <span class="p-icon-sm">📤</span>     <!-- icon của bước main-flow tương ứng -->
    <div class="p-badge" style="background:var(--t3);color:#fff;font-size:9px;border-color:var(--sf)">↩</div>
  </div>
  <div class="p-num-sm" style="color:var(--t3)">Bước 4</div>
  <div class="p-name-sm" style="color:var(--t3)">Sao chép &amp; Phân phối</div>
</div>
```

### Ví dụ thực tế trong mockup_qt01.html

| Sub-flow | Ghost node cuối | Icon |
|----------|-----------------|------|
| sfp-b1 (Biên soạn) | → Bước 2 Xem xét & Phê duyệt | 🔍 |
| sfp-b2 (Xem xét) | → Bước 3 Đào tạo & Triển khai | 📢 |
| sfp-b3 (QT.03) | → Bước 4 Sao chép & Phân phối | 📤 |

> **Lưu ý**: Sub-flow có node **Kết thúc** (🏁) thì KHÔNG dùng ghost node vì không dẫn về main-flow (ví dụ sfp-hs3, sfp-hs5).

---

## Thêm nút tùy chỉnh vào Toolbar Header Grid

Trong `GridData`, dùng property **`Features`** để khai báo các nút hiển thị trên **toolbar header** (không phải action từng row).

### Pattern chuẩn

```typescript
obj: GridData = {
    Features: [
        ActionData.addNew(() => this.addNew()),      // Nút Thêm mới
        ActionData.reload(() => this.loadItems()),   // Nút Reload
        {
            icon: 'la la-database',
            name: 'Tên nút',
            className: 'btn btn-success',            // btn-primary / btn-danger / btn-success...
            click: () => {
                this.dialogService.ConfirmAsync('Xác nhận?', async () => {
                    await this.service.callApiUrl('/ten-controller/TenAction', null, MethodType.Post)
                        .then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                ToastrHelper.Success('Thành công!');
                                this.loadItems(); // reload grid nếu cần
                            } else ToastrHelper.ErrorResult(result);
                        });
                });
            }
        },
    ],
    Actions: [...],  // row-level actions
};
```

> **Không cần** tạo method riêng trong service — dùng thẳng `this.service.callApiUrl(...)` từ `GridComponent`.

### Phân biệt Features vs Actions vs MoreActions

| Property | Vị trí hiển thị | Dùng cho |
|---|---|---|
| `Features` | Toolbar header grid | Nút toàn cục: Thêm mới, Reload, Custom action... |
| `Actions` | Cột cuối mỗi row | View, Edit, Delete cho từng dòng |
| `MoreActions` | Dropdown "..." mỗi row | Action phụ: Lock, Unlock, Reset Password... |

### import cần thiết

```typescript
import { MethodType } from '../../../core/domains/enums/method.type';
import { ResultApi } from '../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../core/helpers/toastr.helper';
import { ActionData } from '../../../core/domains/data/action.data';
```

---

## Gọi API tùy chỉnh từ Grid/Edit Component

**Ưu tiên dùng `callApiUrl`** (URL tường minh, dễ đọc):

```typescript
// POST
await this.service.callApiUrl('/security/SeedData', null, MethodType.Post);

// GET với params
await this.service.callApiUrl('/report/summary?year=2024');

// POST với body
await this.service.callApiUrl('/product/bulk-update', { ids: [1,2,3] }, MethodType.Post);
```

**Dùng `callApi`** khi cần ghép controller + action:

```typescript
// Tương đương POST /api/admin/permission/createPermission
await this.service.callApi('permission', 'createPermission', item, MethodType.Post);
```

> **Rule:** Ưu tiên `callApiUrl` — URL rõ ràng, dễ trace lỗi hơn `callApi`.

---

## Step Component — Horizontal Step Bar (Flow3 Part4 Pattern)

Step component dùng cho các bước trong flow3 part4 (BAN_HANH_TL). Mỗi step có thể là **1, 2 hoặc 3 bước** với thanh tiến trình ngang, nút quay lại, tiếp tục, xử lý.

### File structure

```
flow3/part4/steps/
  step1a/step1a.component.ts  ← implements currentStep + setStep()
  step1a/step1a.component.html ← hstep-bar + step-panel × N
  step2a/step2a.component.ts
  step2a/step2a.component.html
  ...
```

### TypeScript — Bắt buộc phải có

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EditComponent } from '../../../../../../core/components/edit/edit.component';
import { ModalSizeType } from '../../../../../../core/domains/enums/modal.size.type';

export class XxxStepComponent extends EditComponent implements OnInit, OnChanges {
    @Input() task: any;
    metaJson: any = null;
    currentStep = 0;       // ← bắt buộc: theo dõi bước hiện tại (0 = bước 1)

    constructor() { super(); }

    ngOnInit() { this._load(); }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['task']) { this.currentStep = 0; this._load(); } // reset khi đổi task
    }

    setStep(step: number) { this.currentStep = step; } // ← bắt buộc: chuyển bước

    private _load() {
        if (this.task?.MetaJson) {
            try { this.metaJson = new XxxMetaJsonData(JSON.parse(this.task.MetaJson)); } catch {}
        }
    }

    openXuLy() {
        this.dialogService.WapperAsync({
            cancelText: 'Huỷ',
            confirmText: 'Xác nhận',
            className: 'popup-preview',
            size: ModalSizeType.ExtraLarge,
            title: 'Tiêu đề popup',
            object: XxxPopupComponent,
            objectExtra: { task: this.task, metaJson: this.metaJson },
        }, async (_result: boolean) => { });
    }
}
```

> **Quan trọng**: `ngOnChanges` phải reset `currentStep = 0` — nếu không khi chuyển sang task khác sẽ bị stuck ở bước cuối.

### HTML — Cấu trúc chuẩn 2 bước (ví dụ step2a)

```html
<div class="step-form-container" *ngIf="task; else noTask">

  <!-- 1. Header card (req-card) — luôn hiển thị -->
  <div class="req-card">
    <div class="rc-lbl">🎓 Tiêu đề bước</div>
    <div class="rc-title">{{ task.InstanceTitle }}</div>
    <div class="tags">
      <span class="tag ta">BAN_HANH_TL</span>
      <span class="tag tb">Mô tả</span>
      <span class="pill">WF-{{ task.InstanceId }}</span>
    </div>
    <div class="rc-sub" *ngIf="task.SenderName">
      Được giao bởi: {{ task.SenderName }} · {{ task.CreatedDate | date:'dd/MM/yyyy' }}
    </div>
    <div class="rc-note" *ngIf="task.Note">
      <span class="rn-icon">💬</span>
      <span class="rn-text"><b>Ghi chú:</b> {{ task.Note }}</span>
    </div>
  </div>

  <!-- Tài liệu đính kèm + trạng thái hoàn thành -->
  <box-attachment [metaJson]="metaJson" *ngIf="metaJson"></box-attachment>
  <box-completed [task]="task"></box-completed>

  <!-- 2. Chỉ hiển thị khi CHƯA hoàn thành -->
  <ng-container *ngIf="task.Status !== 'COMPLETED'">
    <div class="dv"></div>

    <!-- 3. Horizontal step bar — số bước tùy theo component -->
    <div class="hstep-bar">
      <div class="hstep" [class.done]="currentStep > 0" [class.active]="currentStep === 0">
        <div class="hstep-line"></div>
        <div class="hstep-circle">{{ currentStep > 0 ? '✓' : '1' }}</div>
        <div class="hstep-label">Nhãn bước 1</div>
      </div>
      <div class="hstep" [class.done]="currentStep > 1" [class.active]="currentStep === 1">
        <div class="hstep-line"></div>
        <div class="hstep-circle">{{ currentStep > 1 ? '✓' : '2' }}</div>
        <div class="hstep-label">Nhãn bước 2</div>
      </div>
      <!-- Thêm bước 3 nếu cần — KHÔNG có hstep-line ở bước cuối -->
      <div class="hstep" [class.active]="currentStep === 2">
        <div class="hstep-circle">{{ currentStep > 2 ? '✓' : '3' }}</div>
        <div class="hstep-label">Nhãn bước 3</div>
      </div>
    </div>

    <!-- 4. BƯỚC 1: Hướng dẫn / Xem thông tin -->
    <div class="step-panel" [class.active]="currentStep === 0">
      <div class="sp-header">
        <div class="sp-num">1</div>
        <div>
          <div class="sp-title">Tiêu đề bước 1</div>
          <div class="sp-sub">Mô tả ngắn bước 1.</div>
        </div>
      </div>

      <!-- Tóm tắt tài liệu (bm01-summary / bm02-summary / bm03-summary) -->
      <div class="bm02-summary" *ngIf="bm02">
        <div class="bm02-title">📄 Tiêu đề tóm tắt</div>
        <div class="bm02-row" *ngIf="bm02.TenKhoaHoc">
          <span class="bm02-label">Nhãn</span>
          <span class="bm02-val">{{ bm02.TenKhoaHoc }}</span>
        </div>
      </div>

      <!-- Guide box -->
      <div class="guide-box">
        <div class="guide-item">📋 <span>Nội dung hướng dẫn <b>in đậm</b>.</span></div>
        <div class="guide-item">✅ <span>Xác nhận điều kiện.</span></div>
      </div>

      <!-- Nav row: bước 1 luôn chỉ có "Tiếp theo" (primary) -->
      <div class="nav-row">
        <button class="nav-btn primary" (click)="setStep(1)">Tiếp theo →</button>
      </div>
    </div>

    <!-- 5. BƯỚC 2: Hành động chính (mở popup / điền form) -->
    <div class="step-panel" [class.active]="currentStep === 1">
      <div class="sp-header">
        <div class="sp-num" style="background:var(--qt-pu)">2</div>
        <div>
          <div class="sp-title">Tiêu đề bước 2</div>
          <div class="sp-sub">Mô tả bước 2.</div>
        </div>
      </div>

      <!-- Tóm tắt tài liệu (nếu cần) -->
      <div class="bm02-summary" *ngIf="bm02">
        <div class="bm02-title">📄 Tiêu đề tóm tắt</div>
        <div class="bm02-row" *ngIf="bm02.TenKhoaHoc">
          <span class="bm02-label">Nhãn</span>
          <span class="bm02-val">{{ bm02.TenKhoaHoc }}</span>
        </div>
      </div>

      <!-- Confirm box: thông tin hành động + button chính -->
      <div class="confirm-box" style="border-color:var(--qt-pud);background:var(--qt-pub);color:var(--qt-pu)">
        <span class="cb-icon">📋</span>
        <div>
          <div class="cb-title">Tiêu đề confirm</div>
          <div class="cb-sub">Mô tả hành động. Sau khi xác nhận → Chuyển sang <b>Bước tiếp theo</b>.</div>
        </div>
      </div>

      <!-- Nav row: QUAY LẠI + NÚT XỬ LÝ (xuly) -->
      <div class="nav-row" style="margin-top:12px">
        <button class="nav-btn" (click)="setStep(0)">← Quay lại</button>
        <button class="nav-btn xuly" style="background:var(--qt-pu)" (click)="openXuLy()">📋 Hành động chính</button>
      </div>
    </div>

    <!-- 6. BƯỚC 3 (nếu cần) — thêm tương tự bước 2, đổi color var(--qt-am) -->

  </ng-container>
</div>

<ng-template #noTask>
  <div style="padding:40px;text-align:center;color:var(--qt-t3)">Chọn yêu cầu để xem công việc</div>
</ng-template>
```

### Quy tắc thiết kế step component

#### Horizontal step bar

| Quy tắc | Chi tiết |
|---------|---------|
| Số bước | 1–3 bước. Mỗi bước thêm 1 `<div class="hstep">` |
| `hstep-line` | Chỉ bước **không phải cuối** mới có line nối |
| `[class.done]` | Bước đã qua: `currentStep > i` → circle ✓, line màu accent |
| `[class.active]` | Bước hiện tại: `currentStep === i` → circle accent + glow |
| Bước chưa đến | Mặc định xám — không cần binding |

#### Step panel (nội dung từng bước)

| Quy tắc | Chi tiết |
|---------|---------|
| `[class.active]="currentStep === i"` | `currentStep = 0` → bước 1 hiển thị |
| CSS `.step-panel { display:none }` | `.step-panel.active { display:block }` trong `steps.scss` |
| `style="display:block"` | **Không dùng** — dùng `[class.active]` đúng pattern |

#### Nav buttons

| Bước | Buttons | Chi tiết |
|------|---------|---------|
| Bước 1 (hướng dẫn) | `primary` | Chỉ "Tiếp theo →" |
| Bước 2 (hành động) | `nav-btn` + `xuly` | "← Quay lại" + nút xử lý màu accent |
| Bước 3 | giống bước 2 | `style="background:var(--qt-am)"` cho nút xuly |

#### Màu sắc theo loại bước

| Loại | CSS Variables |
|------|--------------|
| Bước hướng dẫn (step1a, step1b) | mặc định accent green `var(--qt-gn*)` |
| Bước đào tạo (step2a) | green `var(--qt-gn*)` |
| Bước điểm danh (step2b) | amber `var(--qt-am*)` |
| Bước đề thi (step3a) | purple `var(--qt-pu*)` |
| Bước bảng kiểm (step3b) | purple `var(--qt-pu*)` |
| Bước tổng hợp (step4) | blue `var(--qt-bl*)` |

### Style

Component dùng chung `../../../../scss/steps.scss` — KHÔNG tạo file `.scss` riêng cho từng step.

### Ví dụ thực tế

| Component | Bước | Màu | Nội dung |
|----------|------|-----|---------|
| `step1a` | 2 bước | green | Hướng dẫn → Ghi nhận kế hoạch |
| `step2a` | 2 bước | green | Hướng dẫn → Ghi nhận thực hiện |
| `step2b` | 3 bước | amber | Hướng dẫn → Xem KH → Điểm danh |
| `step3a` | 2 bước | purple | Chuẩn bị → Soạn đề thi |
| `step3b` | 2 bước | purple | Xem BM.03 → Bảng kiểm |
| `step4` | 1 bước | blue | Tổng hợp + xử lý
