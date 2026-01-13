using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentRecordsAndOrderStatusHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrderStatusHistory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    FromStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ToStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ChangedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ChangeReason = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CustomerNotified = table.Column<bool>(type: "bit", nullable: false),
                    NotificationMethod = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    Metadata = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatusHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderStatusHistory_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PaymentRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PaymentType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    TransactionId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PaymentIntentId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ChargeId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RefundId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RefundedFromPaymentId = table.Column<int>(type: "int", nullable: true),
                    PaymentMethodDetails = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FailureReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Metadata = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ProcessedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentRecords_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PaymentRecords_PaymentRecords_RefundedFromPaymentId",
                        column: x => x.RefundedFromPaymentId,
                        principalTable: "PaymentRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 20, 882, DateTimeKind.Utc).AddTicks(6496), new DateTime(2025, 8, 27, 10, 6, 20, 882, DateTimeKind.Utc).AddTicks(6497) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 20, 882, DateTimeKind.Utc).AddTicks(6501), new DateTime(2025, 8, 27, 10, 6, 20, 882, DateTimeKind.Utc).AddTicks(6502) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 20, 882, DateTimeKind.Utc).AddTicks(6505), new DateTime(2025, 8, 27, 10, 6, 20, 882, DateTimeKind.Utc).AddTicks(6506) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 20, 882, DateTimeKind.Utc).AddTicks(6509), new DateTime(2025, 8, 27, 10, 6, 20, 882, DateTimeKind.Utc).AddTicks(6510) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(144), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(145), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(114), new DateTime(2026, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(119) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(274), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(274) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(280), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(281) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(284), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(285) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(288), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(289) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(292), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(293) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(304), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(305) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(406), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(407) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(411), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(412) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(415), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(416) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(420), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(420) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(423), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(424) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(520), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(520) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(527), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(527) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(531), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(532) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(535), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(536) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(539), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(540) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(543), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(544) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(547), new DateTime(2025, 8, 27, 10, 6, 21, 98, DateTimeKind.Utc).AddTicks(548) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 27, 10, 6, 21, 94, DateTimeKind.Utc).AddTicks(8371), "$2a$11$t63qMMpGTJ9YNDtWbX7tJOGk0E2ZJ2DCO0U5QU8MSP0SJtPy5ZBca", new DateTime(2025, 8, 27, 10, 6, 21, 94, DateTimeKind.Utc).AddTicks(8377) });

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatusHistory_CreatedAt",
                table: "OrderStatusHistory",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatusHistory_OrderId",
                table: "OrderStatusHistory",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentRecords_OrderId",
                table: "PaymentRecords",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentRecords_PaymentIntentId",
                table: "PaymentRecords",
                column: "PaymentIntentId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentRecords_RefundedFromPaymentId",
                table: "PaymentRecords",
                column: "RefundedFromPaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentRecords_TransactionId",
                table: "PaymentRecords",
                column: "TransactionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderStatusHistory");

            migrationBuilder.DropTable(
                name: "PaymentRecords");

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

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3337), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3337), new DateTime(2025, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3304), new DateTime(2026, 8, 25, 14, 12, 44, 683, DateTimeKind.Utc).AddTicks(3307) });

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
        }
    }
}
