using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.DTOs;

namespace MinigamesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ScoreController> _logger;

        public ScoreController(ApplicationDbContext context, ILogger<ScoreController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPut("{studentId}")]
        public async Task<ActionResult> UpdateScore(string studentId, [FromBody] UpdateScoreRequest request)
        {
            try
            {
                var student = await _context.Students.FindAsync(studentId);
                if (student == null)
                {
                    return NotFound(new { message = "Student not found." });
                }

                // Validate game number
                if (request.GameNumber < 1 || request.GameNumber > 5)
                {
                    return BadRequest(new { message = "Game number must be between 1 and 5." });
                }

                // Validate score
                if (request.Score < 0)
                {
                    return BadRequest(new { message = "Score cannot be negative." });
                }

                // Update the appropriate game score
                switch (request.GameNumber)
                {
                    case 1:
                        student.StudentScoreGame1 = request.Score;
                        break;
                    case 2:
                        student.StudentScoreGame2 = request.Score;
                        break;
                    case 3:
                        student.StudentScoreGame3 = request.Score;
                        break;
                    case 4:
                        student.StudentScoreGame4 = request.Score;
                        break;
                    case 5:
                        student.StudentScoreGame5 = request.Score;
                        break;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Score updated successfully.",
                    student = new UserResponse
                    {
                        UserId = student.StudentID,
                        Name = student.StudentName,
                        UserType = "student",
                        ScoreGame1 = student.StudentScoreGame1,
                        ScoreGame2 = student.StudentScoreGame2,
                        ScoreGame3 = student.StudentScoreGame3,
                        ScoreGame4 = student.StudentScoreGame4,
                        ScoreGame5 = student.StudentScoreGame5
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating score for student {StudentId}", studentId);
                return StatusCode(500, new { message = "An error occurred while updating the score." });
            }
        }

        [HttpGet("rankings/{gameNumber}")]
        public async Task<ActionResult<List<UserResponse>>> GetRankings(int gameNumber)
        {
            try
            {
                if (gameNumber < 1 || gameNumber > 5)
                {
                    return BadRequest(new { message = "Game number must be between 1 and 5." });
                }

                var students = await _context.Students.ToListAsync();

                // Sort students by the specified game score
                var rankings = students.Select(s => new UserResponse
                {
                    UserId = s.StudentID,
                    Name = s.StudentName,
                    UserType = "student",
                    ScoreGame1 = s.StudentScoreGame1,
                    ScoreGame2 = s.StudentScoreGame2,
                    ScoreGame3 = s.StudentScoreGame3,
                    ScoreGame4 = s.StudentScoreGame4,
                    ScoreGame5 = s.StudentScoreGame5
                }).ToList();

                // Sort by the specific game score
                rankings = gameNumber switch
                {
                    1 => rankings.OrderByDescending(s => s.ScoreGame1).ToList(),
                    2 => rankings.OrderByDescending(s => s.ScoreGame2).ToList(),
                    3 => rankings.OrderByDescending(s => s.ScoreGame3).ToList(),
                    4 => rankings.OrderByDescending(s => s.ScoreGame4).ToList(),
                    5 => rankings.OrderByDescending(s => s.ScoreGame5).ToList(),
                    _ => rankings
                };

                return Ok(rankings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching rankings for game {GameNumber}", gameNumber);
                return StatusCode(500, new { message = "An error occurred while fetching rankings." });
            }
        }
    }
}

