using System.Globalization;
public class NoteService
{
    public int _nextId = 1;
    public readonly List<Note> _notes = new();
    public List<Note> GetAllNotes(User user) => user.Notes;
    public Note CreateNote(User user, NoteDto dto)
    {
        if (!DateOnly.TryParseExact(
            dto.date,
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var date))
        {
            throw new Exception("Invalid date type! Must be YYYY-MM-DD");
        }
        var note = new Note
        {
            id = _nextId++,
            name = dto.name,
            content = dto.content,
            isDone = dto.isDone,
            date = date
        };
        user.Notes.Add(note);
        return note;
    }
    public Note DeleteNote(int id, User user)
    {
        var result = user.Notes.FirstOrDefault(e => e.id == id);
        if (result == null)
            throw new Exception("Note doesn't exist!");
        if (!result.isDone)
        {
            throw new Exception("Not Done!");
        }
        ;
        user.Notes.Remove(result);
        return result;
    }
    public Note UpdateNote(int id, UpdatedNoteDto dto, User user)
    {
        var note = user.Notes.FirstOrDefault(e => e.id == id);
        if (note == null)
        {
            throw new Exception("Note not found");
        }
        ;
        if (!DateOnly.TryParseExact(
            dto.Date,
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var date))
        {
            throw new Exception("Invalid date type! Must be YYYY-MM-DD");
        }
        note.name = dto.Name;
        note.content = dto.Content;
        note.isDone = dto.isDone;
        note.date = date;
        return note;
    }
}