using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.DTOs;

namespace MinigamesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(ApplicationDbContext context, ILogger<ProfileController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponse>> GetProfile(string userId)
        {
            try
            {
                // Try to find student first
                var student = await _context.Students.FindAsync(userId);
                if (student != null)
                {
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

                // Try to find teacher
                var teacher = await _context.Teachers.FindAsync(userId);
                if (teacher != null)
                {
                    return Ok(new UserResponse
                    {
                        UserId = teacher.TeacherID,
                        Name = teacher.TeacherName,
                        UserType = "teacher"
                    });
                }

                return NotFound(new { message = "User not found." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching profile for user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while fetching the profile." });
            }
        }

        [HttpGet("students")]
        public async Task<ActionResult<List<UserResponse>>> GetAllStudents()
        {
            try
            {
                var students = await _context.Students
                    .Select(s => new UserResponse
                    {
                        UserId = s.StudentID,
                        Name = s.StudentName,
                        UserType = "student",
                        ScoreGame1 = s.StudentScoreGame1,
                        ScoreGame2 = s.StudentScoreGame2,
                        ScoreGame3 = s.StudentScoreGame3,
                        ScoreGame4 = s.StudentScoreGame4,
                        ScoreGame5 = s.StudentScoreGame5
                    })
                    .ToListAsync();

                return Ok(students);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all students");
                return StatusCode(500, new { message = "An error occurred while fetching students." });
            }
        }
    }
}

