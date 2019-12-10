using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace cs
{
    class Program
    {
        static (string parent, string satellite) DecodeOrbit(string inStr)
        {
            var split = inStr.Split(")");
            return (split[0], split[1]);
        }

        static async Task Main(string[] args)
        {
            System.Console.WriteLine(string.Join(",", args));
            if (!File.Exists(args[0]))
            {
                return;
            }
            var lines = await File.ReadAllLinesAsync(args[0]);

            Dictionary<string, List<string>> mapDict = new Dictionary<string, List<string>>();
            foreach (string line in lines)
            {
                var decodedOrbit = DecodeOrbit(line);
                if (!mapDict.ContainsKey(decodedOrbit.parent))
                {
                    mapDict.Add(decodedOrbit.parent, new List<string>());
                }
                mapDict[decodedOrbit.parent].Add(decodedOrbit.satellite);
            }


            int orbitCount(string parent, int depth)
            {
                if (!mapDict.ContainsKey(parent))
                {
                    //Base Case 
                    return depth;
                }
                else
                {
                    return depth + mapDict[parent].Sum(s => orbitCount(s, depth + 1));
                }
            }

            Console.WriteLine(orbitCount("COM", 0));

        }


    }
}
