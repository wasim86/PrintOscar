using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddShippingSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductConfigurations");

            migrationBuilder.DropTable(
                name: "ProductQuantitySets");

            migrationBuilder.DropTable(
                name: "VarietyBoxSnackOptions");

            migrationBuilder.DropTable(
                name: "ProductVarietyBoxOptions");

            migrationBuilder.AddColumn<int>(
                name: "ShippingClassId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingMethodTitle",
                table: "Orders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShippingZoneMethodId",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ConfigurationTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ShowPriceImpact = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfigurationTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShippingClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingClasses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShippingMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MethodType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsTaxable = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingMethods", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShippingZones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingZones", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoryConfigurationTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    ConfigurationTypeId = table.Column<int>(type: "int", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    InheritToSubcategories = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryConfigurationTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CategoryConfigurationTemplates_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoryConfigurationTemplates_ConfigurationTypes_ConfigurationTypeId",
                        column: x => x.ConfigurationTypeId,
                        principalTable: "ConfigurationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConfigurationOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConfigurationTypeId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PriceModifier = table.Column<decimal>(type: "decimal(10,2)", nullable: false, defaultValue: 0m),
                    PriceType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "fixed"),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfigurationOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConfigurationOptions_ConfigurationTypes_ConfigurationTypeId",
                        column: x => x.ConfigurationTypeId,
                        principalTable: "ConfigurationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductConfigurationOverrides",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ConfigurationTypeId = table.Column<int>(type: "int", nullable: false),
                    OverrideType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "inherit"),
                    CustomOptions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductConfigurationOverrides", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductConfigurationOverrides_ConfigurationTypes_ConfigurationTypeId",
                        column: x => x.ConfigurationTypeId,
                        principalTable: "ConfigurationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductConfigurationOverrides_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShippingZoneMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShippingZoneId = table.Column<int>(type: "int", nullable: false),
                    ShippingMethodId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    BaseCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    MinOrderAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MaxOrderAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EstimatedDaysMin = table.Column<int>(type: "int", nullable: true),
                    EstimatedDaysMax = table.Column<int>(type: "int", nullable: true),
                    RequiresCoupon = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingZoneMethods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShippingZoneMethods_ShippingMethods_ShippingMethodId",
                        column: x => x.ShippingMethodId,
                        principalTable: "ShippingMethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShippingZoneMethods_ShippingZones_ShippingZoneId",
                        column: x => x.ShippingZoneId,
                        principalTable: "ShippingZones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShippingZoneRegions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShippingZoneId = table.Column<int>(type: "int", nullable: false),
                    RegionType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    RegionCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    RegionName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsIncluded = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    Priority = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingZoneRegions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShippingZoneRegions_ShippingZones_ShippingZoneId",
                        column: x => x.ShippingZoneId,
                        principalTable: "ShippingZones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItemConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderItemId = table.Column<int>(type: "int", nullable: false),
                    ConfigurationTypeId = table.Column<int>(type: "int", nullable: false),
                    ConfigurationOptionId = table.Column<int>(type: "int", nullable: true),
                    CustomValue = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItemConfigurations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItemConfigurations_ConfigurationOptions_ConfigurationOptionId",
                        column: x => x.ConfigurationOptionId,
                        principalTable: "ConfigurationOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_OrderItemConfigurations_ConfigurationTypes_ConfigurationTypeId",
                        column: x => x.ConfigurationTypeId,
                        principalTable: "ConfigurationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItemConfigurations_OrderItems_OrderItemId",
                        column: x => x.OrderItemId,
                        principalTable: "OrderItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ShippingClassCosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShippingZoneMethodId = table.Column<int>(type: "int", nullable: false),
                    ShippingClassId = table.Column<int>(type: "int", nullable: false),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    CostType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Fixed")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShippingClassCosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShippingClassCosts_ShippingClasses_ShippingClassId",
                        column: x => x.ShippingClassId,
                        principalTable: "ShippingClasses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShippingClassCosts_ShippingZoneMethods_ShippingZoneMethodId",
                        column: x => x.ShippingZoneMethodId,
                        principalTable: "ShippingZoneMethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9940), new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9942) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9945), new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9946) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9948), new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9949) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9951), new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9951) });

            migrationBuilder.InsertData(
                table: "ShippingClasses",
                columns: new[] { "Id", "CreatedAt", "Description", "Name", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7161), "Standard shipping for Segi Bella products", "Segi Bella", "segi-bella", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7162) },
                    { 2, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7193), "Bulk snack orders requiring higher shipping costs", "Segi Snacks - Bulk", "segi-snacks-bulk", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7194) },
                    { 3, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7199), "Individual snack packs", "Segi Snacks - Individual", "segi-snacks-individual", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7200) },
                    { 4, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7203), "Wholesale invoice event orders", "Segi Snacks - Invoice_Event Wholesale", "segi-snacks-invoice", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7204) },
                    { 5, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7209), "Variety box configurations", "Segi Snacks - Variety Box", "segi-snacks-variety-box", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7210) },
                    { 6, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7213), "Wholesale snack orders", "Segi Snacks - Wholesale", "segi-snacks-wholesale", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7214) }
                });

            migrationBuilder.InsertData(
                table: "ShippingMethods",
                columns: new[] { "Id", "CreatedAt", "Description", "IsEnabled", "IsTaxable", "MethodType", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7335), "Standard delivery service", true, true, "FlatRate", "Standard Shipping", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7336) },
                    { 2, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7343), "Faster delivery service", true, true, "FlatRate", "Express Shipping", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7344) },
                    { 3, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7348), "Next business day delivery", true, true, "FlatRate", "Next Day Air", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7349) }
                });

            migrationBuilder.InsertData(
                table: "ShippingMethods",
                columns: new[] { "Id", "CreatedAt", "Description", "IsEnabled", "MethodType", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 4, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7352), "Free shipping with conditions", true, "FreeShipping", "Free Standard Shipping", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7353) },
                    { 5, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7356), "Customer pickup at store location", true, "LocalPickup", "Local Pickup", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7357) }
                });

            migrationBuilder.InsertData(
                table: "ShippingZones",
                columns: new[] { "Id", "CreatedAt", "Description", "IsEnabled", "Name", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7507), "Local delivery within 25 miles", true, "Local - 25miles", 1, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7508) },
                    { 2, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7518), "East coast states", true, "Zone 1 (East Coast and Nearby States)", 2, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7519) },
                    { 3, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7523), "Central United States", true, "Zone 2 (Central U.S.)", 3, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7524) },
                    { 4, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7528), "West coast and distant states", true, "Zone 3 (West Coast and Distant States)", 4, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7528) },
                    { 5, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7537), "International shipping to North America", true, "International - North America / Caribbean", 5, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7538) },
                    { 6, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7541), "International shipping to South America", true, "International - South America", 6, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7542) },
                    { 7, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7545), "All other international destinations", true, "Rest of the world", 7, new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7546) }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(5981), "$2a$11$EBKUCl7ux5myZ/uS8T8dreEPa60UoQlCYyqa1qoDlI12/uRzH.4Pm", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(5988) });

            migrationBuilder.InsertData(
                table: "ShippingZoneMethods",
                columns: new[] { "Id", "BaseCost", "EstimatedDaysMax", "EstimatedDaysMin", "IsEnabled", "MaxOrderAmount", "MinOrderAmount", "ShippingMethodId", "ShippingZoneId", "SortOrder", "Title" },
                values: new object[,]
                {
                    { 1, 5.99m, 10, 3, true, null, 75m, 1, 1, 1, "Standard Shipping (3-10 business days)" },
                    { 2, 15.00m, 4, 1, true, null, null, 2, 1, 2, "Express Shipping (1-4 Business Days)" },
                    { 3, 25.00m, 1, 1, true, null, null, 3, 1, 3, "Next Day Air (1 Business Day)" }
                });

            migrationBuilder.InsertData(
                table: "ShippingZoneMethods",
                columns: new[] { "Id", "EstimatedDaysMax", "EstimatedDaysMin", "IsEnabled", "MaxOrderAmount", "MinOrderAmount", "ShippingMethodId", "ShippingZoneId", "SortOrder", "Title" },
                values: new object[,]
                {
                    { 4, 10, 3, true, null, 75m, 4, 1, 4, "Free Standard Shipping (3-10 Business Days)" },
                    { 5, 0, 0, true, null, null, 5, 1, 5, "Farmers Market Pickup: West End, Del Ray, Reston, or Crystal City" }
                });

            migrationBuilder.InsertData(
                table: "ShippingZoneMethods",
                columns: new[] { "Id", "BaseCost", "EstimatedDaysMax", "EstimatedDaysMin", "IsEnabled", "MaxOrderAmount", "MinOrderAmount", "ShippingMethodId", "ShippingZoneId", "SortOrder", "Title" },
                values: new object[,]
                {
                    { 6, 8.99m, 10, 3, true, null, 75m, 1, 2, 1, "Standard Shipping (3-10 business days)" },
                    { 7, 18.00m, 4, 1, true, null, null, 2, 2, 2, "Express Shipping (1-4 Business Days)" },
                    { 8, 28.00m, 1, 1, true, null, null, 3, 2, 3, "Next Day Air (1 Business Day)" }
                });

            migrationBuilder.InsertData(
                table: "ShippingZoneMethods",
                columns: new[] { "Id", "EstimatedDaysMax", "EstimatedDaysMin", "IsEnabled", "MaxOrderAmount", "MinOrderAmount", "ShippingMethodId", "ShippingZoneId", "SortOrder", "Title" },
                values: new object[] { 9, 10, 3, true, null, 75m, 4, 2, 4, "Free Standard Shipping (3-10 Business Days)" });

            migrationBuilder.InsertData(
                table: "ShippingZoneMethods",
                columns: new[] { "Id", "BaseCost", "EstimatedDaysMax", "EstimatedDaysMin", "IsEnabled", "MaxOrderAmount", "MinOrderAmount", "ShippingMethodId", "ShippingZoneId", "SortOrder", "Title" },
                values: new object[,]
                {
                    { 10, 12.99m, 10, 3, true, null, 75m, 1, 3, 1, "Standard Shipping (3-10 business days)" },
                    { 11, 22.00m, 4, 1, true, null, null, 2, 3, 2, "Express Shipping (1-4 Business Days)" },
                    { 12, 32.00m, 1, 1, true, null, null, 3, 3, 3, "Next Day Air (1 Business Day)" }
                });

            migrationBuilder.InsertData(
                table: "ShippingZoneMethods",
                columns: new[] { "Id", "EstimatedDaysMax", "EstimatedDaysMin", "IsEnabled", "MaxOrderAmount", "MinOrderAmount", "ShippingMethodId", "ShippingZoneId", "SortOrder", "Title" },
                values: new object[] { 13, 10, 3, true, null, 75m, 4, 3, 4, "Free Standard Shipping (3-10 Business Days)" });

            migrationBuilder.InsertData(
                table: "ShippingZoneMethods",
                columns: new[] { "Id", "BaseCost", "EstimatedDaysMax", "EstimatedDaysMin", "IsEnabled", "MaxOrderAmount", "MinOrderAmount", "ShippingMethodId", "ShippingZoneId", "SortOrder", "Title" },
                values: new object[,]
                {
                    { 14, 19.99m, 20, 6, true, null, null, 1, 5, 1, "International Flat Rate (6-20 Business Days)" },
                    { 15, 24.99m, 20, 6, true, null, null, 1, 6, 1, "International Flat Rate (6-20 Business Days)" },
                    { 16, 29.99m, 20, 6, true, null, null, 1, 7, 1, "International Flat Rate (6-20 Business Days)" }
                });

            migrationBuilder.InsertData(
                table: "ShippingZoneRegions",
                columns: new[] { "Id", "IsIncluded", "Priority", "RegionCode", "RegionName", "RegionType", "ShippingZoneId" },
                values: new object[,]
                {
                    { 1, true, 1, "MD", "Maryland", "State", 1 },
                    { 2, true, 1, "VA", "Virginia", "State", 1 },
                    { 3, true, 1, "DC", "District of Columbia", "State", 1 },
                    { 4, true, 1, "DE", "Delaware", "State", 2 },
                    { 5, true, 1, "NJ", "New Jersey", "State", 2 },
                    { 6, true, 1, "NY", "New York", "State", 2 },
                    { 7, true, 1, "PA", "Pennsylvania", "State", 2 },
                    { 8, true, 1, "NC", "North Carolina", "State", 2 },
                    { 9, true, 1, "SC", "South Carolina", "State", 2 },
                    { 10, true, 1, "WV", "West Virginia", "State", 2 },
                    { 11, true, 1, "AL", "Alabama", "State", 3 },
                    { 12, true, 1, "AR", "Arkansas", "State", 3 },
                    { 13, true, 1, "GA", "Georgia", "State", 3 },
                    { 14, true, 1, "IL", "Illinois", "State", 3 },
                    { 15, true, 1, "IN", "Indiana", "State", 3 },
                    { 16, true, 1, "IA", "Iowa", "State", 3 },
                    { 17, true, 1, "KY", "Kentucky", "State", 3 },
                    { 18, true, 1, "LA", "Louisiana", "State", 3 },
                    { 19, true, 1, "MI", "Michigan", "State", 3 },
                    { 20, true, 1, "MN", "Minnesota", "State", 3 },
                    { 21, true, 1, "CA", "Canada", "Country", 5 },
                    { 22, true, 1, "BR", "Brazil", "Country", 6 },
                    { 23, true, 1, "AR", "Argentina", "Country", 6 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_ShippingClassId",
                table: "Products",
                column: "ShippingClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ShippingZoneMethodId",
                table: "Orders",
                column: "ShippingZoneMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryConfigurationTemplates_CategoryId",
                table: "CategoryConfigurationTemplates",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoryConfigurationTemplates_CategoryId_ConfigurationTypeId",
                table: "CategoryConfigurationTemplates",
                columns: new[] { "CategoryId", "ConfigurationTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CategoryConfigurationTemplates_ConfigurationTypeId",
                table: "CategoryConfigurationTemplates",
                column: "ConfigurationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ConfigurationOptions_ConfigurationTypeId",
                table: "ConfigurationOptions",
                column: "ConfigurationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ConfigurationOptions_ConfigurationTypeId_SortOrder",
                table: "ConfigurationOptions",
                columns: new[] { "ConfigurationTypeId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_ConfigurationTypes_Name",
                table: "ConfigurationTypes",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_ConfigurationTypes_Type_IsActive",
                table: "ConfigurationTypes",
                columns: new[] { "Type", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemConfigurations_ConfigurationOptionId",
                table: "OrderItemConfigurations",
                column: "ConfigurationOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemConfigurations_ConfigurationTypeId",
                table: "OrderItemConfigurations",
                column: "ConfigurationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemConfigurations_OrderItemId",
                table: "OrderItemConfigurations",
                column: "OrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductConfigurationOverrides_ConfigurationTypeId",
                table: "ProductConfigurationOverrides",
                column: "ConfigurationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductConfigurationOverrides_ProductId",
                table: "ProductConfigurationOverrides",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductConfigurationOverrides_ProductId_ConfigurationTypeId",
                table: "ProductConfigurationOverrides",
                columns: new[] { "ProductId", "ConfigurationTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShippingClassCosts_ShippingClassId",
                table: "ShippingClassCosts",
                column: "ShippingClassId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingClassCosts_ShippingZoneMethodId",
                table: "ShippingClassCosts",
                column: "ShippingZoneMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingClasses_Slug",
                table: "ShippingClasses",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShippingZoneMethods_ShippingMethodId",
                table: "ShippingZoneMethods",
                column: "ShippingMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingZoneMethods_ShippingZoneId",
                table: "ShippingZoneMethods",
                column: "ShippingZoneId");

            migrationBuilder.CreateIndex(
                name: "IX_ShippingZoneRegions_ShippingZoneId",
                table: "ShippingZoneRegions",
                column: "ShippingZoneId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_ShippingZoneMethods_ShippingZoneMethodId",
                table: "Orders",
                column: "ShippingZoneMethodId",
                principalTable: "ShippingZoneMethods",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ShippingClasses_ShippingClassId",
                table: "Products",
                column: "ShippingClassId",
                principalTable: "ShippingClasses",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_ShippingZoneMethods_ShippingZoneMethodId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_ShippingClasses_ShippingClassId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "CategoryConfigurationTemplates");

            migrationBuilder.DropTable(
                name: "OrderItemConfigurations");

            migrationBuilder.DropTable(
                name: "ProductConfigurationOverrides");

            migrationBuilder.DropTable(
                name: "ShippingClassCosts");

            migrationBuilder.DropTable(
                name: "ShippingZoneRegions");

            migrationBuilder.DropTable(
                name: "ConfigurationOptions");

            migrationBuilder.DropTable(
                name: "ShippingClasses");

            migrationBuilder.DropTable(
                name: "ShippingZoneMethods");

            migrationBuilder.DropTable(
                name: "ConfigurationTypes");

            migrationBuilder.DropTable(
                name: "ShippingMethods");

            migrationBuilder.DropTable(
                name: "ShippingZones");

            migrationBuilder.DropIndex(
                name: "IX_Products_ShippingClassId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Orders_ShippingZoneMethodId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ShippingClassId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ShippingMethodTitle",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ShippingZoneMethodId",
                table: "Orders");

            migrationBuilder.CreateTable(
                name: "ProductConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ConfigurationType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DefaultHighlight = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    HasBulkQuantity = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    HasQuantitySets = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    HasVarietyBoxOptions = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    MaxBulkQuantity = table.Column<int>(type: "int", nullable: true),
                    MinBulkQuantity = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductConfigurations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductConfigurations_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductQuantitySets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PriceMultiplier = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductQuantitySets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductQuantitySets_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductVarietyBoxOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    SlotName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SlotQuantity = table.Column<int>(type: "int", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVarietyBoxOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductVarietyBoxOptions_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VarietyBoxSnackOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SnackProductId = table.Column<int>(type: "int", nullable: false),
                    VarietyBoxOptionId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DisplayName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    Size = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VarietyBoxSnackOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VarietyBoxSnackOptions_ProductVarietyBoxOptions_VarietyBoxOptionId",
                        column: x => x.VarietyBoxOptionId,
                        principalTable: "ProductVarietyBoxOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VarietyBoxSnackOptions_Products_SnackProductId",
                        column: x => x.SnackProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2799), new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2800) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2834), new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2835) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2837), new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2837) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2839), new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2839) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 20, 12, 46, 11, 469, DateTimeKind.Utc).AddTicks(7847), "$2a$11$H4BoNKqcDEGj6qI9BMySAOdogUqkZpbdOE726wj3PomgxOG/i/CM.", new DateTime(2025, 8, 20, 12, 46, 11, 469, DateTimeKind.Utc).AddTicks(7859) });

            migrationBuilder.CreateIndex(
                name: "IX_ProductConfigurations_ProductId",
                table: "ProductConfigurations",
                column: "ProductId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductQuantitySets_ProductId",
                table: "ProductQuantitySets",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductQuantitySets_ProductId_Name",
                table: "ProductQuantitySets",
                columns: new[] { "ProductId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductVarietyBoxOptions_ProductId",
                table: "ProductVarietyBoxOptions",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_VarietyBoxSnackOptions_SnackProductId",
                table: "VarietyBoxSnackOptions",
                column: "SnackProductId");

            migrationBuilder.CreateIndex(
                name: "IX_VarietyBoxSnackOptions_VarietyBoxOptionId",
                table: "VarietyBoxSnackOptions",
                column: "VarietyBoxOptionId");
        }
    }
}
