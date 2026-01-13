
async function testSearch() {
  const url = 'http://localhost:5001/api/products/search?sortBy=name&pageSize=8';
  console.log(`Fetching: ${url}`);
  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status} ${response.statusText}`);
    const text = await response.text();
    console.log('Response Body:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testSearch();
