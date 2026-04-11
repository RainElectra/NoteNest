using Microsoft.EntityFrameworkCore;

public class ColumnService
{
    private readonly AppDbContext _context;

    public ColumnService(AppDbContext context)
    {
        _context = context;
    }

    public List<Column> GetAllColumns(int userId, int boardId)
    {
        return _context.Columns
            .Where(c => c.BoardId == boardId && c.Board!.UserId == userId)
            .ToList();
    }

    public Column CreateColumn(int userId, int boardId, ColumnDto dto)
    {
        var board = _context.Boards
            .FirstOrDefault(b => b.Id == boardId && b.UserId == userId)
            ?? throw new Exception("Board not found");

        var column = new Column
        {
            Name = dto.Name,
            BoardId = board.Id
        };

        _context.Columns.Add(column);
        _context.SaveChanges();

        return column;
    }

    public Column DeleteColumn(int userId, int boardId, int columnId)
    {
        var column = _context.Columns
            .FirstOrDefault(c =>
                c.Id == columnId &&
                c.BoardId == boardId &&
                c.Board!.UserId == userId)
            ?? throw new Exception("Column not found");

        _context.Columns.Remove(column);
        _context.SaveChanges();

        return column;
    }
}