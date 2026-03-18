using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hukaa_back.Migrations
{
    /// <inheritdoc />
    public partial class updateExperiencesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "WorkExperiences",
                newName: "StartAt");

            migrationBuilder.RenameColumn(
                name: "JobTitle",
                table: "WorkExperiences",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "JobDescription",
                table: "WorkExperiences",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "IsDelete",
                table: "WorkExperiences",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "WorkExperiences",
                newName: "EndAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "WorkExperiences",
                newName: "JobTitle");

            migrationBuilder.RenameColumn(
                name: "StartAt",
                table: "WorkExperiences",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "WorkExperiences",
                newName: "IsDelete");

            migrationBuilder.RenameColumn(
                name: "EndAt",
                table: "WorkExperiences",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "WorkExperiences",
                newName: "JobDescription");
        }
    }
}
