using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProductReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductReviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    ReviewerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ReviewerEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ReviewText = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    IsVerifiedPurchase = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductReviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductReviews_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductReviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9454), new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9456) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9460), new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9460) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9463), new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9463) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9465), new DateTime(2025, 9, 17, 16, 6, 45, 820, DateTimeKind.Utc).AddTicks(9466) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(112), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(113), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(95), new DateTime(2026, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(102) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt", "ValidFrom", "ValidUntil" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(123), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(123), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(120), new DateTime(2026, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(121) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(259), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(261) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(265), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(266) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(269), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(270) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(273), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(280) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(283), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(284) });

            migrationBuilder.UpdateData(
                table: "ShippingClasses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(286), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(287) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(406), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(406) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(411), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(412) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(415), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(415) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(418), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(419) });

            migrationBuilder.UpdateData(
                table: "ShippingMethods",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(422), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(423) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(513), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(514) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(518), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(519) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(522), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(523) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(526), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(527) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(531), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(531) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(534), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(535) });

            migrationBuilder.UpdateData(
                table: "ShippingZones",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(538), new DateTime(2025, 9, 17, 16, 6, 46, 33, DateTimeKind.Utc).AddTicks(538) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 17, 16, 6, 46, 27, DateTimeKind.Utc).AddTicks(2355), "$2a$11$XEF8MHQJDEgvxW3/BHXTWeomtAOWO30i0ISgKRz1P0h6cW3IqVNa6", new DateTime(2025, 9, 17, 16, 6, 46, 27, DateTimeKind.Utc).AddTicks(2361) });

            migrationBuilder.CreateIndex(
                name: "IX_ProductReviews_ProductId",
                table: "ProductReviews",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductReviews_UserId",
                table: "ProductReviews",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductReviews");

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
    }
}
