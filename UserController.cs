using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _service;
    public UserController(UserService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserDto dto)
    {
        try
        {
            var user = _service.Register(dto.Username, dto.Password);
            return Ok(new { user.id, user.username });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody] UserDto dto)
    {
        var user = _service.Login(dto.Username, dto.Password);
        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("cherry_bomb_tangerine_dolphin_palm735");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
                new Claim(ClaimTypes.Name, user.username)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwt = tokenHandler.WriteToken(token);
        return Ok(new {token = jwt});
    }
    [HttpGet("users/{id}")]
    public IActionResult GetById(int id)
    {
        return Ok(_service.GetById(id));
    }
}