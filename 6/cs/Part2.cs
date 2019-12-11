using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace cs
{
    class Part2
    {
        static (string parent, string satellite) DecodeOrbit(string inStr)
        {
            var split = inStr.Split(")");
            return (split[0], split[1]);
        }

        public static async Task Run(string[] args)
        {

            System.Console.WriteLine(string.Join(",", args));
            if (!File.Exists(args[0]))
            {
                return;
            }
            var lines = await File.ReadAllLinesAsync(args[0]);

            Dictionary<string, List<string>> mapDict = new Dictionary<string, List<string>>();
            Dictionary<string, int> depthMap = new Dictionary<string, int>();
            foreach (string line in lines)
            {
                var decodedOrbit = DecodeOrbit(line);
                if (!mapDict.ContainsKey(decodedOrbit.parent))
                {
                    mapDict.Add(decodedOrbit.parent, new List<string>());
                    depthMap.Add(decodedOrbit.parent, -1);
                }
                if (!mapDict.ContainsKey(decodedOrbit.satellite))
                {
                    mapDict.Add(decodedOrbit.satellite, new List<string>());
                    depthMap.Add(decodedOrbit.satellite, -1);
                }
                mapDict[decodedOrbit.parent].Add(decodedOrbit.satellite);
            }

            List<string> pathToBody(string root, int depth, string target)
            {
                depthMap[root] = depth;

                if (root == target)
                {
                    //Base Case
                    return new List<string>(new string[] { root });
                }
                else
                {
                    foreach (string child in mapDict[root])
                    {
                        var cPath = pathToBody(child, depth + 1, target);
                        if (cPath != null)
                        {
                            cPath.Insert(0, root);
                            return cPath;
                        }
                    }
                    return null;
                }
            }

            List<string> pathToYOU = pathToBody("COM", 0, "YOU");
            List<string> pathToSAN = pathToBody("COM", 0, "SAN");

            string lca = null;
            for (int i = 0; i < Math.Min(pathToYOU.Count - 1, pathToSAN.Count - 1); i++)
            {
                if (pathToYOU[i] == pathToSAN[i])
                {
                    lca = pathToYOU[i];
                }
                else
                {
                    break;
                }
            }

            // (YOU + SAN - (2 * LCA)) - 2
            var distance = ((depthMap["YOU"] + depthMap["SAN"]) - (2 * depthMap[lca])) - 2;
            Console.WriteLine(distance);
        }


    }
}
