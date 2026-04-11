using Microsoft.EntityFrameworkCore;

public class BoardService
{
    private readonly AppDbContext _context;

    public BoardService(AppDbContext context)
    {
        _context = context;
    }

    public List<Board> GetAllBoards(int userId)
    {
        return _context.Boards
            .Where(b => b.UserId == userId)
            .Include(b => b.Columns)
            .ToList();
    }

    public Board CreateBoard(int userId, BoardDto dto)
    {
        var board = new Board
        {
            Name = dto.Name,
            UserId = userId
        };

        _context.Boards.Add(board);
        _context.SaveChanges();

        return board;
    }

    public Board RenameBoard(int userId, int boardId, string newName)
    {
        var board = _context.Boards
            .FirstOrDefault(b => b.Id == boardId && b.UserId == userId)
            ?? throw new Exception("Board not found");

        board.Name = newName;

        _context.Boards.Update(board);
        _context.SaveChanges();
        return board;
    }

    public void DeleteBoard(int userId, int boardId)
    {
        var board = _context.Boards
            .FirstOrDefault(b => b.Id == boardId && b.UserId == userId)
            ?? throw new Exception("Board not found");

        _context.Boards.Remove(board);
        _context.SaveChanges();
    }
}