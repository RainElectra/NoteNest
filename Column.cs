public class Column
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public List<Note>? Notes { get; set; } = new();
    public int BoardId { get; set; }
    public Board? Board { get; set; }
}