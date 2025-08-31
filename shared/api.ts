// ===============================================
// 🔴 ALL APIs REMOVED - OFFLINE MODE ONLY 🔴
// ===============================================
// This app now works completely offline with mock data
// No network requests will be made to any external APIs

// API COMPLETELY REMOVED - OFFLINE MODE ONLY
const API_BASE = '';

// Force offline mode - no real API calls ever
const USE_FAKE_BACKEND = true;

// Log offline mode status
console.log("🔴 OFFLINE MODE: All APIs removed - using mock data only");

// Fake data store
const FAKE_DATA = {
  users: [
    { id: 1, name: "John Doe", email: "john.doe@learner.manipal.edu", role: "student" },
    { id: 2, name: "Jane Smith", email: "jane.smith@manipal.edu", role: "teacher" },
    { id: 3, name: "Bob Wilson", email: "bob.wilson@manipal.edu", role: "admin" },
    { id: 4, name: "Alice Johnson", email: "alice.johnson@learner.manipal.edu", role: "student" },
    { id: 5, name: "Prof Kumar", email: "prof.kumar@manipal.edu", role: "teacher" }
  ],
  events: [
    { id: 1, title: "Math Quiz", date: "2024-01-15", description: "Algebra quiz" },
    { id: 2, title: "Science Fair", date: "2024-01-20", description: "Annual science fair" },
    { id: 3, title: "Sports Day", date: "2024-01-25", description: "Inter-house sports competition" }
  ],
  courses: [
    { id: 1, title: "Mathematics", description: "Advanced calculus and algebra" },
    { id: 2, title: "Physics", description: "Quantum mechanics and thermodynamics" },
    { id: 3, title: "Chemistry", description: "Organic and inorganic chemistry" }
  ],
  resources: {
    presentations: [
      { id: 1, name: "Introduction to Calculus.pptx", subject: "Math", size: "2.4 MB", uploadDate: "2024-01-10", downloads: 45, type: "presentation" },
      { id: 2, name: "Physics Laws Overview.pptx", subject: "Physics", size: "3.1 MB", uploadDate: "2024-01-08", downloads: 32, type: "presentation" },
      { id: 3, name: "English Literature.pptx", subject: "English", size: "1.8 MB", uploadDate: "2024-01-12", downloads: 28, type: "presentation" }
    ],
    "study-guides": [
      { id: 4, name: "Calculus Study Guide.pdf", subject: "Math", size: "1.2 MB", uploadDate: "2024-01-09", downloads: 67, type: "study-guide" },
      { id: 5, name: "Psychology Fundamentals.pdf", subject: "Psychology", size: "2.8 MB", uploadDate: "2024-01-11", downloads: 41, type: "study-guide" },
      { id: 6, name: "Physics Formulas.pdf", subject: "Physics", size: "0.9 MB", uploadDate: "2024-01-07", downloads: 89, type: "study-guide" }
    ],
    assignments: [
      { id: 7, name: "Math Problem Set 1.pdf", subject: "Math", size: "0.5 MB", uploadDate: "2024-01-13", downloads: 23, type: "assignment" },
      { id: 8, name: "English Essay Topics.docx", subject: "English", size: "0.3 MB", uploadDate: "2024-01-14", downloads: 19, type: "assignment" },
      { id: 9, name: "MOS Excel Tasks.xlsx", subject: "MOS", size: "1.1 MB", uploadDate: "2024-01-06", downloads: 35, type: "assignment" }
    ],
    "past-papers": [
      { id: 10, name: "Math Final 2023.pdf", subject: "Math", size: "1.5 MB", uploadDate: "2024-01-05", downloads: 78, type: "past-paper" },
      { id: 11, name: "Physics Midterm 2023.pdf", subject: "Physics", size: "1.3 MB", uploadDate: "2024-01-04", downloads: 56, type: "past-paper" },
      { id: 12, name: "Psychology Quiz 2023.pdf", subject: "Psychology", size: "0.8 MB", uploadDate: "2024-01-03", downloads: 42, type: "past-paper" }
    ],
    handouts: [
      { id: 13, name: "Math Reference Sheet.pdf", subject: "Math", size: "0.4 MB", uploadDate: "2024-01-15", downloads: 91, type: "handout" },
      { id: 14, name: "English Grammar Guide.pdf", subject: "English", size: "0.7 MB", uploadDate: "2024-01-02", downloads: 38, type: "handout" },
      { id: 15, name: "MOS Shortcuts.pdf", subject: "MOS", size: "0.3 MB", uploadDate: "2024-01-01", downloads: 52, type: "handout" }
    ]
  },
  subjects: ["Math", "English", "Psychology", "Physics", "MOS"]
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Types ---
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  // Add more fields as needed
}

export interface Course {
  id: number;
  title: string;
  description: string;
  // Add more fields as needed
}

// Add more interfaces for Batch, Club, Event, etc.

