using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YouthActionDotNet.Migrations
{
    /// <inheritdoc />
    public partial class Report : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    ReportId = table.Column<string>(type: "TEXT", nullable: false),
                    ReportName = table.Column<string>(type: "TEXT", nullable: true),
                    ReportDateCreation = table.Column<string>(type: "TEXT", nullable: true),
                    ReportStartDate = table.Column<string>(type: "TEXT", nullable: true),
                    ReportEndDate = table.Column<string>(type: "TEXT", nullable: true),
                    FileId = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report", x => x.ReportId);
                    table.ForeignKey(
                        name: "FK_Report_File_FileId",
                        column: x => x.FileId,
                        principalTable: "File",
                        principalColumn: "FileId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Report_FileId",
                table: "Report",
                column: "FileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Report");
        }
    }
}
