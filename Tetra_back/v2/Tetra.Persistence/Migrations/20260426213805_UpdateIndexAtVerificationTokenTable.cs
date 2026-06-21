using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tetra.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIndexAtVerificationTokenTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IsRevokedIndex",
                table: "VerificationTokens");

            migrationBuilder.DropIndex(
                name: "IsUsedIndex",
                table: "VerificationTokens");

            migrationBuilder.DropIndex(
                name: "UserIdIndex",
                table: "VerificationTokens");

            migrationBuilder.CreateIndex(
                name: "IsRevokedIndex",
                table: "VerificationTokens",
                column: "IsRevoked");

            migrationBuilder.CreateIndex(
                name: "IsUsedIndex",
                table: "VerificationTokens",
                column: "IsUsed");

            migrationBuilder.CreateIndex(
                name: "UserIdIndex",
                table: "VerificationTokens",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IsRevokedIndex",
                table: "VerificationTokens");

            migrationBuilder.DropIndex(
                name: "IsUsedIndex",
                table: "VerificationTokens");

            migrationBuilder.DropIndex(
                name: "UserIdIndex",
                table: "VerificationTokens");

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
                name: "UserIdIndex",
                table: "VerificationTokens",
                column: "UserId",
                unique: true);
        }
    }
}
