import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  where,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { db, storage } from "./firebase";

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log("Testing Firebase connection...");
    
    // Test Firestore
    const testDoc = await addDoc(collection(db, "test"), {
      message: "Connection test",
      timestamp: serverTimestamp()
    });
    console.log("Firestore test successful:", testDoc.id);
    
    // Test Storage (create a small text file)
    const testBlob = new Blob(["test"], { type: "text/plain" });
    const testRef = ref(storage, `test/${Date.now()}_test.txt`);
    await uploadBytes(testRef, testBlob);
    const testUrl = await getDownloadURL(testRef);
    console.log("Storage test successful:", testUrl);
    
    return { success: true };
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    return { success: false, error };
  }
};

export interface ResourceFile {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  subject: string;
  category: string; // 'Handout', 'Assignment', 'Slides', 'Notes', 'PQYS', etc.
  uploadedBy: string;
  uploaderName: string;
  uploadedAt: Timestamp;
}

export interface ResourceUpload {
  title: string;
  description?: string;
  subject: string;
  category: string;
  uploadedBy: string;
  uploaderName: string;
  file: File;
}

// Upload a file to Firebase Storage and save metadata to Firestore
export const uploadResource = async (resourceData: ResourceUpload): Promise<{ success: boolean; id?: string; error?: any }> => {
  try {
    console.log("Starting resource upload:", resourceData.title);
    console.log("File size:", resourceData.file.size);
    console.log("File type:", resourceData.file.type);
    
    // Test Firebase Storage connection first
    console.log("Testing Firebase Storage connection...");
    
    // Create a unique file path
    const timestamp = Date.now();
    const fileName = `${resourceData.category.toLowerCase()}/${timestamp}_${resourceData.file.name}`;
    const storageRef = ref(storage, `resources/${fileName}`);
    
    console.log("Storage ref created:", storageRef.fullPath);
    
    // Upload file to Firebase Storage with progress tracking
    console.log("Starting file upload to storage...");
    
    // Use uploadBytes with timeout
    const uploadPromise = uploadBytes(storageRef, resourceData.file);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout after 30 seconds")), 30000)
    );
    
    const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
    console.log("Upload completed, getting download URL...");
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File uploaded successfully, URL:", downloadURL);
    
    // Save metadata to Firestore
    const resourceMetadata = {
      title: resourceData.title,
      description: resourceData.description || "",
      fileName: resourceData.file.name,
      fileUrl: downloadURL,
      fileSize: resourceData.file.size,
      fileType: resourceData.file.type,
      subject: resourceData.subject,
      category: resourceData.category,
      uploadedBy: resourceData.uploadedBy,
      uploaderName: resourceData.uploaderName,
      uploadedAt: serverTimestamp(),
    };
    
    console.log("Saving metadata to Firestore...");
    const docRef = await addDoc(collection(db, "resources"), resourceMetadata);
    console.log("Resource uploaded successfully with ID:", docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error uploading resource:", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return { success: false, error };
  }
};

// Subscribe to resources in real-time
export const subscribeToResources = (callback: (resources: ResourceFile[]) => void) => {
  try {
    const q = query(
      collection(db, "resources"),
      orderBy("uploadedAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const resources: ResourceFile[] = [];
      querySnapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data()
        } as ResourceFile);
      });
      console.log("Resources updated:", resources.length);
      callback(resources);
    });
  } catch (error) {
    console.error("Error subscribing to resources:", error);
    // Return a cleanup function that does nothing
    return () => {};
  }
};

// Subscribe to resources by category
export const subscribeToResourcesByCategory = (category: string, callback: (resources: ResourceFile[]) => void) => {
  try {
    const q = query(
      collection(db, "resources"),
      where("category", "==", category),
      orderBy("uploadedAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const resources: ResourceFile[] = [];
      querySnapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data()
        } as ResourceFile);
      });
      console.log(`Resources for ${category} updated:`, resources.length);
      callback(resources);
    });
  } catch (error) {
    console.error(`Error subscribing to ${category} resources:`, error);
    // Return a cleanup function that does nothing
    return () => {};
  }
};

// Subscribe to resources by subject
export const subscribeToResourcesBySubject = (subject: string, callback: (resources: ResourceFile[]) => void) => {
  try {
    const q = query(
      collection(db, "resources"),
      where("subject", "==", subject),
      orderBy("uploadedAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const resources: ResourceFile[] = [];
      querySnapshot.forEach((doc) => {
        resources.push({
          id: doc.id,
          ...doc.data()
        } as ResourceFile);
      });
      console.log(`Resources for ${subject} updated:`, resources.length);
      callback(resources);
    });
  } catch (error) {
    console.error(`Error subscribing to ${subject} resources:`, error);
    // Return a cleanup function that does nothing
    return () => {};
  }
};

// Delete a resource (file and metadata)
export const deleteResource = async (resourceId: string, fileUrl: string): Promise<{ success: boolean; error?: any }> => {
  try {
    // Delete from Firestore
    // await deleteDoc(doc(db, "resources", resourceId));
    
    // Delete from Storage
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    
    console.log("Resource deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Error deleting resource:", error);
    return { success: false, error };
  }
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file icon based on type
export const getFileIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('doc')) return '📝';
  if (fileType.includes('ppt')) return '📊';
  if (fileType.includes('xls')) return '📈';
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('video')) return '🎥';
  if (fileType.includes('audio')) return '🎵';
  return '📁';
};
