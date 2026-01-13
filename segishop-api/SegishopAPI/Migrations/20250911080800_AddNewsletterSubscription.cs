using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddNewsletterSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillingAddress",
                table: "CustomerPaymentMethods");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "CustomerPaymentMethods");

            migrationBuilder.DropColumn(
                name: "HolderName",
                table: "CustomerPaymentMethods");

            migrationBuilder.DropColumn(
                name: "Metadata",
                table: "CustomerPaymentMethods");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "CustomerPaymentMethods",
                newName: "CardholderName");

            migrationBuilder.AlterColumn<string>(
                name: "Last4Digits",
                table: "CustomerPaymentMethods",
                type: "nvarchar(4)",
                maxLength: 4,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZipCode",
                table: "CustomerPaymentMethods",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "NewsletterSubscriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    SubscribedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UnsubscribedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Source = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsletterSubscriptions", x => x.Id);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_NewsletterSubscriptions_Email",
                table: "NewsletterSubscriptions",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NewsletterSubscriptions_Email_IsActive",
                table: "NewsletterSubscriptions",
                columns: new[] { "Email", "IsActive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NewsletterSubscriptions");

            migrationBuilder.DropColumn(
                name: "ZipCode",
                table: "CustomerPaymentMethods");

            migrationBuilder.RenameColumn(
                name: "CardholderName",
                table: "CustomerPaymentMethods",
                newName: "UpdatedBy");

            migrationBuilder.AlterColumn<string>(
                name: "Last4Digits",
                table: "CustomerPaymentMethods",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(4)",
                oldMaxLength: 4,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingAddress",
                table: "CustomerPaymentMethods",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "CustomerPaymentMethods",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HolderName",
                table: "CustomerPaymentMethods",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Metadata",
                table: "CustomerPaymentMethods",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 112, DateTimeKind.Utc).AddTicks(9289), new DateTime(2025, 9, 5, 20, 4, 24, 112, DateTimeKind.Utc).AddTicks(9290) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 112, DateTimeKind.Utc).AddTicks(9294), new DateTime(2025, 9, 5, 20, 4, 24, 112, DateTimeKind.Utc).AddTicks(9295) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 112, DateTimeKind.Utc).AddTicks(9297), new DateTime(2025, 9, 5, 20, 4, 24, 112, DateTimeKind.Utc).AddTicks(9298) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 112, DateTimeKind.Utc).AddTicks(9300), new DateTime(2025, 9, 5, 20, 4, 24, 112, DateTimeKind.Utc).AddTicks(9301) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5304), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5305), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5276), new DateTime(2026, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5281) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5418), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5419) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5423), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5424) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5426), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5427) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5429), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5430) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5432), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5432) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5439), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5440) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5511), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5511) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5515), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5515) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5517), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5518) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5520), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5521) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5523), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5523) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5590), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5591) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5594), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5595) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5597), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5597) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5599), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5600) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5602), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5603) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5605), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5605) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5608), new DateTime(2025, 9, 5, 20, 4, 24, 264, DateTimeKind.Utc).AddTicks(5608) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 20, 4, 24, 262, DateTimeKind.Utc).AddTicks(5268), "$2a$11$RP7E9NNMKA8v0lPunWUI5OrBmagBKqw9bUK3.y.ukVLft4zxyABkW", new DateTime(2025, 9, 5, 20, 4, 24, 262, DateTimeKind.Utc).AddTicks(5273) });
        }
    }
}
