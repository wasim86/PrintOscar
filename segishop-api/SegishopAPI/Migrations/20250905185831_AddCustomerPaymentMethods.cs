using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerPaymentMethods : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerPaymentMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Last4Digits = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CardBrand = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ExpiryMonth = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: true),
                    ExpiryYear = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: true),
                    HolderName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    BillingAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    StripePaymentMethodId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PayPalPaymentMethodId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Metadata = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerPaymentMethods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerPaymentMethods_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 699, DateTimeKind.Utc).AddTicks(9752), new DateTime(2025, 9, 5, 18, 58, 30, 699, DateTimeKind.Utc).AddTicks(9754) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 699, DateTimeKind.Utc).AddTicks(9757), new DateTime(2025, 9, 5, 18, 58, 30, 699, DateTimeKind.Utc).AddTicks(9758) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 699, DateTimeKind.Utc).AddTicks(9761), new DateTime(2025, 9, 5, 18, 58, 30, 699, DateTimeKind.Utc).AddTicks(9761) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 699, DateTimeKind.Utc).AddTicks(9764), new DateTime(2025, 9, 5, 18, 58, 30, 699, DateTimeKind.Utc).AddTicks(9765) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7857), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7858), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7833), new DateTime(2026, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7838) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7966), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7968) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7972), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7972) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7975), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7976) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7978), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7979) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7981), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7982) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7990), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(7991) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8064), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8065) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8069), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8070) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8073), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8073) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8076), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8077) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8079), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8080) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8152), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8154) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8158), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8158) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8161), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8161) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8164), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8165) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8167), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8168) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8170), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8171) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8174), new DateTime(2025, 9, 5, 18, 58, 30, 874, DateTimeKind.Utc).AddTicks(8174) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 18, 58, 30, 872, DateTimeKind.Utc).AddTicks(3426), "$2a$11$KvewZKNmkieeHGo816M5se47P1OcpXsutKKGrxwSRo6b91EJ.lkpa", new DateTime(2025, 9, 5, 18, 58, 30, 872, DateTimeKind.Utc).AddTicks(3431) });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPaymentMethods_CustomerId",
                table: "CustomerPaymentMethods",
                column: "CustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerPaymentMethods");

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
        }
    }
}
