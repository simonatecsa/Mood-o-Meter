using System;

namespace Mood_o_Meter.Models
{
    public class Mood
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public DateTime Timestamp { get; set; }
        public string Moood { get; set; }
    }
}