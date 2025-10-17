using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinigamesAPI.Data;
using MinigamesAPI.DTOs;
using MinigamesAPI.Models;

namespace MinigamesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentProgressController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<StudentProgressController> _logger;

        public StudentProgressController(ApplicationDbContext context, ILogger<StudentProgressController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("assign")]
        public async Task<ActionResult> AssignStudentToTeacher([FromBody] AssignStudentRequest request)
        {
            try
            {
                // Validate that teacher exists
                var teacher = await _context.Teachers.FindAsync(request.teacherId);
                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher not found." });
                }

                // Validate that student exists
                var student = await _context.Students.FindAsync(request.studentId);
                if (student == null)
                {
                    return NotFound(new { message = "Student not found." });
                }

                // Check if assignment already exists
                var existingAssignment = await _context.StudentProgress
                    .FirstOrDefaultAsync(sp => sp.StudentID == request.studentId);
                
                if (existingAssignment != null)
                {
                    return Conflict(new { message = "Student is already assigned to a teacher." });
                }

                // Create new assignment
                var studentProgress = new StudentProgress
                {
                    TeacherID = request.teacherId,
                    StudentID = request.studentId
                };

                _context.StudentProgress.Add(studentProgress);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Student assigned to teacher successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning student to teacher");
                return StatusCode(500, new { message = "An error occurred while assigning student to teacher." });
            }
        }

        [HttpGet("teacher/{teacherId}")]
        public async Task<ActionResult<List<UserResponse>>> GetStudentsByTeacher(string teacherId)
        {
            try
            {
                var students = await _context.StudentProgress
                    .Where(sp => sp.TeacherID == teacherId)
                    .Include(sp => sp.Student)
                        .ThenInclude(s => s.StudentScores)
                    .Select(sp => new UserResponse
                    {
                        UserId = sp.Student.StudentID,
                        Name = sp.Student.StudentName,
                        UserType = "student",
                        ScoreGame1 = sp.Student.StudentScores != null ? sp.Student.StudentScores.Game1Score : 0,
                        ScoreGame2 = sp.Student.StudentScores != null ? sp.Student.StudentScores.Game2Score : 0,
                        ScoreGame3 = sp.Student.StudentScores != null ? sp.Student.StudentScores.Game3Score : 0,
                        ScoreGame4 = sp.Student.StudentScores != null ? sp.Student.StudentScores.Game4Score : 0,
                        ScoreGame5 = sp.Student.StudentScores != null ? sp.Student.StudentScores.Game5Score : 0,
                        LastUpdated = sp.Student.StudentScores != null ? sp.Student.StudentScores.UpdatedAt : null
                    })
                    .ToListAsync();

                return Ok(students);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching students for teacher {TeacherId}", teacherId);
                return StatusCode(500, new { message = "An error occurred while fetching students." });
            }
        }

        [HttpDelete("unassign/{studentId}")]
        public async Task<ActionResult> UnassignStudent(string studentId)
        {
            try
            {
                var assignment = await _context.StudentProgress
                    .FirstOrDefaultAsync(sp => sp.StudentID == studentId);

                if (assignment == null)
                {
                    return NotFound(new { message = "Student assignment not found." });
                }

                _context.StudentProgress.Remove(assignment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Student unassigned successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error unassigning student {StudentId}", studentId);
                return StatusCode(500, new { message = "An error occurred while unassigning student." });
            }
        }
    }
}
