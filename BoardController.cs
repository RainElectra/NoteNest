using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class BoardController : ControllerBase
{
    public readonly BoardService _service;
    public readonly UserService _userService;
    public BoardController(BoardService service, UserService userService)
    {
        _service = service;
        _userService = userService;
    }
    [Authorize]
    [HttpGet]
    public IActionResult GetBoards()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(_service.GetAllBoards(userId));
    }
    [Authorize]
    [HttpPost]
    public IActionResult CreateBoard([FromBody] BoardDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(_service.CreateBoard(userId, dto));
    }
    [Authorize]
    [HttpPut("{id}")]
    public IActionResult RenameBoard(int id, [FromBody] RenameBoardDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(_service.RenameBoard(userId, id, dto.Name));
    }
    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult DeleteBoard(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        _service.DeleteBoard(userId, id);
        return Ok();
    }
}