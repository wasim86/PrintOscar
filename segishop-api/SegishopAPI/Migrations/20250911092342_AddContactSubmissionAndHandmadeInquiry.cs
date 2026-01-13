using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddContactSubmissionAndHandmadeInquiry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactSubmissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    HearAbout = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsResponded = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    RespondedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RespondedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdminNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(450)", nullable: false, defaultValue: "New"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactSubmissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HandmadeInquiries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false, defaultValue: "+1"),
                    PreferredContact = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "email"),
                    ItemType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NeedByDate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShippingAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DressLength = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DressColors = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TotalDresses = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    BagStyle = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    BagSize = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    BagQuantity = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    FunKitFill = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CustomLabels = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DetailedPreferences = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    ProductLink = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ReferralSource = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsResponded = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    RespondedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RespondedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdminNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(450)", nullable: false, defaultValue: "New"),
                    QuotedPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EstimatedCompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HandmadeInquiries", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 462, DateTimeKind.Utc).AddTicks(6650), new DateTime(2025, 9, 11, 9, 23, 41, 462, DateTimeKind.Utc).AddTicks(6652) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 462, DateTimeKind.Utc).AddTicks(6656), new DateTime(2025, 9, 11, 9, 23, 41, 462, DateTimeKind.Utc).AddTicks(6657) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 462, DateTimeKind.Utc).AddTicks(6661), new DateTime(2025, 9, 11, 9, 23, 41, 462, DateTimeKind.Utc).AddTicks(6662) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 462, DateTimeKind.Utc).AddTicks(6665), new DateTime(2025, 9, 11, 9, 23, 41, 462, DateTimeKind.Utc).AddTicks(6666) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5515), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5515), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5483), new DateTime(2026, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5488) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5611), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5613) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5617), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5618) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5620), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5621) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5624), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5624) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5627), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5627) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5636), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5636) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5713), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5713) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5717), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5718) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5721), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5721) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5724), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5724) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5727), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5728) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5799), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5799) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5808), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5809) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5812), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5812) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5815), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5816) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5819), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5820) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5822), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5823) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5825), new DateTime(2025, 9, 11, 9, 23, 41, 639, DateTimeKind.Utc).AddTicks(5826) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 9, 23, 41, 637, DateTimeKind.Utc).AddTicks(1759), "$2a$11$WyodkgBoDynpVbG7sQH7GuIbdh2/egfIM.mR9gXXTBGwWnBFKwVz6", new DateTime(2025, 9, 11, 9, 23, 41, 637, DateTimeKind.Utc).AddTicks(1774) });

            migrationBuilder.CreateIndex(
                name: "IX_ContactSubmissions_CreatedAt",
                table: "ContactSubmissions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ContactSubmissions_Email",
                table: "ContactSubmissions",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_ContactSubmissions_Status",
                table: "ContactSubmissions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ContactSubmissions_Status_IsResponded",
                table: "ContactSubmissions",
                columns: new[] { "Status", "IsResponded" });

            migrationBuilder.CreateIndex(
                name: "IX_HandmadeInquiries_CreatedAt",
                table: "HandmadeInquiries",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_HandmadeInquiries_Email",
                table: "HandmadeInquiries",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_HandmadeInquiries_ItemType",
                table: "HandmadeInquiries",
                column: "ItemType");

            migrationBuilder.CreateIndex(
                name: "IX_HandmadeInquiries_Status",
                table: "HandmadeInquiries",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_HandmadeInquiries_Status_IsResponded",
                table: "HandmadeInquiries",
                columns: new[] { "Status", "IsResponded" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactSubmissions");

            migrationBuilder.DropTable(
                name: "HandmadeInquiries");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 650, DateTimeKind.Utc).AddTicks(1369), new DateTime(2025, 9, 11, 8, 7, 59, 650, DateTimeKind.Utc).AddTicks(1371) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 650, DateTimeKind.Utc).AddTicks(1374), new DateTime(2025, 9, 11, 8, 7, 59, 650, DateTimeKind.Utc).AddTicks(1375) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 650, DateTimeKind.Utc).AddTicks(1378), new DateTime(2025, 9, 11, 8, 7, 59, 650, DateTimeKind.Utc).AddTicks(1378) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 650, DateTimeKind.Utc).AddTicks(1380), new DateTime(2025, 9, 11, 8, 7, 59, 650, DateTimeKind.Utc).AddTicks(1381) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(401), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(402), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(375), new DateTime(2026, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(379) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(514), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(516) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(520), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(521) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(523), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(524) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(527), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(527) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(530), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(530) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(539), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(540) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(624), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(625) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(629), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(630) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(633), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(633) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(636), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(637) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(639), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(640) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(718), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(718) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(722), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(723) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(725), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(726) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(729), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(729) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(732), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(732) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(735), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(735) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(738), new DateTime(2025, 9, 11, 8, 7, 59, 836, DateTimeKind.Utc).AddTicks(739) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 11, 8, 7, 59, 833, DateTimeKind.Utc).AddTicks(4914), "$2a$11$rejpK8ntarZwuHDxms.LCedm7zf3VjQsJPlXfYZGlF8DkLq8M3Vc6", new DateTime(2025, 9, 11, 8, 7, 59, 833, DateTimeKind.Utc).AddTicks(4927) });
        }
    }
}
