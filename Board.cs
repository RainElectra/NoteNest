public class Board
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public int UserId { get; set; } 
    public User? User { get; set; }
    public List<Column>? Columns { get; set; } = new();
}
