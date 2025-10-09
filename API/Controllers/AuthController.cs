using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.DTOs;
using MinigamesAPI.Models;
using BCrypt.Net;

namespace MinigamesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.UserId) ||
                    string.IsNullOrWhiteSpace(request.Name) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "All fields are required." });
                }

                if (request.UserType != "student" && request.UserType != "teacher")
                {
                    return BadRequest(new { message = "Invalid user type. Must be 'student' or 'teacher'." });
                }

                // Check if user already exists
                if (request.UserType == "student")
                {
                    var existingStudent = await _context.Students.FindAsync(request.UserId);
                    if (existingStudent != null)
                    {
                        return Conflict(new { message = "This Student ID is already taken." });
                    }

                    // Create new student
                    var student = new Student
                    {
                        StudentID = request.UserId,
                        StudentName = request.Name,
                        StudentPassword = BCrypt.Net.BCrypt.HashPassword(request.Password)
                    };

                    _context.Students.Add(student);
                    await _context.SaveChangesAsync();

                    return Ok(new UserResponse
                    {
                        UserId = student.StudentID,
                        Name = student.StudentName,
                        UserType = "student",
                        ScoreGame1 = student.StudentScoreGame1,
                        ScoreGame2 = student.StudentScoreGame2,
                        ScoreGame3 = student.StudentScoreGame3,
                        ScoreGame4 = student.StudentScoreGame4,
                        ScoreGame5 = student.StudentScoreGame5
                    });
                }
                else // teacher
                {
                    var existingTeacher = await _context.Teachers.FindAsync(request.UserId);
                    if (existingTeacher != null)
                    {
                        return Conflict(new { message = "This Teacher ID is already taken." });
                    }

                    // Create new teacher
                    var teacher = new Teacher
                    {
                        TeacherID = request.UserId,
                        TeacherName = request.Name,
                        TeacherPassword = BCrypt.Net.BCrypt.HashPassword(request.Password)
                    };

                    _context.Teachers.Add(teacher);
                    await _context.SaveChangesAsync();

                    return Ok(new UserResponse
                    {
                        UserId = teacher.TeacherID,
                        Name = teacher.TeacherName,
                        UserType = "teacher"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "An error occurred during registration." });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(request.UserId) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "User ID and password are required." });
                }

                if (request.UserType != "student" && request.UserType != "teacher")
                {
                    return BadRequest(new { message = "Invalid user type." });
                }

                if (request.UserType == "student")
                {
                    var student = await _context.Students.FindAsync(request.UserId);
                    if (student == null || !BCrypt.Net.BCrypt.Verify(request.Password, student.StudentPassword))
                    {
                        return Unauthorized(new { message = "Invalid credentials." });
                    }

                    return Ok(new UserResponse
                    {
                        UserId = student.StudentID,
                        Name = student.StudentName,
                        UserType = "student",
                        ScoreGame1 = student.StudentScoreGame1,
                        ScoreGame2 = student.StudentScoreGame2,
                        ScoreGame3 = student.StudentScoreGame3,
                        ScoreGame4 = student.StudentScoreGame4,
                        ScoreGame5 = student.StudentScoreGame5
                    });
                }
                else // teacher
                {
                    var teacher = await _context.Teachers.FindAsync(request.UserId);
                    if (teacher == null || !BCrypt.Net.BCrypt.Verify(request.Password, teacher.TeacherPassword))
                    {
                        return Unauthorized(new { message = "Invalid credentials." });
                    }

                    return Ok(new UserResponse
                    {
                        UserId = teacher.TeacherID,
                        Name = teacher.TeacherName,
                        UserType = "teacher"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "An error occurred during login." });
            }
        }
    }
}

