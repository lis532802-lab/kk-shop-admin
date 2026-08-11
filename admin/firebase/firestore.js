import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  serverTimestamp, 
  onSnapshot,
  query,
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./config.js";

// Products Collection CRUD
export const addProductToDB = async (productData) => {
  const colRef = collection(db, "products");
  return await addDoc(colRef, {
    ...productData,
    status: productData.status || "Active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateProductInDB = async (id, productData) => {
  const docRef = doc(db, "products", id);
  return await updateDoc(docRef, {
    ...productData,
    updatedAt: serverTimestamp()
  });
};

export const toggleProductStatusInDB = async (id, currentStatus) => {
  const docRef = doc(db, "products", id);
  const newStatus = currentStatus === "Active" ? "Hidden" : "Active";
  return await updateDoc(docRef, { status: newStatus });
};

export const deleteProductFromDB = async (id) => {
  const docRef = doc(db, "products", id);
  return await deleteDoc(docRef);
};

export const subscribeProducts = (callback) => {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(products);
  }, (err) => console.error("Products listener error:", err));
};

export const getProductById = async (id) => {
  const docRef = doc(db, "products", id);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Orders Collection Stream & Updates
export const subscribeAllOrders = (callback) => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  }, (err) => console.error("Orders listener error:", err));
};

export const updateOrderStatusInDB = async (orderId, newStatus) => {
  const docRef = doc(db, "orders", orderId);
  return await updateDoc(docRef, { 
    status: newStatus,
    updatedAt: serverTimestamp()
  });
};

// Registered Users Directory
export const fetchAllUsers = async () => {
  const colRef = collection(db, "users");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Store Configuration Settings
export const fetchStoreSettings = async () => {
  const docRef = doc(db, "settings", "store_config");
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
};

export const saveStoreSettings = async (settings) => {
  const docRef = doc(db, "settings", "store_config");
  return await setDoc(docRef, settings, { merge: true });
};
