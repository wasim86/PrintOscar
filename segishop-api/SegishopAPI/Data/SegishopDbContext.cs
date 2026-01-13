using Microsoft.EntityFrameworkCore;
using SegishopAPI.Models;

namespace SegishopAPI.Data
{
    public class SegishopDbContext : DbContext
    {
        public SegishopDbContext(DbContextOptions<SegishopDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductAttribute> ProductAttributes { get; set; }
        public DbSet<ProductReview> ProductReviews { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<PaymentRecord> PaymentRecords { get; set; }
        public DbSet<CustomerPaymentMethod> CustomerPaymentMethods { get; set; }
        public DbSet<OrderStatusHistory> OrderStatusHistory { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<CouponUsage> CouponUsages { get; set; }
        public DbSet<FilterOption> FilterOptions { get; set; }
        public DbSet<FilterOptionValue> FilterOptionValues { get; set; }
        public DbSet<ProductFilterValue> ProductFilterValues { get; set; }
        public DbSet<NewsletterSubscription> NewsletterSubscriptions { get; set; }
        public DbSet<ContactSubmission> ContactSubmissions { get; set; }
        public DbSet<HandmadeInquiry> HandmadeInquiries { get; set; }
        public DbSet<PaymentGatewaySettings> PaymentGatewaySettings { get; set; }
        public DbSet<SiteBannerSettings> SiteBannerSettings { get; set; }
        public DbSet<ShopLocalPageSettings> ShopLocalPageSettings { get; set; }
        public DbSet<ShopLocalLocation> ShopLocalLocations { get; set; }
        public DbSet<ShopLocalMedia> ShopLocalMedia { get; set; }
        public DbSet<ShopLocalV2Settings> ShopLocalV2Settings { get; set; }
        public DbSet<ShopLocalV2Event> ShopLocalV2Events { get; set; }
        public DbSet<ShopLocalV2Media> ShopLocalV2Media { get; set; }
        public DbSet<SocialIntegrationSettings> SocialIntegrationSettings { get; set; }

        // Product detail enhancement entities
        public DbSet<ProductHighlight> ProductHighlights { get; set; }

        // Dynamic Configuration System
        public DbSet<ConfigurationType> ConfigurationTypes { get; set; }
        public DbSet<ConfigurationOption> ConfigurationOptions { get; set; }
        public DbSet<CategoryConfigurationTemplate> CategoryConfigurationTemplates { get; set; }
        public DbSet<ProductConfigurationOverride> ProductConfigurationOverrides { get; set; }
        public DbSet<OrderItemConfiguration> OrderItemConfigurations { get; set; }

        // Shipping System
        public DbSet<ShippingZone> ShippingZones { get; set; }
        public DbSet<ShippingZoneRegion> ShippingZoneRegions { get; set; }
        public DbSet<ShippingMethod> ShippingMethods { get; set; }
        public DbSet<ShippingZoneMethod> ShippingZoneMethods { get; set; }
        public DbSet<ShippingClass> ShippingClasses { get; set; }
        public DbSet<ShippingClassCost> ShippingClassCosts { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Role).HasDefaultValue("Customer");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // UserAddress configuration
            modelBuilder.Entity<UserAddress>(entity =>
            {
                entity.Property(e => e.IsDefault).HasDefaultValue(false);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Product configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasIndex(e => e.SKU).IsUnique();
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.SalePrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.IsFeatured).HasDefaultValue(false);
                entity.Property(e => e.Stock).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.Children)
                    .HasForeignKey(d => d.ParentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ProductImage configuration
            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Images)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ProductAttribute configuration
            modelBuilder.Entity<ProductAttribute>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductAttributes)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasIndex(e => e.OrderNumber).IsUnique();
                entity.Property(e => e.SubTotal).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ShippingAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).HasDefaultValue("Pending");
                entity.Property(e => e.PaymentStatus).HasDefaultValue("Pending");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // OrderItem configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<PaymentGatewaySettings>(entity =>
            {
                entity.Property(e => e.StripeEnabled).HasDefaultValue(false);
                entity.Property(e => e.PayPalEnabled).HasDefaultValue(false);
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            modelBuilder.Entity<SiteBannerSettings>(entity =>
            {
                entity.Property(e => e.Enabled).HasDefaultValue(true);
                entity.Property(e => e.Centered).HasDefaultValue(true);
                entity.Property(e => e.BackgroundColor).HasDefaultValue("#f4c363");
                entity.Property(e => e.TextColor).HasDefaultValue("#1f2937");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            modelBuilder.Entity<ShopLocalPageSettings>(entity =>
            {
                entity.Property(e => e.Headline).HasDefaultValue("Shop Local");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            modelBuilder.Entity<ShopLocalLocation>(entity =>
            {
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.Group).HasDefaultValue("weekly");
            });

            modelBuilder.Entity<ShopLocalMedia>(entity =>
            {
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.Group).HasDefaultValue("thankyou");
            });

            modelBuilder.Entity<ShopLocalV2Settings>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            modelBuilder.Entity<ShopLocalV2Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.Type).HasDefaultValue("weekly");
            });

            modelBuilder.Entity<ShopLocalV2Media>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.Category).HasDefaultValue("market");
            });

            modelBuilder.Entity<SocialIntegrationSettings>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // PaymentRecord configuration
            modelBuilder.Entity<PaymentRecord>(entity =>
            {
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.PaymentRecords)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.RefundedFromPayment)
                    .WithMany(p => p.Refunds)
                    .HasForeignKey(d => d.RefundedFromPaymentId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.TransactionId);
                entity.HasIndex(e => e.PaymentIntentId);
                entity.HasIndex(e => e.OrderId);
            });

            // OrderStatusHistory configuration
            modelBuilder.Entity<OrderStatusHistory>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.StatusHistory)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.OrderId);
                entity.HasIndex(e => e.CreatedAt);
            });

            // CartItem configuration
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.CartItems)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.CartItems)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Unique constraint for user + product + attributes
                entity.HasIndex(e => new { e.UserId, e.ProductId, e.ProductAttributes }).IsUnique();
            });

            // PasswordResetToken configuration
            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.Property(e => e.Token).IsRequired();
                entity.Property(e => e.ExpiresAt).IsRequired();
                entity.Property(e => e.IsUsed).HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.User)
                    .WithMany()
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Index for faster token lookups
                entity.HasIndex(e => e.Token);
                entity.HasIndex(e => new { e.Token, e.IsUsed, e.ExpiresAt });
            });

        // NewsletterSubscription configuration
        modelBuilder.Entity<NewsletterSubscription>(entity =>
        {
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SubscribedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Index for faster email lookups
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => new { e.Email, e.IsActive });
        });

        // ContactSubmission configuration
        modelBuilder.Entity<ContactSubmission>(entity =>
        {
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.Subject).IsRequired();
            entity.Property(e => e.Message).IsRequired();
            entity.Property(e => e.HearAbout).IsRequired();
            entity.Property(e => e.IsResponded).HasDefaultValue(false);
            entity.Property(e => e.Status).HasDefaultValue("New");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Indexes for faster queries
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => new { e.Status, e.IsResponded });
        });

        // HandmadeInquiry configuration
        modelBuilder.Entity<HandmadeInquiry>(entity =>
        {
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.Phone).IsRequired();
            entity.Property(e => e.PreferredContact).IsRequired();
            entity.Property(e => e.ItemType).IsRequired();
            entity.Property(e => e.DetailedPreferences).IsRequired();
            entity.Property(e => e.CountryCode).HasDefaultValue("+1");
            entity.Property(e => e.PreferredContact).HasDefaultValue("email");
            entity.Property(e => e.FunKitFill).HasDefaultValue(false);
            entity.Property(e => e.CustomLabels).HasDefaultValue(false);
            entity.Property(e => e.IsResponded).HasDefaultValue(false);
            entity.Property(e => e.Status).HasDefaultValue("New");
            entity.Property(e => e.QuotedPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

            // Indexes for faster queries
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.ItemType);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => new { e.Status, e.IsResponded });
        });

            // FilterOption configuration
            modelBuilder.Entity<FilterOption>(entity =>
            {
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.FilterType).IsRequired();
                entity.Property(e => e.MinValue).HasColumnType("decimal(18,2)");
                entity.Property(e => e.MaxValue).HasColumnType("decimal(18,2)");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.FilterOptions)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => new { e.CategoryId, e.Name });
            });

            // FilterOptionValue configuration
            modelBuilder.Entity<FilterOptionValue>(entity =>
            {
                entity.Property(e => e.Value).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.FilterOption)
                    .WithMany(p => p.FilterOptionValues)
                    .HasForeignKey(d => d.FilterOptionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => new { e.FilterOptionId, e.Value });
            });

            // ProductFilterValue configuration
            modelBuilder.Entity<ProductFilterValue>(entity =>
            {
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductFilterValues)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.FilterOption)
                    .WithMany(p => p.ProductFilterValues)
                    .HasForeignKey(d => d.FilterOptionId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.FilterOptionValue)
                    .WithMany(p => p.ProductFilterValues)
                    .HasForeignKey(d => d.FilterOptionValueId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(e => new { e.ProductId, e.FilterOptionId });
            });

            // ProductHighlight configuration
            modelBuilder.Entity<ProductHighlight>(entity =>
            {
                entity.Property(e => e.Highlight).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Highlights)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.ProductId);
            });

            // Dynamic Configuration System

            // ConfigurationType configuration
            modelBuilder.Entity<ConfigurationType>(entity =>
            {
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.IsRequired).HasDefaultValue(false);
                entity.Property(e => e.ShowPriceImpact).HasDefaultValue(false);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => new { e.Type, e.IsActive });
            });

            // ConfigurationOption configuration
            modelBuilder.Entity<ConfigurationOption>(entity =>
            {
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Value).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PriceModifier).HasColumnType("decimal(10,2)").HasDefaultValue(0);
                entity.Property(e => e.PriceType).IsRequired().HasMaxLength(20).HasDefaultValue("fixed");
                entity.Property(e => e.IsDefault).HasDefaultValue(false);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.ConfigurationType)
                    .WithMany(p => p.Options)
                    .HasForeignKey(d => d.ConfigurationTypeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.ConfigurationTypeId);
                entity.HasIndex(e => new { e.ConfigurationTypeId, e.SortOrder });
            });

            // CategoryConfigurationTemplate configuration
            modelBuilder.Entity<CategoryConfigurationTemplate>(entity =>
            {
                entity.Property(e => e.IsRequired).HasDefaultValue(false);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.InheritToSubcategories).HasDefaultValue(true);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.ConfigurationTemplates)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.ConfigurationType)
                    .WithMany(p => p.CategoryTemplates)
                    .HasForeignKey(d => d.ConfigurationTypeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.CategoryId);
                entity.HasIndex(e => e.ConfigurationTypeId);
                entity.HasIndex(e => new { e.CategoryId, e.ConfigurationTypeId }).IsUnique();
            });

            // ProductConfigurationOverride configuration
            modelBuilder.Entity<ProductConfigurationOverride>(entity =>
            {
                entity.Property(e => e.OverrideType).IsRequired().HasMaxLength(20).HasDefaultValue("inherit");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ConfigurationOverrides)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.ConfigurationType)
                    .WithMany(p => p.ProductOverrides)
                    .HasForeignKey(d => d.ConfigurationTypeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.ProductId);
                entity.HasIndex(e => e.ConfigurationTypeId);
                entity.HasIndex(e => new { e.ProductId, e.ConfigurationTypeId }).IsUnique();
            });

            // OrderItemConfiguration configuration
            modelBuilder.Entity<OrderItemConfiguration>(entity =>
            {
                entity.Property(e => e.CustomValue).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.OrderItem)
                    .WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.OrderItemId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.ConfigurationType)
                    .WithMany()
                    .HasForeignKey(d => d.ConfigurationTypeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.ConfigurationOption)
                    .WithMany()
                    .HasForeignKey(d => d.ConfigurationOptionId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(e => e.OrderItemId);
                entity.HasIndex(e => e.ConfigurationTypeId);
            });

            // Shipping Zone configuration
            modelBuilder.Entity<ShippingZone>(entity =>
            {
                entity.Property(e => e.IsEnabled).HasDefaultValue(true);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Shipping Zone Region configuration
            modelBuilder.Entity<ShippingZoneRegion>(entity =>
            {
                entity.Property(e => e.IsIncluded).HasDefaultValue(true);
                entity.Property(e => e.Priority).HasDefaultValue(0);

                entity.HasOne(d => d.ShippingZone)
                    .WithMany(p => p.Regions)
                    .HasForeignKey(d => d.ShippingZoneId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Shipping Method configuration
            modelBuilder.Entity<ShippingMethod>(entity =>
            {
                entity.Property(e => e.IsEnabled).HasDefaultValue(true);
                entity.Property(e => e.IsTaxable).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Shipping Zone Method configuration
            modelBuilder.Entity<ShippingZoneMethod>(entity =>
            {
                entity.Property(e => e.IsEnabled).HasDefaultValue(true);
                entity.Property(e => e.SortOrder).HasDefaultValue(0);
                entity.Property(e => e.BaseCost).HasDefaultValue(0m);
                entity.Property(e => e.RequiresCoupon).HasDefaultValue(false);

                entity.HasOne(d => d.ShippingZone)
                    .WithMany(p => p.Methods)
                    .HasForeignKey(d => d.ShippingZoneId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.ShippingMethod)
                    .WithMany(p => p.ZoneMethods)
                    .HasForeignKey(d => d.ShippingMethodId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Shipping Class configuration
            modelBuilder.Entity<ShippingClass>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Shipping Class Cost configuration
            modelBuilder.Entity<ShippingClassCost>(entity =>
            {
                entity.Property(e => e.Cost).HasDefaultValue(0m);
                entity.Property(e => e.CostType).HasDefaultValue("Fixed");

                entity.HasOne(d => d.ShippingZoneMethod)
                    .WithMany(p => p.ClassCosts)
                    .HasForeignKey(d => d.ShippingZoneMethodId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.ShippingClass)
                    .WithMany(p => p.ClassCosts)
                    .HasForeignKey(d => d.ShippingClassId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Update Product configuration for shipping class
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasOne(d => d.ShippingClass)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.ShippingClassId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Update Order configuration for shipping method
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(d => d.ShippingZoneMethod)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.ShippingZoneMethodId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Seed data
            SeedData(modelBuilder);

            // Seed shipping data
            ShippingSeedData.SeedShippingData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Electronics", Description = "Electronic devices and gadgets", Slug = "electronics", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 2, Name = "Clothing", Description = "Fashion and apparel", Slug = "clothing", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 3, Name = "Books", Description = "Books and literature", Slug = "books", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 4, Name = "Home & Garden", Description = "Home improvement and gardening", Slug = "home-garden", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );

            // Seed Admin User
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    Email = "admin@printoscar.com", 
                    FirstName = "Admin", 
                    LastName = "User", 
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"), 
                    Role = "Admin", 
                    CreatedAt = DateTime.UtcNow, 
                    UpdatedAt = DateTime.UtcNow 
                }
            );

            // Coupon configuration
            modelBuilder.Entity<Coupon>(entity =>
            {
                entity.Property(e => e.Code).IsRequired();
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Value).HasColumnType("decimal(10,2)");
                entity.Property(e => e.MinimumOrderAmount).HasColumnType("decimal(10,2)");
                entity.Property(e => e.MaximumDiscountAmount).HasColumnType("decimal(10,2)");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.IsFirstOrderOnly).HasDefaultValue(false);
                entity.Property(e => e.CurrentTotalUses).HasDefaultValue(0);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasIndex(e => e.Code).IsUnique();
                entity.HasIndex(e => new { e.IsActive, e.ValidFrom, e.ValidUntil });
            });

            // CouponUsage configuration
            modelBuilder.Entity<CouponUsage>(entity =>
            {
                entity.Property(e => e.DiscountAmount).HasColumnType("decimal(10,2)");
                entity.Property(e => e.OrderSubtotal).HasColumnType("decimal(10,2)");
                entity.Property(e => e.UsedAt).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Coupon)
                    .WithMany(p => p.CouponUsages)
                    .HasForeignKey(d => d.CouponId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.User)
                    .WithMany()
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.CouponUsages)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => new { e.CouponId, e.UserId });
                entity.HasIndex(e => e.OrderId);
            });

            // Seed coupons
            modelBuilder.Entity<Coupon>().HasData(
            new Coupon
            {
                Id = 1,
                Code = "FIRSTPRINTOSCAR10",
                Description = "10% discount on your first order",
                Type = CouponType.Percentage,
                Value = 10.00m,
                    MinimumOrderAmount = 25.00m,
                    MaximumDiscountAmount = 50.00m,
                    IsFirstOrderOnly = true,
                    IsActive = true,
                    ValidFrom = DateTime.UtcNow,
                    ValidUntil = DateTime.UtcNow.AddYears(1),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new Coupon
                {
                    Id = 2,
                    Code = "FREESHIP50",
                    Description = "Free shipping on orders over $50",
                    Type = CouponType.FreeShipping,
                    Value = 0.00m,
                    MinimumOrderAmount = 50.00m,
                    IsFirstOrderOnly = false,
                    IsActive = true,
                    ValidFrom = DateTime.UtcNow,
                    ValidUntil = DateTime.UtcNow.AddYears(1),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            );

            // Seed Shop Local V2 defaults
            modelBuilder.Entity<ShopLocalV2Settings>().HasData(
                new ShopLocalV2Settings { Id = 1, HeroTitle = "Shop Local", HeroSubtitle = "DMV Area" }
            );

            modelBuilder.Entity<ShopLocalV2Event>().HasData(
                // Seasonal
                new ShopLocalV2Event { Id = 1001, Title = "Fairfax Fall Festival", Schedule = "October (Sat 10/14)", Time = "All Day", Address = "Fairfax, Virginia", Type = "seasonal", MapEmbedUrl = "https://www.google.com/maps?q=Fairfax,Virginia&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/WmsevppVt97n9UiM6", SortOrder = 0, IsActive = true },
                new ShopLocalV2Event { Id = 1002, Title = "MONA Sip-N-Shop", Schedule = "November (Thur 11/16)", Time = "Evening Event", Address = "Knights of Columbus Hall, Maryland", Type = "seasonal", MapEmbedUrl = "https://www.google.com/maps?q=Knights+of+Columbus,Maryland&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/Viu8LBxqXtCbu6Qq6", SortOrder = 1, IsActive = true },
                new ShopLocalV2Event { Id = 1003, Title = "Falls Church Holiday Show", Schedule = "December (Sat-Sun 12/2-3)", Time = "Weekend Event", Address = "Falls Church Community Center, Virginia", Type = "seasonal", MapEmbedUrl = "https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/HgbQyHaantejcwaeA", SortOrder = 2, IsActive = true },
                // Annual
                new ShopLocalV2Event { Id = 1011, Title = "City Of Falls Church Memorial Day Parade And Festival", Schedule = "May (Mon 5/29)", Time = "All Day", Address = "Falls Church Community Center, Virginia", Type = "annual", MapEmbedUrl = "https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/RFvwW4sbUd8WPVLn8", SortOrder = 0, IsActive = true },
                new ShopLocalV2Event { Id = 1012, Title = "Falls Church City Festival", Schedule = "September (Sat 9/23)", Time = "All Day", Address = "Falls Church Community Center, Virginia", Type = "annual", MapEmbedUrl = "https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/RFvwW4sbUd8WPVLn8", SortOrder = 1, IsActive = true },
                new ShopLocalV2Event { Id = 1013, Title = "Clarendon Day", Schedule = "September (Sat 9/30)", Time = "All Day", Address = "Clarendon, Arlington, Virginia", Type = "annual", MapEmbedUrl = "https://www.google.com/maps?q=Clarendon,Arlington,Virginia&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/i7ZSQXQGSZSkWFsV7", SortOrder = 2, IsActive = true },
                // Weekly/Monthly
                new ShopLocalV2Event { Id = 1021, Title = "EatLoco Farmers Market At MetPark", Schedule = "Saturdays @ EatLoco Farmers Market At MetPark (9am-1pm)", Time = "9:00 AM - 1:00 PM", Address = "Metropolitan Park, Maryland", Type = "weekly", MapEmbedUrl = "https://www.google.com/maps?q=Metropolitan+Park,Maryland&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/MLewnwQeL7PPP4yk6", SortOrder = 0, IsActive = true },
                new ShopLocalV2Event { Id = 1022, Title = "West End Farmers Market", Schedule = "Sundays @ West End Farmers Market (8:30am-1pm)", Time = "8:30 AM - 1:00 PM", Address = "West End Farmers Market, Virginia", Type = "weekly", MapEmbedUrl = "https://www.google.com/maps?q=West+End+Village,Virginia&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/RoErobep1eBPt549A", SortOrder = 1, IsActive = true },
                new ShopLocalV2Event { Id = 1023, Title = "Del Ray Artisans, Vintage & Flea Market", Schedule = "2nd Saturdays @ Del Ray Artisans, Vintage & Flea Market (9am-2pm)", Time = "9:00 AM - 2:00 PM", Address = "1804 Mt Vernon Ave, Alexandria, VA 22301", Type = "monthly", MapEmbedUrl = "https://www.google.com/maps?q=Del+Ray,Alexandria,Virginia&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/qmFX5jCRedeohE3T7", SortOrder = 2, IsActive = true },
                // Stores
                new ShopLocalV2Event { Id = 1031, Title = "Food Star - Leesburg Pike", Schedule = "", Time = "Call for hours", Address = "Leesburg Pike, Virginia", Type = "store", MapEmbedUrl = "https://www.google.com/maps?q=Food+Star+Leesburg+Pike&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/NEy8tWKDqsVMNLQX7", SortOrder = 0, IsActive = true },
                new ShopLocalV2Event { Id = 1032, Title = "Weyone International", Schedule = "", Time = "Call for hours", Address = "Virginia", Type = "store", MapEmbedUrl = "https://www.google.com/maps?q=Weyone+International&output=embed", GoogleMapsLink = "https://maps.app.goo.gl/HgA2eGasPoYByu4r8", SortOrder = 1, IsActive = true }
            );

            modelBuilder.Entity<ShopLocalV2Media>().HasData(
                new ShopLocalV2Media { Id = 2001, ImageUrl = "https://segishop.com/wp-content/uploads/2022/04/20210607_234134-scaled.jpg", Caption = "Market Preparation", Category = "market", SortOrder = 0, IsActive = true },
                new ShopLocalV2Media { Id = 2002, ImageUrl = "https://segishop.com/wp-content/uploads/2022/01/20220112_071509v2-scaled-e1641992057434.jpg", Caption = "Fresh Start", Category = "market", SortOrder = 1, IsActive = true },
                new ShopLocalV2Media { Id = 2003, ImageUrl = "https://segishop.com/wp-content/uploads/2022/01/20211107_103617-scaled.jpg", Caption = "Community Connection", Category = "community", SortOrder = 2, IsActive = true }
            );

            modelBuilder.Entity<SocialIntegrationSettings>().HasData(
                new SocialIntegrationSettings { Id = 1, TikTokUsername = "thesegishop" }
            );
        }
    }
}
