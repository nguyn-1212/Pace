---
name: api-add-module
description: Cách thêm một module mới vào API ASP.NET Core của lazy.flow — từ entity, LazyContext, Program.cs, Controller đến EF Core Migration. Dựa trên pattern thực tế từ Category, Configuration, EmailTemplate.
---

# Thêm module mới vào API — lazy-ship

Flow đầy đủ: **Entity → LazyContext → Program.cs → Controller → Migration**.  
Tham khảo: `CategoryController`, `ConfigurationController`, `EmailTemplateController`.

---

## Bước 1: Tạo Entity

Tạo file `Data/Entities/[Feature].cs`.  
Entity kế thừa **`BaseEntity`** (từ `URF.Core.EF.Trackable`).

```csharp
// Data/Entities/Product.cs
using URF.Core.EF.Trackable;

namespace Lazy.Ship.Api.Data.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }

        // Navigation property (nếu có FK)
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }
    }
}
```

> `BaseEntity` đã có sẵn: `Id`, `IsActive`, `IsDelete`, `CreatedDate`, `UpdatedDate`, `CreatedBy`, `UpdatedBy`, `CreatedByUser`, `UpdatedByUser`, `TenantId`.

---

## Bước 2: Đăng ký trong LazyContext

Mở `Data/LazyContext.cs`, thêm 2 chỗ:

**2a. Thêm `DbSet` property** (theo nhóm, ví dụ dưới `// CRM`):
```csharp
public DbSet<Product> Products { get; set; }
```

**2b. Thêm config trong `OnModelCreating`**:
```csharp
modelBuilder.Entity<Product>(entity =>
{
    entity.ToTable("product");          // tên bảng lowercase
    entity.HasKey(e => e.Id);
    entity.HasIndex(e => e.Name);
    entity.HasIndex(e => e.Code);
    entity.Property(e => e.Name).IsRequired().HasMaxLength(250);
    entity.Property(e => e.Code).HasMaxLength(50);
    entity.Property(e => e.Description).HasMaxLength(1000);

    // FK (nếu có)
    entity.HasOne(d => d.Category)
        .WithMany(p => p.Products)
        .HasForeignKey(d => d.CategoryId)
        .HasConstraintName("FK_Products_CategoryId");

    // Luôn thêm 2 dòng này cuối cùng
    entity.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy);
    entity.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy);
});
```

> **Quy tắc bắt buộc trong LazyContext:**
> - `entity.ToTable(...)` — tên bảng **lowercase**
> - `entity.HasKey(e => e.Id)` — luôn khai báo PK
> - Thêm `HasIndex` cho các cột hay filter/search
> - `HasMaxLength` cho tất cả string
> - 2 dòng `CreatedByUser` + `UpdatedByUser` cuối cùng
> - Tên constraint: `FK_[PluralTable]_[FKColumn]`

---

## Bước 3: Đăng ký Repository trong Program.cs

Mở `Program.cs`, thêm vào phần `// CRM` (hoặc nhóm phù hợp):

```csharp
// CRM
builder.Services.AddScoped<IRepositoryX<Product>, RepositoryX<Product>>();
```

> Chỉ cần repository, **không cần service** nếu controller chỉ dùng CRUD cơ bản.

---

## Bước 4: Tạo Controller

Tạo file `Controllers/Admin/ProductController.cs`.

### Trường hợp 1 — CRUD thuần (như EmailTemplateController)

Controller chỉ có 5 dòng, toàn bộ CRUD được kế thừa từ `AdminBaseController<T>`:

```csharp
using Microsoft.AspNetCore.Mvc;
using Lazy.Ship.Api.Data.Entities;
using Lazy.Ship.Api.Controllers.Admin;
using System;

namespace Lazy.Ship.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ProductController : AdminBaseController<Product>
    {
        public ProductController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }
    }
}
}
```

### Trường hợp 2 — Thêm endpoint custom (như CategoryController)

