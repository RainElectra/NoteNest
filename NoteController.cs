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
    [HttpGet]
    public IActionResult GetNotes()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = _userService.GetById(userId)!;
        return Ok(_noteService.GetAllNotes(user));
    }
    [Authorize]
    [HttpPost]
    public IActionResult CreateNote(NoteDto dto)
    {   
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = _userService.GetById(userId)!;
        return Ok(_noteService.CreateNote(user, dto));
    }
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult UpdateNote(int id, UpdatedNoteDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = _userService.GetById(userId)!;
        return Ok(_noteService.UpdateNote(id, dto, user));
    }
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult DeleteNote(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = _userService.GetById(userId)!;
        return Ok(_noteService.DeleteNote(id, user));
    }
}