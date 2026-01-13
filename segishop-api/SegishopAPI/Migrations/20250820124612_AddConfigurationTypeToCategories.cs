using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SegishopAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddConfigurationTypeToCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConfigurationType",
                table: "Categories",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ProductFilterValues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    FilterOptionId = table.Column<int>(type: "int", nullable: false),
                    FilterOptionValueId = table.Column<int>(type: "int", nullable: true),
                    CustomValue = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NumericValue = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductFilterValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductFilterValues_FilterOptionValues_FilterOptionValueId",
                        column: x => x.FilterOptionValueId,
                        principalTable: "FilterOptionValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ProductFilterValues_FilterOptions_FilterOptionId",
                        column: x => x.FilterOptionId,
                        principalTable: "FilterOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductFilterValues_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "ConfigurationType", "CreatedAt", "Description", "ImageUrl", "IsActive", "MetaDescription", "MetaTitle", "Name", "ParentId", "Slug", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Regular", new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2799), "Electronic devices and gadgets", null, true, null, null, "Electronics", null, "electronics", new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2800) },
                    { 2, "Regular", new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2834), "Fashion and apparel", null, true, null, null, "Clothing", null, "clothing", new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2835) },
                    { 3, "Regular", new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2837), "Books and literature", null, true, null, null, "Books", null, "books", new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2837) },
                    { 4, "Regular", new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2839), "Home improvement and gardening", null, true, null, null, "Home & Garden", null, "home-garden", new DateTime(2025, 8, 20, 12, 46, 11, 314, DateTimeKind.Utc).AddTicks(2839) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "DateOfBirth", "Email", "FirstName", "Gender", "IsActive", "LastLoginAt", "LastName", "PasswordHash", "Phone", "Role", "UpdatedAt" },
                values: new object[] { 1, new DateTime(2025, 8, 20, 12, 46, 11, 469, DateTimeKind.Utc).AddTicks(7847), null, "admin@segishop.com", "Admin", null, true, null, "User", "$2a$11$H4BoNKqcDEGj6qI9BMySAOdogUqkZpbdOE726wj3PomgxOG/i/CM.", null, "Admin", new DateTime(2025, 8, 20, 12, 46, 11, 469, DateTimeKind.Utc).AddTicks(7859) });

            migrationBuilder.CreateIndex(
                name: "IX_ProductFilterValues_FilterOptionId",
                table: "ProductFilterValues",
                column: "FilterOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFilterValues_FilterOptionValueId",
                table: "ProductFilterValues",
                column: "FilterOptionValueId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductFilterValues_ProductId_FilterOptionId",
                table: "ProductFilterValues",
                columns: new[] { "ProductId", "FilterOptionId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductFilterValues");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ConfigurationType",
                table: "Categories");
        }
    }
}
