using System.ComponentModel.DataAnnotations;

namespace MinigamesAPI.Models
{
    public class Student
    {
        [Key]
        public string StudentID { get; set; } = string.Empty;
        
        [Required]
        public string StudentName { get; set; } = string.Empty;
        
        [Required]
        public string StudentPassword { get; set; } = string.Empty;
        
        public int StudentScoreGame1 { get; set; } = 0;
        public int StudentScoreGame2 { get; set; } = 0;
        public int StudentScoreGame3 { get; set; } = 0;
        public int StudentScoreGame4 { get; set; } = 0;
        public int StudentScoreGame5 { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

