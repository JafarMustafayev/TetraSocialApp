using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hukaa_back.Migrations
{
    /// <inheritdoc />
    public partial class deleteSomeColm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeleteAt",
                table: "Reactions");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Reactions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeleteAt",
                table: "Reactions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Reactions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
