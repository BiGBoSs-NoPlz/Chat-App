// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  getDocs,
  where,
  updateDoc
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMkjm6hg_-t3QBGJz76hx-aKrRam9aVro",
  authDomain: "chat-68670.firebaseapp.com",
  databaseURL: "https://chat-68670-default-rtdb.firebaseio.com",
  projectId: "chat-68670",
  storageBucket: "chat-68670.firebasestorage.app",
  messagingSenderId: "489874146673",
  appId: "1:489874146673:web:7b4ef47b2b12f622f562d0",
  measurementId: "G-6ZSLGLWFR2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication Functions
export const registerUser = async (email, password, username) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile to include display name
    await updateProfile(userCredential.user, {
      displayName: username
    });
    
    // Add user to users collection
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: email,
      displayName: username,
      photoURL: null,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      status: "online"
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update user's online status and last active timestamp
    const userRef = doc(db, "users", userCredential.user.uid);
    await updateDoc(userRef, {
      status: "online",
      lastActive: serverTimestamp()
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    // Update user's status to offline before signing out
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        status: "offline",
        lastActive: serverTimestamp()
      });
    }
    
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Chat Functions
export const sendMessageToGroupChat = async (message, user) => {
  try {
    await addDoc(collection(db, "groupChat"), {
      text: message,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getGroupChatMessages = (callback) => {
  const q = query(collection(db, "groupChat"), orderBy("createdAt"));
  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(messages);
  });
};

export const getOnlineUsers = (callback) => {
  const q = query(collection(db, "users"), orderBy("displayName"));
  return onSnapshot(q, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(users);
  });
};

export const createPrivateChat = async (currentUser, otherUser) => {
  try {
    // Create a unique room ID combining both user IDs in alphabetical order
    const userIds = [currentUser.uid, otherUser.id].sort();
    const roomId = userIds.join('_');
    
    // Check if the room already exists
    const roomRef = doc(db, "privateChats", roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      // Create a new private chat room
      await setDoc(roomRef, {
        participants: userIds,
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null
      });
    }
    
    return { success: true, roomId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const sendPrivateMessage = async (roomId, message, user) => {
  try {
    // Add message to the private chat room's messages subcollection
    await addDoc(collection(db, "privateChats", roomId, "messages"), {
      text: message,
      createdAt: serverTimestamp(),
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
    
    // Update the last message in the private chat room
    const roomRef = doc(db, "privateChats", roomId);
    await updateDoc(roomRef, {
      lastMessage: message,
      lastMessageTime: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getPrivateMessages = (roomId, callback) => {
  const q = query(collection(db, "privateChats", roomId, "messages"), orderBy("createdAt"));
  return onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(messages);
  });
};

export const getUserChats = (userId, callback) => {
  const q = query(
    collection(db, "privateChats"), 
    where("participants", "array-contains", userId)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(chats);
  });
};

// Helper function to get user info by ID
export const getUserInfo = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, user: { id: userSnap.id, ...userSnap.data() } };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { auth, db, onAuthStateChanged }; 