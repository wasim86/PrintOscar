using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

public class CsvTest
{
    public static void Main()
    {
        string filePath = "import_source.csv";
        string targetId = "1787";

        if (!File.Exists(filePath))
        {
            Console.WriteLine("File not found");
            return;
        }

        using (var reader = new StreamReader(filePath))
        {
            string headerLine = reader.ReadLine();
            var headers = ParseCsvLine(headerLine);
            var headerMap = new Dictionary<string, int>();
            for (int i = 0; i < headers.Length; i++) headerMap[headers[i]] = i;

            Console.WriteLine("Headers found: " + headers.Length);
            if (headerMap.ContainsKey("Regular price")) Console.WriteLine("Regular price index: " + headerMap["Regular price"]);
            if (headerMap.ContainsKey("Images")) Console.WriteLine("Images index: " + headerMap["Images"]);

            while (!reader.EndOfStream)
            {
                string line = reader.ReadLine();
                if (string.IsNullOrWhiteSpace(line)) continue;

                // Handle multiline
                while (line.Count(c => c == '\"') % 2 != 0 && !reader.EndOfStream)
                {
                    var nextLine = reader.ReadLine();
                    if (nextLine == null) break;
                    line += Environment.NewLine + nextLine;
                }

                var parts = ParseCsvLine(line);
                string id = GetVal(parts, headerMap, "ID");

                if (id == targetId)
                {
                    Console.WriteLine("Found ID " + targetId);
                    Console.WriteLine("Parts count: " + parts.Length);
                    Console.WriteLine("Price Raw: '" + GetVal(parts, headerMap, "Regular price") + "'");
                    Console.WriteLine("Images Raw: '" + GetVal(parts, headerMap, "Images") + "'");
                    
                    decimal price = ParsePrice(GetVal(parts, headerMap, "Regular price"));
                    Console.WriteLine("Parsed Price: " + price);
                    break;
                }
            }
        }
    }

    private static string[] ParseCsvLine(string line)
    {
        var list = new List<string>();
        bool inQuotes = false;
        string current = "";
        for (int i = 0; i < line.Length; i++)
        {
            char c = line[i];
            if (c == '\"')
            {
                if (inQuotes && i + 1 < line.Length && line[i + 1] == '\"')
                {
                    current += "\"";
                    i++;
                }
                else inQuotes = !inQuotes;
            }
            else if (c == ',' && !inQuotes)
            {
                list.Add(current);
                current = "";
            }
            else current += c;
        }
        list.Add(current);
        return list.ToArray();
    }

    private static string GetVal(string[] parts, Dictionary<string, int> headerMap, string colName)
    {
        if (headerMap.TryGetValue(colName, out int idx) && idx < parts.Length)
        {
            return parts[idx]?.Trim() ?? "";
        }
        return "";
    }

    private static decimal ParsePrice(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return 0;
        var clean = Regex.Replace(input, @"[^0-9\.]", "");
        if (decimal.TryParse(clean, out decimal val)) return val;
        return 0;
    }
}
