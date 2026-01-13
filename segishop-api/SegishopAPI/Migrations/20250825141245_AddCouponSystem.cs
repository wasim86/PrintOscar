using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCouponSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CouponCode",
                table: "Orders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CouponDiscountAmount",
                table: "Orders",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "CouponId",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    MinimumOrderAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    MaximumDiscountAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    MaxTotalUses = table.Column<int>(type: "int", nullable: true),
                    MaxUsesPerUser = table.Column<int>(type: "int", nullable: true),
                    CurrentTotalUses = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsFirstOrderOnly = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ValidFrom = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ValidUntil = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CouponUsages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CouponId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    DiscountAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    OrderSubtotal = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CouponUsages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CouponUsages_Coupons_CouponId",
                        column: x => x.CouponId,
                        principalTable: "Coupons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CouponUsages_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CouponUsages_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 525, DateTimeKind.Utc).AddTicks(962), new DateTime(2025, 8, 25, 14, 12, 44, 525, DateTimeKind.Utc).AddTicks(963) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 525, DateTimeKind.Utc).AddTicks(967), new DateTime(2025, 8, 25, 14, 12, 44, 525, DateTimeKind.Utc).AddTicks(967) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 525, DateTimeKind.Utc).AddTicks(970), new DateTime(2025, 8, 25, 14, 12, 44, 525, DateTimeKind.Utc).AddTicks(970) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 525, DateTimeKind.Utc).AddTicks(973), new DateTime(2025, 8, 25, 14, 12, 44, 525, DateTimeKind.Utc).AddTicks(973) });

            migrationBuilder.InsertData(
                table: "Coupons",
                columns: new[] { "Id", "Code", "CreatedAt", "CreatedBy", "Description", "IsActive", "IsFirstOrderOnly", "MaxTotalUses", "MaxUsesPerUser", "MaximumDiscountAmount", "MinimumOrderAmount", "Type", "UpdatedAt", "ValidFrom", "ValidUntil", "Value" },
                values: new object[] { 1, "FIRSTSEGI10", new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3337), "System", "10% discount on your first order", true, true, null, null, 50.00m, 25.00m, 1, new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3337), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3304), new DateTime(2026, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3307), 10.00m });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3418), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3419) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3422), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3422) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3424), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3425) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3427), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3427) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3429), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3430) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3432), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3432) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3487), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3489) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3492), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3492) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3494), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3495) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3497), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3497) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3499), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3500) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3545), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3546) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3549), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3549) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3552), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3552) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3555), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3555) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3557), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3557) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3559), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3560) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3565), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3565) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 681, DateTimeKind.Utc).AddTicks(6605), "$2a$11$PEf4g/8GKcOQT.FmbHn0Nuxyi9zOT/BCnmW.j0BvTDPhKbHkf2D2W", new DateTime(2025, 8, 25, 14, 12, 44, 681, DateTimeKind.Utc).AddTicks(6621) });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CouponId",
                table: "Orders",
                column: "CouponId");

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_Code",
                table: "Coupons",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_IsActive_ValidFrom_ValidUntil",
                table: "Coupons",
                columns: new[] { "IsActive", "ValidFrom", "ValidUntil" });

            migrationBuilder.CreateIndex(
                name: "IX_CouponUsages_CouponId_UserId",
                table: "CouponUsages",
                columns: new[] { "CouponId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_CouponUsages_OrderId",
                table: "CouponUsages",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_CouponUsages_UserId",
                table: "CouponUsages",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Coupons_CouponId",
                table: "Orders",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Coupons_CouponId",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "CouponUsages");

            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.DropIndex(
                name: "IX_Orders_CouponId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CouponCode",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CouponDiscountAmount",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CouponId",
                table: "Orders");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 64, DateTimeKind.Utc).AddTicks(9540), new DateTime(2025, 8, 25, 6, 27, 3, 64, DateTimeKind.Utc).AddTicks(9541) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 64, DateTimeKind.Utc).AddTicks(9545), new DateTime(2025, 8, 25, 6, 27, 3, 64, DateTimeKind.Utc).AddTicks(9545) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 64, DateTimeKind.Utc).AddTicks(9548), new DateTime(2025, 8, 25, 6, 27, 3, 64, DateTimeKind.Utc).AddTicks(9548) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 64, DateTimeKind.Utc).AddTicks(9550), new DateTime(2025, 8, 25, 6, 27, 3, 64, DateTimeKind.Utc).AddTicks(9551) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4463), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4464) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4467), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4468) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4470), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4471) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4473), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4473) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4475), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4475) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4477), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4477) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4574), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4591) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4594), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4594) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4597), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4597) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4599), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4600) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4602), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4602) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4700), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4701) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4704), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4705) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4707), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4708) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4710), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4710) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4716), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4716) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4718), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4719) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4721), new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(4721) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(3769), "$2a$11$J36D2co6b4MzNhS25VsrYufXhuzPSmAtONvOLpmmGzeYRgjoowABi", new DateTime(2025, 8, 25, 6, 27, 3, 216, DateTimeKind.Utc).AddTicks(3777) });
        }
    }
}
