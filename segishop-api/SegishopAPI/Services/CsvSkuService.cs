using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;

namespace SegishopAPI.Services
{
    public interface ICsvSkuService
    {
        string? GetSku(int parentId, string attributeName, string attributeValue);
        string? GetProductSku(int productId);
    }

    public class CsvSkuService : ICsvSkuService
    {
        private static Dictionary<string, string>? _skuMap; // key: parentId-attrName-attrValue
        private static Dictionary<int, string>? _productSkuMap; // key: productId
        private static readonly object _lock = new object();
        private readonly IWebHostEnvironment _env;

        public CsvSkuService(IWebHostEnvironment env)
        {
            _env = env;
        }

        private void EnsureLoaded()
        {
            if (_skuMap != null && _productSkuMap != null) return;

            lock (_lock)
            {
                if (_skuMap != null && _productSkuMap != null) return;

                _skuMap = new Dictionary<string, string>();
                _productSkuMap = new Dictionary<int, string>();
                var path = Path.Combine(_env.ContentRootPath, "wc-product-export-2-1-2026-1767297233709.csv");

                if (!File.Exists(path)) return;

                var lines = File.ReadAllLines(path);
                if (lines.Length == 0) return;

                // Regex to split by comma ignoring quotes
                var pattern = ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)";
                
                var headerLine = lines[0];
                var headers = Regex.Split(headerLine, pattern).Select(h => h.Trim('"')).ToList();
                
                var idIndex = headers.IndexOf("ID");
                var typeIndex = headers.IndexOf("Type");
                var skuIndex = headers.IndexOf("SKU");
                var parentIndex = headers.IndexOf("Parent");

                if (idIndex == -1 || typeIndex == -1 || skuIndex == -1 || parentIndex == -1) return;
                
                // Find all attribute name/value pairs
                var attrIndices = new List<(int NameIdx, int ValueIdx)>();
                for (int i = 0; i < headers.Count; i++)
                {
                    if (headers[i].StartsWith("Attribute") && headers[i].EndsWith(" name"))
                    {
                        var nameCol = headers[i];
                        // Corresponding value column: "Attribute X value(s)"
                        var valCol = nameCol.Replace(" name", " value(s)");
                        var valIdx = headers.IndexOf(valCol);
                        if (valIdx != -1)
                        {
                            attrIndices.Add((i, valIdx));
                        }
                    }
                }

                for (int i = 1; i < lines.Length; i++)
                {
                    var line = lines[i];
                    if (string.IsNullOrWhiteSpace(line)) continue;

                    var cols = Regex.Split(line, pattern).Select(c => c.Trim('"')).ToList();
                    
                    // Safety check for column count
                    if (cols.Count <= Math.Max(idIndex, Math.Max(parentIndex, skuIndex))) continue;

                    var idStr = cols[idIndex];
                    if (!int.TryParse(idStr, out var id)) continue;

                    var sku = cols[skuIndex];
                    if (string.IsNullOrWhiteSpace(sku))
                    {
                        sku = idStr; // Fallback to ID
                    }

                    // Store product ID -> SKU mapping (for all types)
                    if (!_productSkuMap.ContainsKey(id))
                    {
                        _productSkuMap[id] = sku;
                    }

                    var type = cols[typeIndex];
                    if (type == "variation") 
                    {
                        var parentRaw = cols[parentIndex]; // "id:1394"
                        if (!parentRaw.StartsWith("id:")) continue;
                        
                        var parentId = parentRaw.Substring(3);

                        // For each attribute pair in this row
                        foreach (var (nameIdx, valIdx) in attrIndices)
                        {
                            if (nameIdx >= cols.Count || valIdx >= cols.Count) continue;
                            
                            var attrName = cols[nameIdx];
                            var attrValue = cols[valIdx];

                            if (!string.IsNullOrEmpty(attrName) && !string.IsNullOrEmpty(attrValue))
                            {
                                var key = $"{parentId}-{attrName}-{attrValue}".ToLowerInvariant();
                                if (!_skuMap.ContainsKey(key))
                                {
                                    _skuMap[key] = sku;
                                }
                            }
                        }
                    }
                }
            }
        }

        public string? GetSku(int parentId, string attributeName, string attributeValue)
        {
            try 
            {
                EnsureLoaded();
                if (_skuMap == null) return null;

                var key = $"{parentId}-{attributeName}-{attributeValue}".ToLowerInvariant();
                return _skuMap.TryGetValue(key, out var sku) ? sku : null;
            }
            catch
            {
                return null;
            }
        }

        public string? GetProductSku(int productId)
        {
            try
            {
                EnsureLoaded();
                if (_productSkuMap == null) return null;
                
                return _productSkuMap.TryGetValue(productId, out var sku) ? sku : null;
            }
            catch
            {
                return null;
            }
        }
    }
}
