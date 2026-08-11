import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { storage } from "./config.js";

export const uploadProductImage = async (file) => {
  const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const fileRef = ref(storage, `products/${cleanFileName}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};
