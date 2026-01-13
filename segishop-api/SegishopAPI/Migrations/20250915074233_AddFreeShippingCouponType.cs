using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFreeShippingCouponType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 31, 852, DateTimeKind.Utc).AddTicks(7045), new DateTime(2025, 9, 15, 7, 42, 31, 852, DateTimeKind.Utc).AddTicks(7046) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 31, 852, DateTimeKind.Utc).AddTicks(7049), new DateTime(2025, 9, 15, 7, 42, 31, 852, DateTimeKind.Utc).AddTicks(7050) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 31, 852, DateTimeKind.Utc).AddTicks(7052), new DateTime(2025, 9, 15, 7, 42, 31, 852, DateTimeKind.Utc).AddTicks(7053) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 31, 852, DateTimeKind.Utc).AddTicks(7055), new DateTime(2025, 9, 15, 7, 42, 31, 852, DateTimeKind.Utc).AddTicks(7056) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8361), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8362), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8335), new DateTime(2026, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8338) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8456), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8457) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8460), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8461) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8463), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8464) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8466), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8466) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8468), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8469) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8475), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8476) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8552), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8552) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8555), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8556) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8558), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8559) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8561), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8562) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8564), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8564) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8633), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8634) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8637), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8637) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8639), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8640) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8642), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8644) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8646), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8647) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8649), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8649) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8651), new DateTime(2025, 9, 15, 7, 42, 32, 21, DateTimeKind.Utc).AddTicks(8652) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 42, 32, 19, DateTimeKind.Utc).AddTicks(817), "$2a$11$NifChGcOoBLz2OjGSu6aX.oecj2QSKcAzKFGDaCFd7qhA.C8CiZ22", new DateTime(2025, 9, 15, 7, 42, 32, 19, DateTimeKind.Utc).AddTicks(823) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
