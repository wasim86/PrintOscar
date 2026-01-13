const fs = require('fs');
const path = require('path');

const csvPath = 'c:\\Users\\sayedshaad\\Downloads\\wc-product-export-2-1-2026-1767297233709.csv';
const outputPath = path.join(__dirname, '../src/data/sku-mapping.json');

// Simple CSV line parser handling quotes
function parseCSVLine(text) {
    const result = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char === '"') {
            if (i + 1 < text.length && text[i + 1] === '"') {
                // Escaped quote
                cell += '"';
                i++;
            } else {
                // Toggle quote mode
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(cell);
            cell = '';
        } else {
            cell += char;
        }
    }
    result.push(cell);
    return result;
}

try {
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    
    if (lines.length < 2) {
        console.error('CSV file is empty or invalid');
        process.exit(1);
    }

    // Handle BOM
    if (lines[0].charCodeAt(0) === 0xFEFF) {
        lines[0] = lines[0].slice(1);
    }

    const header = parseCSVLine(lines[0]).map(h => h.trim());
    console.log('Headers found:', header);
    
    // Find column indices
    const idIdx = header.indexOf('ID');
    const typeIdx = header.indexOf('Type');
    const skuIdx = header.indexOf('SKU');
    const nameIdx = header.indexOf('Name');
    const parentIdx = header.indexOf('Parent');
    const attr1NameIdx = header.indexOf('Attribute 1 name');
    const attr1ValueIdx = header.indexOf('Attribute 1 value(s)');
    
    // Check for other attributes just in case Size is not #1
    const attr2NameIdx = header.indexOf('Attribute 2 name');
    const attr2ValueIdx = header.indexOf('Attribute 2 value(s)');
    const attr3NameIdx = header.indexOf('Attribute 3 name');
    const attr3ValueIdx = header.indexOf('Attribute 3 value(s)');

    if (idIdx === -1 || typeIdx === -1 || skuIdx === -1 || nameIdx === -1) {
        console.error('Missing required columns');
        process.exit(1);
    }

    const productMap = new Map(); // ID -> Name
    const skuData = {}; // ProductName -> { SizeName: SKU }

    console.log(`Processing ${lines.length} lines...`);

    // First pass: Index all products by ID
    lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return;
        const cols = parseCSVLine(line);
        const id = cols[idIdx];
        const name = cols[nameIdx];
        const type = cols[typeIdx];
        
        if (id && name) {
            productMap.set(id, name);
        }
        
        // Also capture simple product SKUs
        if (type === 'simple' && cols[skuIdx]) {
            if (!skuData[name]) skuData[name] = {};
            skuData[name]['default'] = cols[skuIdx];
        }
    });

    // Second pass: Process variations
    let variationCount = 0;
    lines.forEach((line, index) => {
        if (index === 0 || !line.trim()) return;
        const cols = parseCSVLine(line);
        const type = cols[typeIdx];
        const sku = cols[skuIdx];
        
        if (type === 'variation' && sku) {
            const parentRef = cols[parentIdx]; // "id:123"
            if (!parentRef) return;
            
            const parentId = parentRef.replace('id:', '');
            const parentName = productMap.get(parentId);
            
            if (parentName) {
                // Find Size attribute
                let size = '';
                
                // Check Attribute 1
                if (cols[attr1NameIdx] && cols[attr1NameIdx].toLowerCase().includes('size')) {
                    size = cols[attr1ValueIdx];
                } 
                // Check Attribute 2
                else if (cols[attr2NameIdx] && cols[attr2NameIdx].toLowerCase().includes('size')) {
                    size = cols[attr2ValueIdx];
                }
                // Check Attribute 3
                else if (cols[attr3NameIdx] && cols[attr3NameIdx].toLowerCase().includes('size')) {
                    size = cols[attr3ValueIdx];
                }
                // Fallback: Check Attribute 1 if it's the only one and might be size implicitly
                else if (cols[attr1ValueIdx] && !cols[attr2ValueIdx]) {
                     // Sometimes name is just "Style" but it acts as size/variant
                     size = cols[attr1ValueIdx];
                }

                if (size) {
                    if (!skuData[parentName]) skuData[parentName] = {};
                    skuData[parentName][size] = sku;
                    variationCount++;
                }
            }
        }
    });

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(skuData, null, 2));
    console.log(`Generated SKU mapping for ${Object.keys(skuData).length} products with ${variationCount} variations.`);
    console.log(`Saved to ${outputPath}`);

} catch (err) {
    console.error('Error:', err);
}
