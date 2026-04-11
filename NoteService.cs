using Microsoft.EntityFrameworkCore;
using System.Globalization;

public class NoteService
{
    private readonly AppDbContext _context;

    public NoteService(AppDbContext context)
    {
        _context = context;
    }

    public List<Note> GetAllNotes(int userId, int boardId, int columnId)
    {
        return _context.Notes
            .Where(n =>
                n.ColumnId == columnId &&
                n.Column!.BoardId == boardId &&
                n.Column!.Board!.UserId == userId)
            .ToList();
    }

    public Note CreateNote(int userId, int boardId, int columnId, NoteDto dto)
    {
        var column = _context.Columns
            .FirstOrDefault(c =>
                c.Id == columnId &&
                c.BoardId == boardId &&
                c.Board!.UserId == userId)
            ?? throw new Exception("Column not found");

        if (!DateOnly.TryParseExact(dto.date, "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var date))
        {
            throw new Exception("Invalid date format");
        }


        var note = new Note
        {
            Name = dto.name,
            Content = dto.content,
            IsDone = dto.isDone,
            Date = date,
            ColumnId = column.Id
        };

        _context.Notes.Add(note);
        _context.SaveChanges();

        return note;
    }

    public Note UpdateNote(int userId, int boardId, int columnId, int noteId, UpdatedNoteDto dto)
    {
        var note = _context.Notes
            .FirstOrDefault(n =>
                n.Id == noteId &&
                n.ColumnId == columnId &&
                n.Column!.BoardId == boardId &&
                n.Column!.Board!.UserId == userId)
            ?? throw new Exception("Note not found");

        note.Name = dto.Name;
        note.Content = dto.Content;
        note.IsDone = dto.isDone;
        note.Date = DateOnly.ParseExact(dto.Date, "yyyy-MM-dd");

        _context.SaveChanges();

        return note;
    }

    public void DeleteNote(int userId, int boardId, int columnId, int noteId)
    {
        var note = _context.Notes
            .FirstOrDefault(n =>
                n.Id == noteId &&
                n.ColumnId == columnId &&
                n.Column!.BoardId == boardId &&
                n.Column!.Board!.UserId == userId)
            ?? throw new Exception("Note not found");

        _context.Notes.Remove(note);
        _context.SaveChanges();
    }

    public void MoveNote(int userId, int boardId, int columnId, int noteId, int targetColumnId)
    {
        var note = _context.Notes
            .FirstOrDefault(n =>
                n.Id == noteId &&
                n.ColumnId == columnId &&
                n.Column!.BoardId == boardId &&
                n.Column!.Board!.UserId == userId)
            ?? throw new Exception("Note not found");

        var targetColumn = _context.Columns
            .FirstOrDefault(c =>
                c.Id == targetColumnId &&
                c.BoardId == boardId &&
                c.Board!.UserId == userId)
            ?? throw new Exception("Target column not found");

        note.ColumnId = targetColumnId;

        _context.SaveChanges();
    }
}