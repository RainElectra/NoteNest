using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<Column> Columns { get; set; }
    public DbSet<Note> Notes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // (1-багато)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Boards)
            .WithOne(b => b.User!)
            .HasForeignKey("UserId")
            .OnDelete(DeleteBehavior.Cascade);

        // (1-багато)
        modelBuilder.Entity<Board>()
            .HasMany(b => b.Columns)
            .WithOne(c => c.Board!)
            .HasForeignKey("BoardId")
            .OnDelete(DeleteBehavior.Cascade);

        // (1-багато)
        modelBuilder.Entity<Column>()
            .HasMany(c => c.Notes)
            .WithOne(n => n.Column)
            .HasForeignKey(n => n.ColumnId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.username)
            .IsUnique();

        modelBuilder.Entity<Note>()
            .Property(n => n.Date)
            .HasColumnType("date");
    }
}