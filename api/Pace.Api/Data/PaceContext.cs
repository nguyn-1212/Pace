using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Pace.Api.Data.Entities;
using URF.Core.EF.Trackable.Entities;
using URF.Core.EF.Trackable.Entities.Message;
using File = URF.Core.EF.Trackable.Entities.File;
using Message = URF.Core.EF.Trackable.Entities.Message.Message;
using UserLogin = Microsoft.AspNetCore.Identity.IdentityUserLogin<int>;
using UserToken = Microsoft.AspNetCore.Identity.IdentityUserToken<int>;

namespace Pace.Api.Data
{
    public class PaceContext : IdentityDbContext<User, Role, int, UserClaim, UserRole, UserLogin, RoleClaim, UserToken>
    {
        public PaceContext(DbContextOptions<PaceContext> options) : base(options) { }

        // ── Framework core ────────────────────────────────────────────────────
        public DbSet<Audit> Audits { get; set; }
        public DbSet<Notify> Notifies { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<UserTeam> UserTeams { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<LinkPermission> LinkPermissions { get; set; }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }
        public DbSet<EmailSent> EmailSents { get; set; }
        public DbSet<SmtpAccount> SmtpAccounts { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<LanguageDetail> LanguageDetails { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<LogActivity> LogActivities { get; set; }
        public DbSet<LogException> LogExceptions { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<RequestFilter> RequestFilters { get; set; }
        public DbSet<Category> Categories { get; set; }

        // ── Pace app entities ─────────────────────────────────────────────────
        public DbSet<TransactionCategory> TransactionCategories { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<SavingGoal> SavingGoals { get; set; }
        public DbSet<Debt> Debts { get; set; }
        public DbSet<Goal> Goals { get; set; }
        public DbSet<GoalLog> GoalLogs { get; set; }
        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitLog> HabitLogs { get; set; }
        public DbSet<Reminder> Reminders { get; set; }
        public DbSet<Journal> Journals { get; set; }

        protected override void OnModelCreating(ModelBuilder m)
        {
            base.OnModelCreating(m);

            // ── Identity table names ──────────────────────────────────────────
            m.Entity<User>().ToTable("User");
            m.Entity<Role>().ToTable("Role");
            m.Entity<UserRole>().ToTable("UserRole");
            m.Entity<UserClaim>().ToTable("UserClaim");
            m.Entity<RoleClaim>().ToTable("RoleClaim");
            m.Entity<UserLogin>().ToTable("AspNetUserLogins");
            m.Entity<UserToken>().ToTable("AspNetUserTokens");

            // ── User ──────────────────────────────────────────────────────────
            m.Entity<User>(e =>
            {
                e.Property(x => x.TenantId).HasMaxLength(100);
                e.HasIndex(x => x.TenantId);
                e.HasMany(x => x.ChildUsers).WithOne(x => x.Parent)
                    .HasForeignKey(x => x.ParentId).OnDelete(DeleteBehavior.Restrict);
            });

            // ── Role ──────────────────────────────────────────────────────────
            m.Entity<Role>(e =>
            {
                e.Property(x => x.Code).HasMaxLength(50);
                e.Property(x => x.Description).HasMaxLength(1000);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            // ── UserRole (Identity junction) ──────────────────────────────────
            m.Entity<UserRole>(e =>
            {
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            // ── Framework entities ────────────────────────────────────────────
            m.Entity<Audit>(e =>
            {
                e.ToTable("Audit"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.HasOne(d => d.User).WithMany(u => u.Audits)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Notify>(e =>
            {
                e.ToTable("Notify"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.HasOne(d => d.User).WithMany(u => u.Notifies)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Department>(e =>
            {
                e.ToTable("Department"); e.HasKey(x => x.Id);
                e.Property(x => x.Name).HasMaxLength(250);
                e.Property(x => x.Code).HasMaxLength(50);
                e.HasOne(d => d.Parent).WithMany(p => p.Childs)
                    .HasForeignKey(d => d.ParentId).HasConstraintName("FK_Departments_ParentId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Team>(e =>
            {
                e.ToTable("Team"); e.HasKey(x => x.Id);
                e.Property(x => x.Name).HasMaxLength(250);
                e.Property(x => x.Code).HasMaxLength(50);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<UserTeam>(e =>
            {
                e.ToTable("UserTeam"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId); e.HasIndex(x => x.TeamId);
                e.HasOne(d => d.User).WithMany(u => u.UserTeams)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Team).WithMany(t => t.UserTeams)
                    .HasForeignKey(d => d.TeamId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Permission>(e =>
            {
                e.ToTable("Permission"); e.HasKey(x => x.Id);
                e.Property(x => x.Name).HasMaxLength(250);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<UserPermission>(e =>
            {
                e.ToTable("UserPermission"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId); e.HasIndex(x => x.PermissionId);
                e.HasOne(d => d.User).WithMany(u => u.UserPermissions)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Permission).WithMany(p => p.UserPermissions)
                    .HasForeignKey(d => d.PermissionId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<RolePermission>(e =>
            {
                e.ToTable("RolePermission"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.RoleId); e.HasIndex(x => x.PermissionId);
                e.HasOne(d => d.Role).WithMany(r => r.RolePermissions)
                    .HasForeignKey(d => d.RoleId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                    .HasForeignKey(d => d.PermissionId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<LinkPermission>(e =>
            {
                e.ToTable("LinkPermission"); e.HasKey(x => x.Id);
                e.Property(x => x.Name).HasMaxLength(250);
                e.Property(x => x.Link).HasMaxLength(500);
                e.HasOne(d => d.Parent).WithMany()
                    .HasForeignKey(d => d.ParentId).HasConstraintName("FK_LinkPermissions_ParentId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Permission).WithMany(p => p.LinkPermissions)
                    .HasForeignKey(d => d.PermissionId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<SmtpAccount>(e =>
            {
                e.ToTable("SmtpAccount"); e.HasKey(x => x.Id);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<EmailTemplate>(e =>
            {
                e.ToTable("EmailTemplate"); e.HasKey(x => x.Id);
                e.Property(x => x.Title).HasMaxLength(250);
                e.HasOne(d => d.SmtpAccount).WithMany(s => s.EmailTemplates)
                    .HasForeignKey(d => d.SmtpAccountId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<EmailSent>(e =>
            {
                e.ToTable("EmailSent"); e.HasKey(x => x.Id);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Language>(e =>
            {
                e.ToTable("Language"); e.HasKey(x => x.Id);
                e.Property(x => x.Name).HasMaxLength(250);
                e.Property(x => x.Code).HasMaxLength(20);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<LanguageDetail>(e =>
            {
                e.ToTable("LanguageDetail"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.LanguageId); e.HasIndex(x => x.ObjectId);
                e.Property(x => x.Table).HasMaxLength(100);
                e.Property(x => x.Property).HasMaxLength(100);
                e.HasOne(d => d.Language).WithMany(l => l.LanguageDetails)
                    .HasForeignKey(d => d.LanguageId).HasConstraintName("FK_LanguageDetails_LanguageId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Folder>(e =>
            {
                e.ToTable("Folder"); e.HasKey(x => x.Id);
                e.Property(x => x.Name).HasMaxLength(500);
                e.HasOne(d => d.Parent).WithMany(p => p.Folders)
                    .HasForeignKey(d => d.ParentId).HasConstraintName("FK_Folders_ParentId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<File>(e =>
            {
                e.ToTable("File"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.FolderId);
                e.Property(x => x.Name).HasMaxLength(500);
                e.Property(x => x.Extension).HasMaxLength(20);
                e.HasOne(d => d.Folder).WithMany(p => p.Files)
                    .HasForeignKey(d => d.FolderId).HasConstraintName("FK_Files_FolderId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Group>(e =>
            {
                e.ToTable("Group"); e.HasKey(x => x.Id);
                e.Property(x => x.Name).HasMaxLength(250);
                e.HasOne(d => d.User).WithMany(u => u.Groups)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Message>(e =>
            {
                e.ToTable("Message"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.GroupId);
                e.HasOne(d => d.Group).WithMany(g => g.Messages)
                    .HasForeignKey(d => d.GroupId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Team).WithMany(t => t.Messages)
                    .HasForeignKey(d => d.TeamId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Send).WithMany(u => u.SendMessages)
                    .HasForeignKey(d => d.SendId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Receive).WithMany(u => u.ReceiveMessages)
                    .HasForeignKey(d => d.ReceiveId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<UserGroup>(e =>
            {
                e.ToTable("UserGroup"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId); e.HasIndex(x => x.GroupId);
                e.HasOne(d => d.User).WithMany(u => u.UserGroups)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Group).WithMany(g => g.UserGroups)
                    .HasForeignKey(d => d.GroupId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<LogActivity>(e =>
            {
                e.ToTable("LogActivity"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.Property(x => x.Url).HasMaxLength(500);
                e.Property(x => x.Method).HasMaxLength(10);
                e.Property(x => x.Action).HasMaxLength(250);
                e.Property(x => x.Controller).HasMaxLength(250);
                e.HasOne(d => d.User).WithMany(u => u.LogActivities)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<LogException>(e =>
            {
                e.ToTable("LogException"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.HasOne(d => d.User).WithMany(u => u.LogExceptions)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<UserActivity>(e =>
            {
                e.ToTable("UserActivity"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.HasOne(d => d.User).WithMany(u => u.Activities)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<RequestFilter>(e =>
            {
                e.ToTable("RequestFilter"); e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.Property(x => x.Name).HasMaxLength(250);
                e.Property(x => x.Controller).HasMaxLength(250);
                e.HasOne(d => d.User).WithMany(u => u.RequestFilters)
                    .HasForeignKey(d => d.UserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Category>(e =>
            {
                e.ToTable("Category"); e.HasKey(x => x.Id);
                e.Property(x => x.Name).HasMaxLength(250);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            // ── Pace entities ─────────────────────────────────────────────────
            m.Entity<TransactionCategory>(e =>
            {
                e.ToTable("transaction_category");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.Property(x => x.Name).IsRequired().HasMaxLength(100);
                e.Property(x => x.Icon).HasMaxLength(50);
                e.Property(x => x.Color).HasMaxLength(20);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_TransactionCategories_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Transaction>(e =>
            {
                e.ToTable("transaction");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.HasIndex(x => x.CategoryId);
                e.HasIndex(x => x.TransactionDate);
                e.Property(x => x.Amount).HasColumnType("decimal(18,2)");
                e.Property(x => x.Note).HasMaxLength(500);
                e.Property(x => x.Tags).HasMaxLength(200);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_Transactions_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.Category).WithMany()
                    .HasForeignKey(d => d.CategoryId).HasConstraintName("FK_Transactions_CategoryId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<SavingGoal>(e =>
            {
                e.ToTable("saving_goal");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.Property(x => x.Name).IsRequired().HasMaxLength(200);
                e.Property(x => x.Icon).HasMaxLength(50);
                e.Property(x => x.Color).HasMaxLength(20);
                e.Property(x => x.TargetAmount).HasColumnType("decimal(18,2)");
                e.Property(x => x.CurrentAmount).HasColumnType("decimal(18,2)");
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_SavingGoals_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Debt>(e =>
            {
                e.ToTable("debt");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.Property(x => x.PersonName).IsRequired().HasMaxLength(200);
                e.Property(x => x.Amount).HasColumnType("decimal(18,2)");
                e.Property(x => x.Note).HasMaxLength(500);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_Debts_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Goal>(e =>
            {
                e.ToTable("goal");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.Property(x => x.Name).IsRequired().HasMaxLength(200);
                e.Property(x => x.Description).HasMaxLength(1000);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_Goals_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<GoalLog>(e =>
            {
                e.ToTable("goal_log");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.GoalId);
                e.HasIndex(x => x.UserId);
                e.HasIndex(x => x.LogDate);
                e.Property(x => x.Note).HasMaxLength(500);
                e.HasOne(d => d.Goal).WithMany(p => p.GoalLogs)
                    .HasForeignKey(d => d.GoalId).HasConstraintName("FK_GoalLogs_GoalId").OnDelete(DeleteBehavior.Cascade);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_GoalLogs_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Habit>(e =>
            {
                e.ToTable("habit");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.Property(x => x.Name).IsRequired().HasMaxLength(200);
                e.Property(x => x.Icon).HasMaxLength(50);
                e.Property(x => x.Color).HasMaxLength(20);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_Habits_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<HabitLog>(e =>
            {
                e.ToTable("habit_log");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.HabitId);
                e.HasIndex(x => x.UserId);
                e.HasIndex(x => x.LogDate);
                e.Property(x => x.Note).HasMaxLength(200);
                e.HasOne(d => d.Habit).WithMany(p => p.HabitLogs)
                    .HasForeignKey(d => d.HabitId).HasConstraintName("FK_HabitLogs_HabitId").OnDelete(DeleteBehavior.Cascade);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_HabitLogs_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Reminder>(e =>
            {
                e.ToTable("reminder");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.Property(x => x.Title).IsRequired().HasMaxLength(200);
                e.Property(x => x.DaysOfWeek).HasMaxLength(20);
                e.Property(x => x.ReminderTime).HasMaxLength(10);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_Reminders_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });

            m.Entity<Journal>(e =>
            {
                e.ToTable("journal");
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
                e.HasIndex(x => x.JournalDate);
                e.Property(x => x.Title).IsRequired().HasMaxLength(300);
                e.Property(x => x.Tags).HasMaxLength(500);
                e.Property(x => x.CoverEmoji).HasMaxLength(10);
                e.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId).HasConstraintName("FK_Journals_UserId").OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.CreatedByUser).WithMany().HasForeignKey(c => c.CreatedBy).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(d => d.UpdatedByUser).WithMany().HasForeignKey(c => c.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
