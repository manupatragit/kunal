namespace DataAccess.Modals
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class ApplicationContext : DbContext
    {
        public ApplicationContext()
            : base("name=ApplicationContext")
        {
        }

        public virtual DbSet<CaseType> CaseTypes { get; set; }
        public virtual DbSet<ConfigurationType> ConfigurationTypes { get; set; }
        public virtual DbSet<CustomField> CustomFields { get; set; }
        public virtual DbSet<FirmCas> FirmCases { get; set; }
        public virtual DbSet<FirmCaseTeam> FirmCaseTeams { get; set; }
        public virtual DbSet<FirmConfiguredCustomField> FirmConfiguredCustomFields { get; set; }
        public virtual DbSet<FirmCustomForm> FirmCustomForms { get; set; }
        public virtual DbSet<FirmDefaultCustomField> FirmDefaultCustomFields { get; set; }
        public virtual DbSet<FirmEvent> FirmEvents { get; set; }
        public virtual DbSet<FirmInformationDetail> FirmInformationDetails { get; set; }
        public virtual DbSet<Firm> Firms { get; set; }
        public virtual DbSet<FirmTask> FirmTasks { get; set; }
        public virtual DbSet<FirmUserNote> FirmUserNotes { get; set; }
        public virtual DbSet<FirmUserPermission> FirmUserPermissions { get; set; }
        public virtual DbSet<FirmUser> FirmUsers { get; set; }
        public virtual DbSet<FirmWorkFlowAttachItemDetail> FirmWorkFlowAttachItemDetails { get; set; }
        public virtual DbSet<FirmWorkFlowAttachItem> FirmWorkFlowAttachItems { get; set; }
        public virtual DbSet<FirmWorkflow> FirmWorkflows { get; set; }
        public virtual DbSet<FirmWorkingHour> FirmWorkingHours { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<ModuleFieldInformation> ModuleFieldInformations { get; set; }

        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<CaseType>()
        //        .Property(e => e.CaseType1)
        //        .IsUnicode(false);

        //    //modelBuilder.Entity<CaseType>()
        //    //    .HasMany(e => e.FirmCases)
        //    //    .WithOptional(e => e.CaseType1)
        //    //    .HasForeignKey(e => e.CaseType);

        //    modelBuilder.Entity<ConfigurationType>()
        //        .Property(e => e.Type)
        //        .IsUnicode(false);

        //    //modelBuilder.Entity<ConfigurationType>()
        //    //    .HasMany(e => e.FirmConfiguredCustomFields)
        //    //    .WithRequired(e => e.ConfigurationType1)
        //    //    .HasForeignKey(e => e.ConfigurationType)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<ConfigurationType>()
        //    //    .HasMany(e => e.FirmDefaultCustomFields)
        //    //    .WithRequired(e => e.ConfigurationType1)
        //    //    .HasForeignKey(e => e.ConfigurationType)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<ConfigurationType>()
        //    //    .HasMany(e => e.FirmInformationDetails)
        //    //    .WithRequired(e => e.ConfigurationType)
        //    //    .HasForeignKey(e => e.ConfType)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<ConfigurationType>()
        //    //    .HasMany(e => e.FirmWorkFlowAttachItems)
        //    //    .WithRequired(e => e.ConfigurationType)
        //    //    .HasForeignKey(e => e.ConfType)
        //    //    .WillCascadeOnDelete(false);

        //    modelBuilder.Entity<CustomField>()
        //        .Property(e => e.Text)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<CustomField>()
        //        .Property(e => e.DefaultValues)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<CustomField>()
        //        .Property(e => e.Formatter)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<CustomField>()
        //        .Property(e => e.Url)
        //        .IsUnicode(false);

        //    //modelBuilder.Entity<CustomField>()
        //    //    .HasMany(e => e.FirmConfiguredCustomFields)
        //    //    .WithRequired(e => e.CustomField)
        //    //    .HasForeignKey(e => e.FieldType)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<FirmCas>()
        //    //    .HasMany(e => e.FirmCaseTeams)
        //    //    .WithRequired(e => e.FirmCas)
        //    //    .HasForeignKey(e => e.CaseId)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<FirmCas>()
        //    //    .HasMany(e => e.FirmUserNotes)
        //    //    .WithOptional(e => e.FirmCas)
        //    //    .HasForeignKey(e => e.CaseId);

        //    //modelBuilder.Entity<FirmCas>()
        //    //    .HasMany(e => e.FirmUserPermissions)
        //    //    .WithOptional(e => e.FirmCas)
        //    //    .HasForeignKey(e => e.CaseId);

        //    modelBuilder.Entity<Firm>()
        //        .Property(e => e.FirmCode)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<Firm>()
        //        .Property(e => e.FirmContactno)
        //        .IsFixedLength();

        //    //modelBuilder.Entity<Firm>()
        //    //    .HasMany(e => e.FirmCases)
        //    //    .WithRequired(e => e.Firm)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<Firm>()
        //    //    .HasMany(e => e.FirmConfiguredCustomFields)
        //    //    .WithRequired(e => e.Firm)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<Firm>()
        //    //    .HasMany(e => e.FirmUsers)
        //    //    .WithRequired(e => e.Firm)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<Firm>()
        //    //    .HasMany(e => e.FirmWorkingHours)
        //    //    .WithRequired(e => e.Firm)
        //    //    .WillCascadeOnDelete(false);

        //    modelBuilder.Entity<FirmUserNote>()
        //        .Property(e => e.Note)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<FirmUserPermission>()
        //        .Property(e => e.Module)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<FirmUserPermission>()
        //        .Property(e => e.AccessRight)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<FirmUser>()
        //        .Property(e => e.UserName)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<FirmUser>()
        //        .Property(e => e.Password)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<FirmUser>()
        //        .Property(e => e.DefaultController)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<FirmUser>()
        //        .Property(e => e.DefaultAction)
        //        .IsUnicode(false);

        //    //modelBuilder.Entity<FirmUser>()
        //    //    .HasMany(e => e.FirmCaseTeams)
        //    //    .WithRequired(e => e.FirmUser)
        //    //    .HasForeignKey(e => e.UserId)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<FirmUser>()
        //    //    .HasMany(e => e.FirmEvents)
        //    //    .WithRequired(e => e.FirmUser)
        //    //    .HasForeignKey(e => e.UserId)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<FirmUser>()
        //    //    .HasMany(e => e.FirmTasks)
        //    //    .WithRequired(e => e.FirmUser)
        //    //    .HasForeignKey(e => e.UserId)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<FirmUser>()
        //    //    .HasMany(e => e.FirmUserNotes)
        //    //    .WithRequired(e => e.FirmUser)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<FirmUser>()
        //    //    .HasMany(e => e.FirmUserPermissions)
        //    //    .WithRequired(e => e.FirmUser)
        //    //    .HasForeignKey(e => e.UserId)
        //    //    .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<FirmWorkflow>()
        //    //    .HasMany(e => e.FirmWorkFlowAttachItems)
        //    //    .WithRequired(e => e.FirmWorkflow)
        //    //    .HasForeignKey(e => e.WorkFlowId)
        //    //    .WillCascadeOnDelete(false);

        //    modelBuilder.Entity<FirmWorkingHour>()
        //        .Property(e => e.StartTime)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<FirmWorkingHour>()
        //        .Property(e => e.EndTime)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<Role>()
        //        .Property(e => e.RoleName)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<Role>()
        //        .Property(e => e.IsActive)
        //        .IsFixedLength()
        //        .IsUnicode(false);

        //    modelBuilder.Entity<User>()
        //        .Property(e => e.FirstName)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<User>()
        //        .Property(e => e.LastName)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<User>()
        //        .Property(e => e.Gender)
        //        .IsFixedLength()
        //        .IsUnicode(false);

        //    modelBuilder.Entity<User>()
        //        .Property(e => e.MobileNumber)
        //        .IsFixedLength();

        //    modelBuilder.Entity<User>()
        //        .Property(e => e.EmailAddress)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<User>()
        //        .Property(e => e.UserName)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<User>()
        //        .Property(e => e.Password)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<ModuleFieldInformation>()
        //        .Property(e => e.Formatter)
        //        .IsUnicode(false);

        //    modelBuilder.Entity<ModuleFieldInformation>()
        //        .Property(e => e.Url)
        //        .IsUnicode(false);
        //}
    }
}