Vẫn kế thừa `AdminBaseController<T>`, bổ sung thêm action riêng.  
Dùng `Repository` (protected property từ base) để query:

```csharp
[ApiController]
[Route("api/admin/[controller]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class ProductController : AdminBaseController<Product>
{
    public ProductController(IServiceProvider serviceProvider) : base(serviceProvider)
    {
    }

    // Ví dụ: GET api/admin/Product/Lookup
    [HttpGet("Lookup")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public IActionResult Lookup()
    {
        try
        {
            var result = Repository.Queryable()
                .Where(c => c.IsActive == true)
                .Select(c => new { c.Id, c.Name, c.Code })
                .ToList();
            return Ok(ResultApi.ToEntity(result));
        }
        catch (Exception ex)
        {
            return ExceptionHelper.HandleException(ex, UserId);
        }
    }

    // Ví dụ: POST api/admin/Product/Items (override default Items)
    [HttpPost("Items")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public async Task<IActionResult> GetAllAsync([FromBody] TableData obj)
    {
        try
        {
            var result = await Repository.Queryable().AsNoTracking()
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Code,
                    c.IsActive,
                    c.IsDelete,
                    c.Description,
                    c.CreatedDate,
                    c.UpdatedDate,
                    CategoryName = c.Category != null ? c.Category.Name : string.Empty,
                    CreatedBy = c.CreatedByUser != null ? c.CreatedByUser.UserName : string.Empty,
                    UpdatedBy = c.UpdatedByUser != null ? c.UpdatedByUser.UserName : string.Empty,
                })
                .ToQueryAsync(obj);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return ExceptionHelper.HandleException(ex, UserId);
        }
    }
}
```

---

## Bước 5: Tạo và chạy EF Core Migration

Sau khi thêm/sửa Entity và cập nhật LazyContext, **bắt buộc** phải chạy migration để apply vào database.

### Thư mục làm việc
```
cd D:\Coding\Lazy\lazy-ship\api\Lazy.Ship.Api
```

### 5a. Tạo migration mới

> Dùng tên migration mô tả thay đổi, ví dụ `AddProductModule`, `AddWorkflowEngine`, `UpdateUserAddField`.

// turbo
```powershell
dotnet ef migrations add <TênMigration>
```

### 5b. Apply migration vào database

// turbo
```powershell
dotnet ef database update
```

### Lưu ý quan trọng

> **Cấu hình DB** đọc từ `appsettings.Development.json` → `TenantSettings.Defaults.ConnectionString`.  
> Hiện tại: MySQL tại `103.159.51.215`, database `lazy_ship` (lazy-ship).

> **Nếu migration lỗi**, kiểm tra:
> - Entity có `using URF.Core.EF.Trackable.Entities;` khi dùng `User`, `Department`, `Role`
> - `LazyContext.cs` đã có `DbSet<[Feature]>` và config trong `OnModelCreating`
> - Build thành công trước khi chạy migration: `dotnet build`

### Rollback migration (khi cần)
```powershell
# Rollback về migration trước đó
dotnet ef database update <TênMigrationTrướcĐó>

# Xoá migration chưa apply
dotnet ef migrations remove
```

---

## Tóm tắt — Checklist

```
[ ] Data/Entities/[Feature].cs          → kế thừa BaseEntity, thêm using URF.Core.EF.Trackable.Entities nếu dùng User/Role/Department
[ ] LazyContext.cs → DbSet              → public DbSet<[Feature]> [Feature]s { get; set; }
[ ] LazyContext.cs → OnModelCreating    → entity.ToTable, HasKey, HasIndex, HasMaxLength, HasForeignKey, CreatedByUser, UpdatedByUser
[ ] Program.cs                          → AddScoped<IRepositoryX<[Feature]>, RepositoryX<[Feature]>>()
[ ] Controllers/Admin/[Feature]Controller.cs → AdminBaseController<[Feature]>
[ ] dotnet ef migrations add <TênMigration>   → tạo migration
[ ] dotnet ef database update                 → apply vào DB
```