// --- Token Management ---
export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

// --- Helper: Offline Only Request Function ---
async function request<T = any>(
  url: string,
  options: RequestInit = {},
  isFileUpload = false
): Promise<ApiResponse<T>> {
  
  // ALWAYS use offline mode - no real API calls
  return await fakeRequest<T>(url, options);
}

// --- Fake Backend Implementation ---
async function fakeRequest<T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  // Simulate network delay
  await delay(300 + Math.random() * 700);
  
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body as string) : null;
  
  console.log(`🔄 Fake API: ${method} ${url}`, body);
  
  // Route fake API calls
  try {
    if (url === '/auth/login') {
      const user = FAKE_DATA.users.find(u => u.email === body.email);
      if (user && body.password === 'password123') {
        return {
          success: true,
          data: { token: 'fake-jwt-token', user } as T
        };
      }
      return { success: false, error: 'Invalid credentials' };
    }
    
    if (url === '/auth/register') {
      const newUser = {
        id: Date.now(),
        name: body.name,
        email: body.email,
        role: 'student'
      };
      FAKE_DATA.users.push(newUser);
      return {
        success: true,
        data: { token: 'fake-jwt-token', user: newUser } as T
      };
    }
    
    if (url === '/events') {
      return { success: true, data: FAKE_DATA.events as T };
    }
    
    if (url === '/courses') {
      return { success: true, data: FAKE_DATA.courses as T };
    }
    
    if (url === '/users/me') {
      return { 
        success: true, 
        data: FAKE_DATA.users[0] as T // Return first user as "me"
      };
    }
    
    if (url.startsWith('/notifications')) {
      return {
        success: true,
        data: [
          { id: 1, title: "Welcome!", message: "Welcome to the platform", read: false },
          { id: 2, title: "Assignment Due", message: "Math assignment due tomorrow", read: true }
        ] as T
      };
    }
    
    if (url.startsWith('/schedules')) {
      return {
        success: true,
        data: [
          { id: 1, subject: "Mathematics", startTime: "09:00 AM", endTime: "10:00 AM", room: "Room 205", professor: "Prof. Johnson", day: 0, duration: 1 },
          { id: 2, subject: "Physics", startTime: "11:00 AM", endTime: "12:00 PM", room: "Lab 101", professor: "Dr. Smith", day: 0, duration: 1 },
          { id: 3, subject: "Chemistry", startTime: "2:00 PM", endTime: "4:00 PM", room: "Lab 302", professor: "Dr. Wilson", day: 1, duration: 2 },
          { id: 4, subject: "Computer Science", startTime: "10:00 AM", endTime: "12:00 PM", room: "Lab 404", professor: "Prof. Davis", day: 2, duration: 2 },
          { id: 5, subject: "English", startTime: "1:00 PM", endTime: "2:00 PM", room: "Room 105", professor: "Ms. Brown", day: 3, duration: 1 }
        ] as T
      };
    }
    
    // Resources API endpoints
    if (url.startsWith('/resources/')) {
      const resourceType = url.split('/resources/')[1];
      
      if (resourceType && FAKE_DATA.resources[resourceType as keyof typeof FAKE_DATA.resources]) {
        return {
          success: true,
          data: FAKE_DATA.resources[resourceType as keyof typeof FAKE_DATA.resources] as T
        };
      }
      
      // If no specific type, return all resources
      return {
        success: true,
        data: Object.values(FAKE_DATA.resources).flat() as T
      };
    }
    
    if (url === '/subjects') {
      return {
        success: true,
        data: FAKE_DATA.subjects as T
      };
    }
    
    // File download endpoint
    if (url.startsWith('/files/') && method === 'GET') {
      const fileId = url.split('/files/')[1];
      // Simulate file download
      return {
        success: true,
        data: { downloadUrl: `https://fake-cdn.example.com/file-${fileId}`, filename: `file-${fileId}.pdf` } as T
      };
    }
    
    // Default success for unmatched routes
    return { success: true, data: [] as T };
    
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Auth APIs ---
export async function login(email: string, password: string) {
  const res = await request<{ token: string; user: User }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );
  if (res.success && res.data?.token) setToken(res.data.token);
  return res;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: string
) {
  return request<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function getMe() {
  return request<User>('/auth/me');
}

export async function logout() {
  clearToken();
}

// --- User APIs ---
export async function getUsers() {
  return request<User[]>('/users');
}
export async function getUser(id: number) {
  return request<User>(`/users/${id}`);
}
export async function updateUser(id: number, data: Partial<User>) {
  return request<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteUser(id: number) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

// --- Course APIs ---
export async function getCourses() {
  return request<Course[]>('/courses');
}
export async function getCourse(id: number) {
  return request<Course>(`/courses/${id}`);
}
export async function createCourse(data: Partial<Course>) {
  return request<Course>('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function updateCourse(id: number, data: Partial<Course>) {
  return request<Course>(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteCourse(id: number) {
  return request(`/courses/${id}`, { method: 'DELETE' });
}

// --- Batch APIs ---
export async function getBatches() {
  return request('/batches');
}
export async function getBatch(id: number) {
  return request(`/batches/${id}`);
}
export async function createBatch(data: any) {
  return request('/batches', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function updateBatch(id: number, data: any) {
  return request(`/batches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteBatch(id: number) {
  return request(`/batches/${id}`, { method: 'DELETE' });
}

// --- Club APIs ---
export async function getClubs() {
  return request('/clubs');
}
export async function getClub(id: number) {
  return request(`/clubs/${id}`);
}
export async function createClub(data: any) {
  return request('/clubs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function updateClub(id: number, data: any) {
  return request(`/clubs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteClub(id: number) {
  return request(`/clubs/${id}`, { method: 'DELETE' });
}

// --- Event APIs ---
export async function getEvents() {
  return request('/events');
}
export async function getEvent(id: number) {
  return request(`/events/${id}`);
}
export async function createEvent(data: any) {
  return request('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function updateEvent(id: number, data: any) {
  return request(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteEvent(id: number) {
  return request(`/events/${id}`, { method: 'DELETE' });
}

// --- Location APIs ---
export async function getLocations() {
  return request('/locations');
}
export async function getLocation(id: number) {
  return request(`/locations/${id}`);
}
export async function createLocation(data: any) {
  return request('/locations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function updateLocation(id: number, data: any) {
  return request(`/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteLocation(id: number) {
  return request(`/locations/${id}`, { method: 'DELETE' });
}

// --- Notification APIs ---
export async function getNotifications() {
  return request('/notifications');
}
export async function getNotification(id: number) {
  return request(`/notifications/${id}`);
}
export async function createNotification(data: any) {
  return request('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function updateNotification(id: number, data: any) {
  return request(`/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteNotification(id: number) {
  return request(`/notifications/${id}`, { method: 'DELETE' });
}

// --- Resource APIs (offline only) ---
export async function getResources() {
  return request('/resources');
}
export async function getResource(id: number) {
  return request(`/resources/${id}`);
}
export async function createResource(formData: FormData) {
  // Always simulate - no real API calls
  await delay(1000);
  const fakeResource = {
    id: Date.now(),
    name: "uploaded-file.pdf",
    size: "1.2 MB",
    uploadDate: new Date().toISOString().split('T')[0],
    downloads: 0
  };
  return { success: true, data: fakeResource };
}
export async function updateResource(id: number, data: any) {
  return request(`/resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteResource(id: number) {
  return request(`/resources/${id}`, { method: 'DELETE' });
}

// --- Schedule APIs ---
export async function getSchedules() {
  return request('/schedules');
}
export async function getSchedule(id: number) {
  return request(`/schedules/${id}`);
}
export async function createSchedule(data: any) {
  return request('/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function updateSchedule(id: number, data: any) {
  return request(`/schedules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteSchedule(id: number) {
  return request(`/schedules/${id}`, { method: 'DELETE' });
}

// --- Subject APIs ---
export async function getSubjects() {
  return request('/subjects');
}
export async function getSubject(id: number) {
  return request(`/subjects/${id}`);
}
export async function createSubject(data: any) {
  return request('/subjects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function updateSubject(id: number, data: any) {
  return request(`/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
export async function deleteSubject(id: number) {
  return request(`/subjects/${id}`, { method: 'DELETE' });
}

// --- Add more endpoints as needed ---

// --- Offline Mode Functions ---
export const toggleFakeBackend = (enabled: boolean) => {
  console.log(`⚠️  App is in OFFLINE MODE ONLY - no real API available`);
  console.log(`🔄 Mock data is always enabled`);
};

export const isFakeBackendEnabled = () => true; // Always offline

export const addFakeData = (type: string, data: any) => {
  if (type in FAKE_DATA) {
    (FAKE_DATA as any)[type].push(data);
    console.log(`✅ Added offline ${type}:`, data);
  }
};

export const getFakeData = () => FAKE_DATA;

// --- File Upload - Offline Only ---
export const uploadFile = async (file: File, type: string): Promise<ApiResponse<any>> => {
  // ALWAYS simulate file upload - no real API
  await delay(1000 + Math.random() * 2000);
  const fakeFile = {
    id: Date.now(),
    name: file.name,
    subject: "Math", // Default subject
    size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    uploadDate: new Date().toISOString().split('T')[0],
    downloads: 0,
    type: type
  };
  
  // Add to appropriate resource category
  if (FAKE_DATA.resources[type as keyof typeof FAKE_DATA.resources]) {
    (FAKE_DATA.resources[type as keyof typeof FAKE_DATA.resources] as any[]).push(fakeFile);
  }
  
  return {
    success: true,
    data: fakeFile
  };
};
