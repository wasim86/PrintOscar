using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFreeShippingCouponSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 681, DateTimeKind.Utc).AddTicks(8168), new DateTime(2025, 9, 15, 7, 43, 51, 681, DateTimeKind.Utc).AddTicks(8168) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 681, DateTimeKind.Utc).AddTicks(8172), new DateTime(2025, 9, 15, 7, 43, 51, 681, DateTimeKind.Utc).AddTicks(8173) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 681, DateTimeKind.Utc).AddTicks(8175), new DateTime(2025, 9, 15, 7, 43, 51, 681, DateTimeKind.Utc).AddTicks(8176) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 681, DateTimeKind.Utc).AddTicks(8178), new DateTime(2025, 9, 15, 7, 43, 51, 681, DateTimeKind.Utc).AddTicks(8179) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6261), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6261), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6247), new DateTime(2026, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6251) });

            // Removed duplicate FREESHIP50 coupon insert - coupon already exists

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6356), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6357) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6361), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6361) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6364), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6364) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6367), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6373) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6375), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6376) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6378), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6378) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6460), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6461) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6465), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6465) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6468), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6469) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6471), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6471) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6474), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6474) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6540), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6541) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6544), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6544) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6547), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6547) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6549), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6551) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6553), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6554) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6556), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6557) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6559), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6560) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 878, DateTimeKind.Utc).AddTicks(9487), "$2a$11$KWRqIkMaSw3ZRKWo5bXppezvQo1BOBTKQ.JdQI/x9dcBWTlPe0fRy", new DateTime(2025, 9, 15, 7, 43, 51, 878, DateTimeKind.Utc).AddTicks(9493) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2);

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
    }
}
