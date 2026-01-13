'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Loader2,
  Eye,
  Save,
  RefreshCw
} from 'lucide-react';
import { AdminProductsApi } from '@/services/admin-products-api';

interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportError[];
  createdProducts: any[];
}

interface ImportError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ProductImportExportProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductImportExport: React.FC<ProductImportExportProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV template for download
  const csvTemplate = `name,description,price,salePrice,sku,stock,categoryId,isActive,isFeatured,imageUrl,metaTitle,metaDescription,slug
"Sample Product 1","A great product description",29.99,24.99,"SKU001",100,5,true,false,"https://example.com/image1.jpg","Sample Product 1 - Buy Now","Meta description for SEO","sample-product-1"
"Sample Product 2","Another product description",49.99,,,"SKU002",50,6,true,true,"https://example.com/image2.jpg","Sample Product 2","Another meta description","sample-product-2"`;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setImportFile(file);
      setError(null);
      setImportResult(null);
      previewCSV(file);
    }
  };

  const previewCSV = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const preview = lines.slice(1, 6).map((line, index) => {
        const values = parseCSVLine(line);
        const row: any = { _rowNumber: index + 2 };
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row;
      });

      setPreviewData(preview);
      setShowPreview(true);
    } catch (err) {
      setError('Failed to preview CSV file');
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result.map(val => val.replace(/^"|"$/g, ''));
  };

  const validateRow = (row: any, rowNumber: number): ImportError[] => {
    const errors: ImportError[] = [];

    // Required fields validation
    if (!row.name || row.name.trim() === '') {
      errors.push({
        row: rowNumber,
        field: 'name',
        message: 'Product name is required',
        value: row.name
      });
    }

    if (!row.description || row.description.trim() === '') {
      errors.push({
        row: rowNumber,
        field: 'description',
        message: 'Product description is required',
        value: row.description
      });
    }

    if (!row.price || isNaN(parseFloat(row.price)) || parseFloat(row.price) <= 0) {
      errors.push({
        row: rowNumber,
        field: 'price',
        message: 'Valid price is required',
        value: row.price
      });
    }

    if (!row.categoryId || isNaN(parseInt(row.categoryId)) || parseInt(row.categoryId) <= 0) {
      errors.push({
        row: rowNumber,
        field: 'categoryId',
        message: 'Valid category ID is required',
        value: row.categoryId
      });
    }

    if (row.stock && (isNaN(parseInt(row.stock)) || parseInt(row.stock) < 0)) {
      errors.push({
        row: rowNumber,
        field: 'stock',
        message: 'Stock must be a valid number',
        value: row.stock
      });
    }

    return errors;
  };

  const handleImport = async () => {
    if (!importFile) {
      setError('Please select a file to import');
      return;
    }

    try {
      setImporting(true);
      setError(null);

      const text = await importFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const allErrors: ImportError[] = [];
      const validRows: any[] = [];

      // Parse and validate all rows
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        const rowErrors = validateRow(row, i + 1);
        if (rowErrors.length > 0) {
          allErrors.push(...rowErrors);
        } else {
          validRows.push(row);
        }
      }

      // If there are validation errors, show them
      if (allErrors.length > 0) {
        setImportResult({
          success: false,
          totalRows: lines.length - 1,
          successCount: 0,
          errorCount: allErrors.length,
          errors: allErrors,
          createdProducts: []
        });
        return;
      }

      // Import valid rows
      const createdProducts = [];
      const importErrors: ImportError[] = [];

      for (const row of validRows) {
        try {
          const productData = {
            name: row.name,
            description: row.description,
            longDescription: row.longDescription || '',
            price: parseFloat(row.price),
            salePrice: row.salePrice ? parseFloat(row.salePrice) : undefined,
            sku: row.sku || '',
            stock: parseInt(row.stock) || 0,
            imageUrl: row.imageUrl || '',
            categoryId: parseInt(row.categoryId),
            isActive: row.isActive === 'true' || row.isActive === '1',
            isFeatured: row.isFeatured === 'true' || row.isFeatured === '1',
            metaTitle: row.metaTitle || '',
            metaDescription: row.metaDescription || '',
            slug: row.slug || '',
            imageGallery: row.imageUrl ? [row.imageUrl] : [],
            attributes: [],
            filterValues: []
          };

          const response = await AdminProductsApi.createProduct(productData);
          if (response.success) {
            createdProducts.push(response.product);
          } else {
            importErrors.push({
              row: validRows.indexOf(row) + 2,
              field: 'general',
              message: response.message || 'Failed to create product',
              value: row.name
            });
          }
        } catch (err) {
          importErrors.push({
            row: validRows.indexOf(row) + 2,
            field: 'general',
            message: err instanceof Error ? err.message : 'Unknown error',
            value: row.name
          });
        }
      }

      setImportResult({
        success: importErrors.length === 0,
        totalRows: lines.length - 1,
        successCount: createdProducts.length,
        errorCount: importErrors.length,
        errors: importErrors,
        createdProducts
      });

      if (createdProducts.length > 0) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);

      // Get all products
      const response = await AdminProductsApi.getProducts({ pageSize: 1000 });
      if (!response.success) {
        throw new Error('Failed to fetch products');
      }

      // Convert to CSV
      const headers = [
        'id', 'name', 'description', 'longDescription', 'price', 'salePrice', 
        'sku', 'stock', 'categoryId', 'categoryName', 'isActive', 'isFeatured',
        'imageUrl', 'metaTitle', 'metaDescription', 'slug', 'createdAt'
      ];

      const csvContent = [
        headers.join(','),
        ...response.products.map(product => [
          product.id,
          `"${product.name.replace(/"/g, '""')}"`,
          `"${product.description.replace(/"/g, '""')}"`,
          `"${(product.longDescription || '').replace(/"/g, '""')}"`,
          product.price,
          product.salePrice || '',
          `"${product.sku || ''}"`,
          product.stock,
          product.categoryId,
          `"${product.categoryName.replace(/"/g, '""')}"`,
          product.isActive,
          product.isFeatured,
          `"${product.imageUrl || ''}"`,
          `"${(product.metaTitle || '').replace(/"/g, '""')}"`,
          `"${(product.metaDescription || '').replace(/"/g, '""')}"`,
          `"${product.slug || ''}"`,
          product.createdAt
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setImportFile(null);
    setImportResult(null);
    setPreviewData([]);
    setShowPreview(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Product Import/Export</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'import', label: 'Import Products', icon: Upload },
              { id: 'export', label: 'Export Products', icon: Download }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'import' | 'export')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              {!importResult ? (
                <>
                  {/* Template Download */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Download Template</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      Download the CSV template to see the required format and example data.
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download Template
                    </button>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select CSV File
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>

                  {/* Preview */}
                  {showPreview && previewData.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">Preview (First 5 rows)</h3>
                        <button
                          onClick={() => setShowPreview(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {Object.keys(previewData[0]).filter(key => key !== '_rowNumber').map(header => (
                                <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {previewData.map((row, index) => (
                              <tr key={index}>
                                {Object.entries(row).filter(([key]) => key !== '_rowNumber').map(([key, value]) => (
                                  <td key={key} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {String(value).substring(0, 50)}{String(value).length > 50 ? '...' : ''}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Import Button */}
                  {importFile && (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleImport}
                        disabled={importing}
                        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {importing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Import Products
                          </>
                        )}
                      </button>
                      <button
                        onClick={resetImport}
                        className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Import Results */
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${
                    importResult.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {importResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      <h3 className={`font-medium ${
                        importResult.success ? 'text-green-900' : 'text-yellow-900'
                      }`}>
                        Import {importResult.success ? 'Completed' : 'Completed with Errors'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Rows:</span>
                        <span className="ml-2 font-medium">{importResult.totalRows}</span>
                      </div>
                      <div>
                        <span className="text-green-600">Successful:</span>
                        <span className="ml-2 font-medium text-green-700">{importResult.successCount}</span>
                      </div>
                      <div>
                        <span className="text-red-600">Errors:</span>
                        <span className="ml-2 font-medium text-red-700">{importResult.errorCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Errors */}
                  {importResult.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Import Errors</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {importResult.errors.map((error, index) => (
                          <div key={index} className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                            <div className="font-medium text-red-900">Row {error.row}</div>
                            <div className="text-red-700">
                              <span className="font-medium">{error.field}:</span> {error.message}
                            </div>
                            {error.value && (
                              <div className="text-red-600 text-xs mt-1">
                                Value: "{error.value}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={resetImport}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Import Another File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Export All Products</h3>
                <p className="text-green-700 text-sm mb-3">
                  Export all products to a CSV file. This will include all product data including IDs, which can be useful for backup or analysis.
                </p>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Products
                    </>
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Export Guidelines</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• The exported file will contain all product data</li>
                  <li>• Product IDs are included for reference</li>
                  <li>• Use this for backup, analysis, or bulk editing</li>
                  <li>• To import edited data, remove the ID column first</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
