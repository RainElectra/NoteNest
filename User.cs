public class User
{
    public int id { get; set; }
    public required string username { get; set; }
    public required string password { get; set; }

    public List<Board>? Boards { get; set; } = new();
}