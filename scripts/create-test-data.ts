async function createTestData() {
  try {
    console.log('Starting test data creation process...');
    
    // First create the test users
    console.log('Step 1: Creating test users...');
    const usersResponse = await fetch('http://localhost:3000/api/create-test-users');
    
    if (!usersResponse.ok) {
      throw new Error(`Failed to create test users: ${usersResponse.status} ${usersResponse.statusText}`);
    }
    
    const usersData = await usersResponse.json();
    console.log('Users creation response:', JSON.stringify(usersData, null, 2));
    
    // Then create the test data (TODAs, triders, locations)
    console.log('\nStep 2: Creating test data...');
    const dataResponse = await fetch('http://localhost:3000/api/insert-test-data');
    
    if (!dataResponse.ok) {
      throw new Error(`Failed to insert test data: ${dataResponse.status} ${dataResponse.statusText}`);
    }
    
    const testData = await dataResponse.json();
    console.log('Test data creation response:', JSON.stringify(testData, null, 2));
    
    console.log('\nTest data creation process completed successfully!');
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

// Run the function
createTestData(); 