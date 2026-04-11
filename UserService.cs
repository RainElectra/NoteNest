using Microsoft.EntityFrameworkCore;

public class UserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }
    public User Register(string username, string password)
    {
        var exists = _context.Users.Any(u => u.username == username);
        if (exists)
            throw new Exception("User already exists");

        var hash = BCrypt.Net.BCrypt.HashPassword(password);

        var user = new User
        {
            username = username,
            password = hash
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return user;
    }
    public User? Login(string username, string password)
    {
        var user = _context.Users
            .AsNoTracking() 
            .FirstOrDefault(u => u.username == username);

        if (user == null)
            return null;

        var isValid = BCrypt.Net.BCrypt.Verify(password, user.password);
        if (!isValid)
            return null;

        return user;
    }
    public User? GetById(int id)
    {
            return _context.Users
                .Include(u => u.Boards!)
                    .ThenInclude(b => b.Columns!)
                        .ThenInclude(c => c.Notes!)
                .FirstOrDefault(u => u.id == id);
    }
    public User? GetByIdLight(int id)
    {
        return _context.Users
            .AsNoTracking()
            .FirstOrDefault(u => u.id == id);
    }
}