---

## Endpoint tự động có sau khi kế thừa AdminBaseController

| Method | Route | Mô tả |
|--------|-------|-------|
| `POST` | `/Items` | Lấy danh sách có phân trang + filter |
| `POST` | `/Export` | Export CSV/Excel |
| `GET`  | `/{id}` | Lấy 1 bản ghi |
| `POST` | `` | Thêm mới |
| `PUT`  | `` | Cập nhật (toàn bộ hoặc partial `?columns=`) |
| `DELETE` | `/{id?}` | Xóa hẳn (hard delete) |
| `DELETE` | `/Trash/{id?}` | Soft delete toggle `IsDelete` |
| `POST` | `/Active/{id}` | Toggle `IsActive` |
| `GET`  | `/Exists/{id?}` | Kiểm tra unique |
| `GET`  | `/Lookup` | Dropdown data |

---

## SeedData — Tạo dữ liệu mẫu (Roles + Users)

Khi cần tạo dữ liệu mẫu (seed data) thông qua API, thêm endpoint trong `SecurityController.cs`.

### Pattern chuẩn

```csharp
[HttpPost("SeedData")]
[Authorize(AuthenticationSchemes = "Bearer")]
public async Task<IActionResult> SeedDataAsync()
{
    var summary = new List<string>();

    // 1. Tạo Roles qua RoleManager
    var roleDefs = new[]
    {
        new { Code = "KTV", Name = "Kỹ thuật viên" },
        // ...
    };
    foreach (var rd in roleDefs)
    {
        var existing = _roleManager.Roles.FirstOrDefault(r => r.Code == rd.Code);
        if (existing == null)
        {
            var role = new Role
            {
                Code = rd.Code,
                Name = rd.Name,
                IsActive = true,
                IsDelete = false,
                CreatedBy = 1,
                CreatedDate = DateTime.Now,
                NormalizedName = rd.Name.ToUpper(),
            };
            await _roleManager.CreateAsync(role);
        }
    }

    // 2. Tạo Users qua UserManager (password hash 2 lần)
    var rawPassword = "raw_password_here";
    var hashedPassword = SecurityHelper.CreateHash256(rawPassword, _appSettings.Secret);
    var newUser = new User
    {
        UserName = "username",
        Email = "user@lazy.vn",
        FullName = "Full Name",
        IsActive = true, IsDelete = false,
        Locked = false, EmailConfirmed = true,
        CreatedBy = 1,
        Birthday = DateTime.Now,
        CreatedDate = DateTime.Now,
        UserType = (int)UserType.Management,
    };
    await _userManager.CreateAsync(newUser, hashedPassword);

    // 3. Gán UserRole — KHÔNG dùng AddToRoleAsync, tạo entity trực tiếp
    var userRole = new UserRole
    {
        UserId = newUser.Id,
        RoleId = role.Id,
        IsActive = true, IsDelete = false,
        CreatedBy = 1,
        CreatedDate = DateTime.Now,
    };
    _context.UserRoles.Add(userRole);
    await _context.SaveChangesAsync();

    return Ok(new { message = "SeedData completed", details = summary });
}
```

### Inject dependencies cần thiết

```csharp
private readonly RoleManager<Role> _roleManager;
private readonly UserManager<User> _userManager;
private readonly LazyContext _context;
private readonly AppSettings _appSettings;
```

### Quy tắc quan trọng

| Rule | Chi tiết |
|---|---|
| **Password hash 2 lần** | Dùng `SecurityHelper.CreateHash256(rawPassword, _appSettings.Secret)` — không truyền thẳng plain text |
| **Không dùng `AddToRoleAsync`** | Tạo entity `UserRole { UserId, RoleId }` và `_context.UserRoles.Add(...)` rồi `SaveChangesAsync()` |
| **Idempotent** | Luôn check tồn tại trước khi tạo (skip nếu đã có) |
| **`CreatedBy = 1`** | Set admin user Id để tránh null violation |
