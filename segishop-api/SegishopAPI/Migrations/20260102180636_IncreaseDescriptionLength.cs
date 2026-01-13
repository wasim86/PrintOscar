using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class IncreaseDescriptionLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.CreateTable(
                name: "PaymentGatewaySettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StripeEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    StripeSecretKey = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    StripePublishableKey = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    PayPalEnabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    PayPalClientId = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    PayPalClientSecret = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    PayPalBaseUrl = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentGatewaySettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShopLocalLocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    AddressLine = table.Column<string>(type: "nvarchar(240)", maxLength: 240, nullable: false),
                    MapEmbedUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Group = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "weekly")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopLocalLocations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShopLocalMedia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Caption = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Group = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "thankyou"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopLocalMedia", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShopLocalPageSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Headline = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false, defaultValue: "Shop Local"),
                    ContentHtml = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    HeroMapEmbedUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    WeeklyHeading = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    AnnualHeading = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ThankYouHeading = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    GalleryHeading = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    InactiveHeading = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StoresHeading = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopLocalPageSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShopLocalV2Events",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Schedule = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Time = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValue: "weekly"),
                    MapEmbedUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GoogleMapsLink = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopLocalV2Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShopLocalV2Media",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Caption = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: true, defaultValue: "market"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopLocalV2Media", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShopLocalV2Settings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HeroTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HeroSubtitle = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopLocalV2Settings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteBannerSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Message = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    BackgroundColor = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "#f4c363"),
                    TextColor = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "#1f2937"),
                    Enabled = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    Centered = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteBannerSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SocialIntegrationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    YouTubeChannelId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    YouTubeApiKey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InstagramUserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InstagramAccessToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TikTokUsername = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UseManualYouTube = table.Column<bool>(type: "bit", nullable: false),
                    YouTubeManualLinks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UseManualInstagram = table.Column<bool>(type: "bit", nullable: false),
                    InstagramManualLinks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UseManualTikTok = table.Column<bool>(type: "bit", nullable: false),
                    TikTokManualLinks = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialIntegrationSettings", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 651, DateTimeKind.Utc).AddTicks(7354), new DateTime(2026, 1, 2, 18, 6, 34, 651, DateTimeKind.Utc).AddTicks(7355) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 651, DateTimeKind.Utc).AddTicks(7357), new DateTime(2026, 1, 2, 18, 6, 34, 651, DateTimeKind.Utc).AddTicks(7358) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 651, DateTimeKind.Utc).AddTicks(7360), new DateTime(2026, 1, 2, 18, 6, 34, 651, DateTimeKind.Utc).AddTicks(7360) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 651, DateTimeKind.Utc).AddTicks(7363), new DateTime(2026, 1, 2, 18, 6, 34, 651, DateTimeKind.Utc).AddTicks(7363) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(366), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(366), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(355), new DateTime(2027, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(358) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(372), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(373), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(371), new DateTime(2027, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(371) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(713), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(713) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(716), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(716) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(718), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(719) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(721), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(728) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(730), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(731) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(733), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(733) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(797), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(798) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(800), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(800) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(803), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(803) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(805), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(806) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(808), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(809) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(867), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(868) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(870), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(871) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(873), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(873) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(875), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(876) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(878), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(879) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(881), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(881) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(883), new DateTime(2026, 1, 2, 18, 6, 34, 816, DateTimeKind.Utc).AddTicks(884) });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Events",
                columns: new[] { "Id", "Address", "GoogleMapsLink", "IsActive", "MapEmbedUrl", "Schedule", "Time", "Title", "Type" },
                values: new object[] { 1001, "Fairfax, Virginia", "https://maps.app.goo.gl/WmsevppVt97n9UiM6", true, "https://www.google.com/maps?q=Fairfax,Virginia&output=embed", "October (Sat 10/14)", "All Day", "Fairfax Fall Festival", "seasonal" });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Events",
                columns: new[] { "Id", "Address", "GoogleMapsLink", "IsActive", "MapEmbedUrl", "Schedule", "SortOrder", "Time", "Title", "Type" },
                values: new object[,]
                {
                    { 1002, "Knights of Columbus Hall, Maryland", "https://maps.app.goo.gl/Viu8LBxqXtCbu6Qq6", true, "https://www.google.com/maps?q=Knights+of+Columbus,Maryland&output=embed", "November (Thur 11/16)", 1, "Evening Event", "MONA Sip-N-Shop", "seasonal" },
                    { 1003, "Falls Church Community Center, Virginia", "https://maps.app.goo.gl/HgbQyHaantejcwaeA", true, "https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed", "December (Sat-Sun 12/2-3)", 2, "Weekend Event", "Falls Church Holiday Show", "seasonal" }
                });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Events",
                columns: new[] { "Id", "Address", "GoogleMapsLink", "IsActive", "MapEmbedUrl", "Schedule", "Time", "Title", "Type" },
                values: new object[] { 1011, "Falls Church Community Center, Virginia", "https://maps.app.goo.gl/RFvwW4sbUd8WPVLn8", true, "https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed", "May (Mon 5/29)", "All Day", "City Of Falls Church Memorial Day Parade And Festival", "annual" });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Events",
                columns: new[] { "Id", "Address", "GoogleMapsLink", "IsActive", "MapEmbedUrl", "Schedule", "SortOrder", "Time", "Title", "Type" },
                values: new object[,]
                {
                    { 1012, "Falls Church Community Center, Virginia", "https://maps.app.goo.gl/RFvwW4sbUd8WPVLn8", true, "https://www.google.com/maps?q=Falls+Church+Community+Center,Virginia&output=embed", "September (Sat 9/23)", 1, "All Day", "Falls Church City Festival", "annual" },
                    { 1013, "Clarendon, Arlington, Virginia", "https://maps.app.goo.gl/i7ZSQXQGSZSkWFsV7", true, "https://www.google.com/maps?q=Clarendon,Arlington,Virginia&output=embed", "September (Sat 9/30)", 2, "All Day", "Clarendon Day", "annual" }
                });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Events",
                columns: new[] { "Id", "Address", "GoogleMapsLink", "IsActive", "MapEmbedUrl", "Schedule", "Time", "Title", "Type" },
                values: new object[] { 1021, "Metropolitan Park, Maryland", "https://maps.app.goo.gl/MLewnwQeL7PPP4yk6", true, "https://www.google.com/maps?q=Metropolitan+Park,Maryland&output=embed", "Saturdays @ EatLoco Farmers Market At MetPark (9am-1pm)", "9:00 AM - 1:00 PM", "EatLoco Farmers Market At MetPark", "weekly" });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Events",
                columns: new[] { "Id", "Address", "GoogleMapsLink", "IsActive", "MapEmbedUrl", "Schedule", "SortOrder", "Time", "Title", "Type" },
                values: new object[,]
                {
                    { 1022, "West End Farmers Market, Virginia", "https://maps.app.goo.gl/RoErobep1eBPt549A", true, "https://www.google.com/maps?q=West+End+Village,Virginia&output=embed", "Sundays @ West End Farmers Market (8:30am-1pm)", 1, "8:30 AM - 1:00 PM", "West End Farmers Market", "weekly" },
                    { 1023, "1804 Mt Vernon Ave, Alexandria, VA 22301", "https://maps.app.goo.gl/qmFX5jCRedeohE3T7", true, "https://www.google.com/maps?q=Del+Ray,Alexandria,Virginia&output=embed", "2nd Saturdays @ Del Ray Artisans, Vintage & Flea Market (9am-2pm)", 2, "9:00 AM - 2:00 PM", "Del Ray Artisans, Vintage & Flea Market", "monthly" }
                });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Events",
                columns: new[] { "Id", "Address", "GoogleMapsLink", "IsActive", "MapEmbedUrl", "Schedule", "Time", "Title", "Type" },
                values: new object[] { 1031, "Leesburg Pike, Virginia", "https://maps.app.goo.gl/NEy8tWKDqsVMNLQX7", true, "https://www.google.com/maps?q=Food+Star+Leesburg+Pike&output=embed", "", "Call for hours", "Food Star - Leesburg Pike", "store" });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Events",
                columns: new[] { "Id", "Address", "GoogleMapsLink", "IsActive", "MapEmbedUrl", "Schedule", "SortOrder", "Time", "Title", "Type" },
                values: new object[] { 1032, "Virginia", "https://maps.app.goo.gl/HgA2eGasPoYByu4r8", true, "https://www.google.com/maps?q=Weyone+International&output=embed", "", 1, "Call for hours", "Weyone International", "store" });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Media",
                columns: new[] { "Id", "Caption", "Category", "ImageUrl", "IsActive" },
                values: new object[] { 2001, "Market Preparation", "market", "https://segishop.com/wp-content/uploads/2022/04/20210607_234134-scaled.jpg", true });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Media",
                columns: new[] { "Id", "Caption", "Category", "ImageUrl", "IsActive", "SortOrder" },
                values: new object[,]
                {
                    { 2002, "Fresh Start", "market", "https://segishop.com/wp-content/uploads/2022/01/20220112_071509v2-scaled-e1641992057434.jpg", true, 1 },
                    { 2003, "Community Connection", "community", "https://segishop.com/wp-content/uploads/2022/01/20211107_103617-scaled.jpg", true, 2 }
                });

            migrationBuilder.InsertData(
                table: "ShopLocalV2Settings",
                columns: new[] { "Id", "HeroSubtitle", "HeroTitle" },
                values: new object[] { 1, "DMV Area", "Shop Local" });

            migrationBuilder.InsertData(
                table: "SocialIntegrationSettings",
                columns: new[] { "Id", "InstagramAccessToken", "InstagramManualLinks", "InstagramUserId", "TikTokManualLinks", "TikTokUsername", "UseManualInstagram", "UseManualTikTok", "UseManualYouTube", "YouTubeApiKey", "YouTubeChannelId", "YouTubeManualLinks" },
                values: new object[] { 1, null, null, null, null, "thesegishop", false, false, false, null, null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 1, 2, 18, 6, 34, 814, DateTimeKind.Utc).AddTicks(609), "$2a$11$GNVbvpPexuj0XRvO5PHBwe2WEs4GFg2glAdAzWd8y3GU10ZyuZk0W", new DateTime(2026, 1, 2, 18, 6, 34, 814, DateTimeKind.Utc).AddTicks(616) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaymentGatewaySettings");

            migrationBuilder.DropTable(
                name: "ShopLocalLocations");

            migrationBuilder.DropTable(
                name: "ShopLocalMedia");

            migrationBuilder.DropTable(
                name: "ShopLocalPageSettings");

            migrationBuilder.DropTable(
                name: "ShopLocalV2Events");

            migrationBuilder.DropTable(
                name: "ShopLocalV2Media");

            migrationBuilder.DropTable(
                name: "ShopLocalV2Settings");

            migrationBuilder.DropTable(
                name: "SiteBannerSettings");

            migrationBuilder.DropTable(
                name: "SocialIntegrationSettings");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Products",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9454), new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9456) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9460), new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9460) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9463), new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9463) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9465), new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9466) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(112), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(113), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(95), new DateTime(2026, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(102) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(123), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(123), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(120), new DateTime(2026, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(121) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(259), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(261) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(265), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(266) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(269), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(270) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(273), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(280) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(283), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(284) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(286), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(287) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(406), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(406) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(411), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(412) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(415), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(415) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(418), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(419) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(422), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(423) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(513), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(514) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(518), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(519) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(522), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(523) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(526), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(527) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(531), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(531) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(534), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(535) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(538), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(538) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 27, DateTimeKind.Utc).AddTicks(2355), "$2a$11$XEF8MHQJDEgvxW3/BHXTWeomtAOWO30i0ISgKRz1P0h6cW3IqVNa6", new DateTime(2025, 9, 17, 16, 6, 46, 27, DateTimeKind.Utc).AddTicks(2361) });
        }
    }
}
