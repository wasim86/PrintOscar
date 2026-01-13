const API_BASE_URL = 'http://localhost:5001/api';

async function testApi() {
    console.log('Testing API connection...');
    try {
        // Test 1: Search Products (General)
        console.log('\n1. Testing General Search...');
        const res1 = await fetch(`${API_BASE_URL}/products/search?pageSize=5`);
        if (!res1.ok) {
            console.error('General Search Failed:', res1.status, res1.statusText);
            const text = await res1.text();
            console.error('Body:', text);
        } else {
            const data1 = await res1.json();
            console.log('General Search Success:', data1.success);
            console.log('Count:', data1.data?.products?.length || 0);
            if (data1.data?.products?.length > 0) {
                console.log('Sample Product:', data1.data.products[0].name, 'ID:', data1.data.products[0].id);
            }
        }

        // Test 2: New Arrivals (Sort by created)
        console.log('\n2. Testing New Arrivals (sortBy=created)...');
        const res2 = await fetch(`${API_BASE_URL}/products/search?sortBy=created&sortOrder=desc&pageSize=5`);
        if (!res2.ok) {
            console.error('New Arrivals Search Failed:', res2.status);
        } else {
            const data2 = await res2.json();
            console.log('New Arrivals Success:', data2.success);
            console.log('Count:', data2.data?.products?.length || 0);
        }

        // Test 3: Specific ID (Featured)
        console.log('\n3. Testing Specific ID (53582)...');
        const res3 = await fetch(`${API_BASE_URL}/products/53582`);
        if (!res3.ok) {
             console.log('Specific ID 53582 fetch failed (Expected if ID changed):', res3.status);
        } else {
            const data3 = await res3.json();
            console.log('Specific ID 53582 found:', data3.success);
        }

    } catch (error) {
        console.error('API Test Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused! Is the backend server running on port 5001?');
        }
    }
}

testApi();
