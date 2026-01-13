using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyCustomerPaymentMethods : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 622, DateTimeKind.Utc).AddTicks(6340), new DateTime(2025, 9, 5, 19, 32, 42, 622, DateTimeKind.Utc).AddTicks(6341) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 622, DateTimeKind.Utc).AddTicks(6344), new DateTime(2025, 9, 5, 19, 32, 42, 622, DateTimeKind.Utc).AddTicks(6345) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 622, DateTimeKind.Utc).AddTicks(6347), new DateTime(2025, 9, 5, 19, 32, 42, 622, DateTimeKind.Utc).AddTicks(6348) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 622, DateTimeKind.Utc).AddTicks(6349), new DateTime(2025, 9, 5, 19, 32, 42, 622, DateTimeKind.Utc).AddTicks(6350) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4105), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4107), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4083), new DateTime(2026, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4087) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4204), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4207) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4210), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4211) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4213), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4214) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4216), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4216) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4218), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4219) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4221), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4222) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4279), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4280) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4283), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4284) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4286), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4287) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4289), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4290) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4292), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4292) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4352), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4353) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4356), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4356) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4358), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4359) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4361), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4362) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4364), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4365) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4367), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4368) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4370), new DateTime(2025, 9, 5, 19, 32, 42, 761, DateTimeKind.Utc).AddTicks(4370) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 5, 19, 32, 42, 759, DateTimeKind.Utc).AddTicks(5523), "$2a$11$ODzSIVpLN/3JGLsdlzXCAeTk2RSSvkMjbkaDobSiCasmxUNAg0pg6", new DateTime(2025, 9, 5, 19, 32, 42, 759, DateTimeKind.Utc).AddTicks(5531) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
