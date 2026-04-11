public class Note
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Content { get; set; }
    public bool IsDone { get; set; }
    public DateOnly Date { get; set; }

    public int ColumnId { get; set; } 
    public Column? Column { get; set; }
}