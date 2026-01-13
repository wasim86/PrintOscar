// const fetch = require('node-fetch'); // Native fetch is available in Node 18+

async function testApi() {
  const baseUrl = 'http://localhost:5001/api';
  
  console.log('Testing API connection...');
  
  try {
    // 1. Test Health/Root
    // Note: The logs said "API Base URL: http://localhost:5001/api", but let's check if there's a health check or just try a product.
    
    // 2. Test Get Product by ID (one of the featured ones)
    const testId = 55768;
    console.log(`\nFetching product ${testId} details...`);
    const productRes = await fetch(`${baseUrl}/products/${testId}/details`);
    if (productRes.ok) {
        const productData = await productRes.json();
        console.log('Product Detail fetch SUCCESS:', productData.product ? productData.product.name : 'No product data');
    } else {
        console.log(`Product Detail fetch FAILED: ${productRes.status} ${productRes.statusText}`);
    }

    // 4. Test Search with spaces
    const spaceSlug = "peak series acrylic award with blue accents";
    console.log(`\nSearching products with space term "${spaceSlug}"...`);
    const searchRes2 = await fetch(`${baseUrl}/products/search?searchTerm=${encodeURIComponent(spaceSlug)}&page=1&pageSize=5`);
    if (searchRes2.ok) {
        const searchData2 = await searchRes2.json();
        console.log(`Space Search Found: ${searchData2.data ? searchData2.data.products.length : 0} products.`);
    } else {
        console.log(`Space Search FAILED: ${searchRes2.status}`);
    }
    console.log('Done.');

  } catch (error) {
    console.error('API Test Error:', error.message);
  }
}

testApi();
