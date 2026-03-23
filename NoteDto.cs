public class NoteDto
{
    public required string name { get; set; }
    public string? content { get; set; }
    public bool isDone { get; set; } = false;
    public required string date { get; set; }
}