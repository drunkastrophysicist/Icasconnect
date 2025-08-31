import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: Timestamp;
  createdBy: string;
  authorName: string;
  scheduledFor?: Date;
}

export interface AnnouncementInput {
  title: string;
  message: string;
  createdBy: string;
  authorName: string;
  scheduledFor?: Date;
}

// Add a new announcement
export const addAnnouncement = async (announcement: AnnouncementInput) => {
  try {
    console.log("Attempting to add announcement:", announcement);
    const docRef = await addDoc(collection(db, "announcements"), {
      ...announcement,
      createdAt: serverTimestamp(),
    });
    console.log("Announcement added successfully with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding announcement: ", error);
    console.error("Error details:", {
      code: (error as any)?.code,
      message: (error as any)?.message,
    });
    return { success: false, error: error };
  }
};

// Subscribe to announcements in real-time
export const subscribeToAnnouncements = (callback: (announcements: Announcement[]) => void) => {
  const q = query(
    collection(db, "announcements"), 
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const announcements: Announcement[] = [];
    querySnapshot.forEach((doc) => {
      announcements.push({
        id: doc.id,
        ...doc.data()
      } as Announcement);
    });
    callback(announcements);
  });
};
