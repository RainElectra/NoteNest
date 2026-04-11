using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NoteController : ControllerBase
{
    private readonly NoteService _noteService;
    private readonly UserService _userService;

    public NoteController(NoteService noteService, UserService userService)
    {
        _noteService = noteService;
        _userService = userService;
    }
    [Authorize]
    [HttpGet("boards/{boardId}/columns/{columnId}")]
    public IActionResult GetNotesForColumn(int boardId, int columnId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(_noteService.GetAllNotes(userId, boardId, columnId));
    }
    [Authorize]
    [HttpPost("boards/{boardId}/columns/{columnId}")]
    public IActionResult CreateNote(int boardId, int columnId, [FromBody] NoteDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var note = _noteService.CreateNote(userId, boardId, columnId, dto);

        return Ok(new
        {
            note.Id,
            note.Name,
            note.Content,
            note.IsDone,
            note.Date,
            note.ColumnId
        });
    }
    [Authorize]
    [HttpPut("boards/{boardId}/columns/{columnId}/notes/{noteId}")]
    public IActionResult UpdateNote(int boardId, int columnId, int noteId, [FromBody] UpdatedNoteDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(_noteService.UpdateNote(userId, boardId, columnId, noteId, dto));
    }
    [Authorize]
    [HttpDelete("boards/{boardId}/columns/{columnId}/notes/{noteId}")]
    public IActionResult DeleteNote(int boardId, int columnId, int noteId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        _noteService.DeleteNote(userId, boardId, columnId, noteId);
        return Ok();
    }
    [Authorize]
    [HttpPost("boards/{boardId}/columns/{columnId}/notes/{noteId}/move/{targetColumnId}")]
    public IActionResult MoveNote(int boardId, int columnId, int noteId, int targetColumnId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        _noteService.MoveNote(userId, boardId, columnId, noteId, targetColumnId);
        return Ok();
    }
}