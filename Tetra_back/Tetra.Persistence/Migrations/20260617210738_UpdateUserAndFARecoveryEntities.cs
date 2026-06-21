using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tetra.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserAndFARecoveryEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "TwoFactorRecoveryCodes");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "TwoFactorRecoveryCodes",
                newName: "IsRevoked");

            migrationBuilder.RenameColumn(
                name: "DeletedAt",
                table: "TwoFactorRecoveryCodes",
                newName: "RevokedAt");

            migrationBuilder.AddColumn<string>(
                name: "AuthenticatorKey",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthenticatorKey",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "RevokedAt",
                table: "TwoFactorRecoveryCodes",
                newName: "DeletedAt");

            migrationBuilder.RenameColumn(
                name: "IsRevoked",
                table: "TwoFactorRecoveryCodes",
                newName: "IsDeleted");

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "TwoFactorRecoveryCodes",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
