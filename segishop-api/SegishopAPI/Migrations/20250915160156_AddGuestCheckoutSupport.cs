using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddGuestCheckoutSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Orders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "GuestEmail",
                table: "Orders",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestFirstName",
                table: "Orders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestLastName",
                table: "Orders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestPhone",
                table: "Orders",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 65, DateTimeKind.Utc).AddTicks(2689), new DateTime(2025, 9, 15, 16, 1, 55, 65, DateTimeKind.Utc).AddTicks(2690) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 65, DateTimeKind.Utc).AddTicks(2693), new DateTime(2025, 9, 15, 16, 1, 55, 65, DateTimeKind.Utc).AddTicks(2694) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 65, DateTimeKind.Utc).AddTicks(2696), new DateTime(2025, 9, 15, 16, 1, 55, 65, DateTimeKind.Utc).AddTicks(2696) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 65, DateTimeKind.Utc).AddTicks(2698), new DateTime(2025, 9, 15, 16, 1, 55, 65, DateTimeKind.Utc).AddTicks(2698) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8546), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8547), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8534), new DateTime(2026, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8539) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8552), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8552), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8551), new DateTime(2026, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8551) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8620), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8622) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8625), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8625) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8627), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8627) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8636), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8642) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8643), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8644) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8645), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8646) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8704), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8706) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8708), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8709) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8710), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8711) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8713), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8713) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8715), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8715) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8762), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8763) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8765), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8765) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8767), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8768) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8770), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8770) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8772), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8772) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8774), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8774) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8776), new DateTime(2025, 9, 15, 16, 1, 55, 249, DateTimeKind.Utc).AddTicks(8776) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 16, 1, 55, 247, DateTimeKind.Utc).AddTicks(9261), "$2a$11$OmcMMGi7xcW5lxFoKDARiep0HxcsDNGeQfQsSE28FdPqDAa6h4.L6", new DateTime(2025, 9, 15, 16, 1, 55, 247, DateTimeKind.Utc).AddTicks(9269) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GuestEmail",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "GuestFirstName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "GuestLastName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "GuestPhone",
                table: "Orders");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 817, DateTimeKind.Utc).AddTicks(2514), new DateTime(2025, 9, 15, 8, 35, 58, 817, DateTimeKind.Utc).AddTicks(2516) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 817, DateTimeKind.Utc).AddTicks(2520), new DateTime(2025, 9, 15, 8, 35, 58, 817, DateTimeKind.Utc).AddTicks(2520) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 817, DateTimeKind.Utc).AddTicks(2524), new DateTime(2025, 9, 15, 8, 35, 58, 817, DateTimeKind.Utc).AddTicks(2524) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 817, DateTimeKind.Utc).AddTicks(2527), new DateTime(2025, 9, 15, 8, 35, 58, 817, DateTimeKind.Utc).AddTicks(2527) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6079), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6079), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6064), new DateTime(2026, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6068) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6086), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6087), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6085), new DateTime(2026, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6085) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6185), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6185) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6189), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6190) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6192), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6193) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6195), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6202) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6204), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6204) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6206), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6207) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6287), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6287) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6292), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6292) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6294), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6295) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6297), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6298) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6300), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6300) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6366), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6367) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6371), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6371) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6374), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6374) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6377), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6377) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6380), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6380) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6382), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6383) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6385), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6386) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 8, 35, 58, 981, DateTimeKind.Utc).AddTicks(5711), "$2a$11$btWDthLOVEThtA6Fv5Nga.sNGfjQeP0fyOWE0H2/S1U1rFhO9RYTq", new DateTime(2025, 9, 15, 8, 35, 58, 981, DateTimeKind.Utc).AddTicks(5718) });
        }
    }
}
