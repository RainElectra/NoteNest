using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ColumnController : ControllerBase
{
    private readonly ColumnService _service;
    private readonly UserService _userService;
    public ColumnController(ColumnService service, UserService userService)
    {
        _service = service;
        _userService = userService;
    }

    [Authorize]
    [HttpPost("boards/{boardId}/columns")]
    public IActionResult CreateColumn(int boardId, [FromBody] ColumnDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var column = _service.CreateColumn(userId, boardId, dto);

        return Ok(new
        {
            column.Id,
            column.Name,
            column.BoardId
        });
    }
    [Authorize]
    [HttpGet("boards/{boardId}/columns")]
    public IActionResult GetColumns(int boardId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(_service.GetAllColumns(userId, boardId));
    }
    [Authorize]
    [HttpDelete("boards/{boardId}/columns/{id}")]
    public IActionResult DeleteColumn(int boardId, int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return Ok(_service.DeleteColumn(userId, boardId, id));
    }
}