using Microsoft.AspNetCore.Http.HttpResults;

public class UserService
{
    private int _nextId = 1;
    public readonly List<User> _users = new();

    public User Register(string username, string password)
    {
        if (_users.Any(e => e.username == username))
        {
            throw new Exception("This user already exists");
        }
        var hash = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User
        {
            id = _nextId++,
            username = username,
            password = hash
        };
        _users.Add(user);
        return user;
    }
    public User? Login(string username, string password)
    {
        var user = _users.FirstOrDefault(e => e.username == username);
        if (user == null)
        {
            return null;
        }
        bool ok = BCrypt.Net.BCrypt.Verify(password, user.password);
        if (!ok)
        {
            return null;
        }
        return user;
    }
    public User? GetById(int id)
    {
        return _users.FirstOrDefault(e => e.id == id);
    }
}