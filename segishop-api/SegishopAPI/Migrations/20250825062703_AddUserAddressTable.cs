using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAddressTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserAddresses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Company = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Address1 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Address2 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ZipCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserAddresses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_UserAddresses_UserId",
                table: "UserAddresses",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserAddresses");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9940), new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9942) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9945), new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9946) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9948), new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9949) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9951), new DateTime(2025, 8, 23, 8, 25, 3, 453, DateTimeKind.Utc).AddTicks(9951) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7161), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7162) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7193), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7194) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7199), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7200) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7203), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7204) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7209), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7210) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7213), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7214) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7335), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7336) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7343), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7344) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7348), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7349) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7352), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7353) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7356), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7357) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7507), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7508) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7518), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7519) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7523), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7524) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7528), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7528) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7537), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7538) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7541), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7542) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7545), new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(7546) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(5981), "$2a$11$EBKUCl7ux5myZ/uS8T8dreEPa60UoQlCYyqa1qoDlI12/uRzH.4Pm", new DateTime(2025, 8, 23, 8, 25, 3, 601, DateTimeKind.Utc).AddTicks(5988) });
        }
    }
}
