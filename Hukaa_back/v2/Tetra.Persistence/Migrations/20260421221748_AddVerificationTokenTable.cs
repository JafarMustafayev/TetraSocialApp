using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tetra.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddVerificationTokenTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VerificationTokens",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TokenHash = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Purpose = table.Column<int>(type: "int", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Target = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedByIp = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    UsedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UsedByIp = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    RevokedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RevokedByIp = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    RevocationReason = table.Column<int>(type: "int", nullable: true),
                    ReplacedByTokenId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VerificationTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VerificationTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VerificationTokens_VerificationTokens_ReplacedByTokenId",
                        column: x => x.ReplacedByTokenId,
                        principalTable: "VerificationTokens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VerificationTokens_ReplacedByTokenId",
                table: "VerificationTokens",
                column: "ReplacedByTokenId");

            migrationBuilder.CreateIndex(
                name: "IsRevokedIndex",
                table: "VerificationTokens",
                column: "IsRevoked",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IsUsedIndex",
                table: "VerificationTokens",
                column: "IsUsed",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "TokenHashIndex",
                table: "VerificationTokens",
                column: "TokenHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UserIdIndex",
                table: "VerificationTokens",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VerificationTokens");
        }
    }
}
