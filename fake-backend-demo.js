// Demo: How Easy It Is To Fake The Backend
// Run this in your browser console to see fake backend in action!

console.log("🎭 FAKE BACKEND DEMO");
console.log("===================");

// Import functions (in real app, these would be imported from shared/api.ts)
// For demo purposes, we'll simulate the key concepts

const demoFakeBackend = {
  // 1. Toggle between real and fake backend with one line
  enabled: true,
  
  // 2. Mock data store - super simple to add data
  data: {
    users: [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ],
    events: [
      { id: 1, title: "Math Quiz", date: "2024-01-15" },
      { id: 2, title: "Science Fair", date: "2024-01-20" }
    ]
  },
  
  // 3. Fake API function - intercepts all requests
  async fakeRequest(url, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log(`🔄 Fake API Call: ${options.method || 'GET'} ${url}`);
    
    // Route to appropriate fake data
    if (url === '/users') return { success: true, data: this.data.users };
    if (url === '/events') return { success: true, data: this.data.events };
    if (url === '/auth/login') return { success: true, data: { token: 'fake-token' } };
    
    return { success: true, data: [] };
  },
  
  // 4. Main request function - decides real vs fake
  async request(url, options = {}) {
    if (this.enabled) {
      return await this.fakeRequest(url, options);
    } else {
      // Would make real API call here
      return fetch(url, options);
    }
  }
};

// Demo Usage
async function runDemo() {
  console.log("\n🔹 Step 1: Enable fake backend");
  demoFakeBackend.enabled = true;
  
  console.log("\n🔹 Step 2: Make API calls - they all work!");
  
  const users = await demoFakeBackend.request('/users');
  console.log("Users:", users.data);
  
  const events = await demoFakeBackend.request('/events');
  console.log("Events:", events.data);
  
  const login = await demoFakeBackend.request('/auth/login', { method: 'POST' });
  console.log("Login:", login.data);
  
  console.log("\n🔹 Step 3: Add new fake data");
  demoFakeBackend.data.users.push({ id: 3, name: "Bob Wilson", email: "bob@example.com" });
  
  const usersAgain = await demoFakeBackend.request('/users');
  console.log("Users after adding Bob:", usersAgain.data);
  
  console.log("\n🔹 Step 4: Switch to real backend");
  demoFakeBackend.enabled = false;
  console.log("Now all API calls would go to real server!");
  
  console.log("\n✅ DEMO COMPLETE");
  console.log("💡 Key Points:");
  console.log("  - One toggle switches entire app");
  console.log("  - Add mock data with simple objects");
  console.log("  - No backend server needed for development");
  console.log("  - Same code works for real and fake APIs");
}

// Run the demo
runDemo();

// Show the actual implementation in your app
console.log("\n📁 In your actual app (shared/api.ts):");
console.log(`
// Just set this to true/false
const USE_FAKE_BACKEND = true;

// Your request function automatically uses fake data
const response = await request('/events');
// Returns mock events when fake backend is enabled!

// Toggle anytime in browser console:
toggleFakeBackend(true);  // Enable fake backend
toggleFakeBackend(false); // Use real backend
`);
