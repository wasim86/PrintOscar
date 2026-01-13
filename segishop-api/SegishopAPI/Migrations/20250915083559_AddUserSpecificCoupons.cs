using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUserSpecificCoupons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AllowedUserEmails",
                table: "Coupons",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsUserSpecific",
                table: "Coupons",
                type: "bit",
                nullable: false,
                defaultValue: false);

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
                columns: new[] { "AllowedUserEmails", "CreatedAt", "IsUserSpecific", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { null, new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6079), false, new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6079), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6064), new DateTime(2026, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6068) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AllowedUserEmails", "CreatedAt", "IsUserSpecific", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { null, new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6086), false, new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6087), new DateTime(2025, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6085), new DateTime(2026, 9, 15, 8, 35, 58, 983, DateTimeKind.Utc).AddTicks(6085) });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowedUserEmails",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "IsUserSpecific",
                table: "Coupons");

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

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6268), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6269), new DateTime(2025, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6266), new DateTime(2026, 9, 15, 7, 43, 51, 881, DateTimeKind.Utc).AddTicks(6267) });

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
    }
}
