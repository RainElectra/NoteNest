public class Note
{
    public int id { get; set; }
    public required string name { get; set; }
    public string? content { get; set; }
    public required bool isDone { get; set; }
    public DateOnly date { get; set; }
}