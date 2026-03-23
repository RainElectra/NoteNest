public class UpdatedNoteDto
{
    public required string Name { get; set; }
    public string? Content { get; set; }
    public bool isDone {get;set;}
    public required string Date { get; set; }
}