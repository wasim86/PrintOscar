using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddTrackingFieldsToOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CourierService",
                table: "Orders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EstimatedDeliveryDate",
                table: "Orders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TrackingNumber",
                table: "Orders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 4, 959, DateTimeKind.Utc).AddTicks(9386), new DateTime(2025, 9, 15, 21, 37, 4, 959, DateTimeKind.Utc).AddTicks(9388) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 4, 959, DateTimeKind.Utc).AddTicks(9393), new DateTime(2025, 9, 15, 21, 37, 4, 959, DateTimeKind.Utc).AddTicks(9394) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 4, 959, DateTimeKind.Utc).AddTicks(9398), new DateTime(2025, 9, 15, 21, 37, 4, 959, DateTimeKind.Utc).AddTicks(9399) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 4, 959, DateTimeKind.Utc).AddTicks(9403), new DateTime(2025, 9, 15, 21, 37, 4, 959, DateTimeKind.Utc).AddTicks(9404) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6025), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6026), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6009), new DateTime(2026, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6014) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6036), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6037), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6032), new DateTime(2026, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6033) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6127), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6129) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6134), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6135) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6138), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6139) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6144), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6153) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6157), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6158) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6161), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6162) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6221), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6222) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6228), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6228) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6233), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6234) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6237), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6238) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6243), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6243) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6299), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6300) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6304), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6305) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6309), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6310) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6313), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6314) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6317), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6318) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6322), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6322) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6326), new DateTime(2025, 9, 15, 21, 37, 5, 536, DateTimeKind.Utc).AddTicks(6326) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 15, 21, 37, 5, 533, DateTimeKind.Utc).AddTicks(4359), "$2a$11$QMl/Nc3/jXuBtXfWU7XeT.TuukVgLF.UY1Zx71wFOMsYNWX1ehhDW", new DateTime(2025, 9, 15, 21, 37, 5, 533, DateTimeKind.Utc).AddTicks(4367) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CourierService",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "EstimatedDeliveryDate",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TrackingNumber",
                table: "Orders");

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
    }
}
