public class User
{
    public int id {get;set;}
    public required string username {get;set;}
    public required string password {get;set;}
    public List<Note> Notes {get;set;} = new();
}