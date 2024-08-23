using api.Data;
using api.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace api.Controllers
{
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly IConfiguration _config;

        public AccountController(
            DataContext dataContext,
            IConfiguration config
            )
        {
            _dataContext = dataContext;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequestDto registerDto)
        {
            var user = await _dataContext.Users.Where(x => x.Email == registerDto.Email).FirstOrDefaultAsync();
            if (user != null)
                return BadRequest("This e-mail already exists.");

            string salt;
            string hashedPassword = hashPassword(registerDto.Password, out salt);

            user = new User()
            {
                Id = Guid.NewGuid(),
                FirstName = registerDto.FirstName,
                Surname = registerDto.Surname,
                Email = registerDto.Email,
                HashedPassword = hashedPassword,
                PasswordSalt = salt
            };

            _dataContext.Users.Add(user);

            await _dataContext.SaveChangesAsync();

            var response = new RegisterResponseDto()
            {
                User = new UserDto()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    Surname = user.Surname,
                    Email = user.Email
                },
                AuthToken = createToken(user)
            };

            return new JsonResult(response);
        }


        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            var user = await _dataContext
                .Users
                .Where(x => x.Email == loginDto.Email)
                .FirstOrDefaultAsync();

            if (user == null)
                return Unauthorized();

            if (verifyPassword(loginDto.Password, user.HashedPassword, user.PasswordSalt) == false)
                return Unauthorized();

            var response = new LoginResponseDto()
            {
                User = new UserDto()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    Surname = user.Surname,
                    Email = user.Email
                },
                AuthToken = createToken(user)
            };

            return new JsonResult(response);
        }

        private string hashPassword(string password, out string salt)
        {
            var byteSalt = RandomNumberGenerator.GetBytes(32);
            var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password), byteSalt, 10, HashAlgorithmName.SHA512, 32);

            string strHash = Convert.ToHexString(hash);
            salt = Convert.ToHexString(byteSalt);

            return strHash;
        }

        private bool verifyPassword(string password, string hash, string salt)
        {
            var byteSalt = Convert.FromHexString(salt);
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password), byteSalt, 10, HashAlgorithmName.SHA512, 32);

            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
        }

        private string createToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FirstName),
                new Claim(ClaimTypes.Surname, user.Surname),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescription);

            string strToken = tokenHandler.WriteToken(token);

            return strToken;
        }

        [Authorize]
        [HttpGet("userprofile")]
        public async Task<ActionResult> UserProfile()
        {
            try
            {
                var userId = Guid.Parse(this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value);

                var user = await _dataContext.Users.Where(x => x.Id == userId).FirstOrDefaultAsync();
                if (user == null)
                    return NotFound();

                var userDto = new UserDto()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    Surname = user.Surname,
                    Email = user.Email,
                    About = user.About
                };

                return new JsonResult(userDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

       
        [HttpGet("authorprofile/{id}")]
        public async Task<ActionResult> AuthorProfile(Guid id)
        {
            try
            {
                var user = await _dataContext.Users.Where(x => x.Id == id).FirstOrDefaultAsync();
                if (user == null)
                    return NotFound();

                var userDto = new UserDto()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    Surname = user.Surname,                   
                    About = user.About
                };

                return new JsonResult(userDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("userprofile")]
        public async Task<ActionResult> UpdateUserProfile([FromBody] UpdateUserRequest updateUser)
        {
            try
            {
                var userId = Guid.Parse(this.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value);

                var user = await _dataContext.Users.Where(x => x.Id == userId).FirstOrDefaultAsync();
                if (user == null)
                    return NotFound();
               

                if(!String.IsNullOrEmpty(updateUser.Password) && !String.IsNullOrEmpty(updateUser.PasswordConfirm))
                {
                    if (updateUser.Password.Length != updateUser.PasswordConfirm.Length || 
                        updateUser.Password != updateUser.PasswordConfirm)
                        return BadRequest("Passworda are not the same");

                    string salt;
                    string hashedPassword = hashPassword(updateUser.Password, out salt);

                    user.HashedPassword = hashedPassword;
                    user.PasswordSalt = salt;
                }

                user.FirstName = updateUser.FirstName;
                user.Surname = updateUser.Surname;
                user.About = updateUser.About;

                await _dataContext.SaveChangesAsync();

                return Ok("User updated");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
