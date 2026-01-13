using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCardholderNameAndZipCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
