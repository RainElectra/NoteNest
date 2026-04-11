using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "name",
                table: "Notes",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "isDone",
                table: "Notes",
                newName: "IsDone");

            migrationBuilder.RenameColumn(
                name: "date",
                table: "Notes",
                newName: "Date");

            migrationBuilder.RenameColumn(
                name: "content",
                table: "Notes",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Notes",
                newName: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_username",
                table: "Users",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_username",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Notes",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "IsDone",
                table: "Notes",
                newName: "isDone");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Notes",
                newName: "date");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Notes",
                newName: "content");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Notes",
                newName: "id");
        }
    }
}
