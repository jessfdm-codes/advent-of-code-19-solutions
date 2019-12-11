using System;
using cs;

public class Run
{
    static async System.Threading.Tasks.Task Main(string[] args)
    {
        //Part 1
        Console.WriteLine("===PART 1===");
        await Part1.Run(args);
        //Part 2
        Console.WriteLine("===PART 2===");
        await Part2.Run(args);
    }
}