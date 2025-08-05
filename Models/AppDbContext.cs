using Microsoft.EntityFrameworkCore;

namespace local_notes.Models
{
    public class AppDbContext : DbContext
    {
        public DbSet<Note> Notes { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the Backlinks property to be stored as a single string
            // and converted to/from a string array
            modelBuilder.Entity<Note>()
                .Property(e => e.Backlinks)
                .HasConversion(
                    v => string.Join(';', v ?? new string[0]),
                    v => v.Split(';', StringSplitOptions.RemoveEmptyEntries));
        }
    }
}
