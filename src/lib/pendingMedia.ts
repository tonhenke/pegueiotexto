"use client";

// Helper to store and retrieve pending media (URLs or uploaded Files)
// across Home -> Login / Signup Split Screen -> Dashboard

const DB_NAME = "pegueiotexto_storage";
const STORE_NAME = "pending_media";
const DB_VERSION = 1;

interface PendingMediaData {
  url?: string;
  mode?: "url" | "upload" | "record";
  title?: string;
  duration?: number;
  previewText?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  file?: File;
  timestamp?: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not supported"));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePendingMedia(data: PendingMediaData): Promise<void> {
  if (typeof window === "undefined") return;

  const metaToStore = {
    url: data.url || "",
    mode: data.mode || "url",
    title: data.title || "",
    duration: data.duration || 0,
    previewText: data.previewText || "",
    fileName: data.file ? data.file.name : data.fileName || "",
    fileSize: data.file ? data.file.size : data.fileSize || 0,
    fileType: data.file ? data.file.type : data.fileType || "",
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem("pegueiotexto_pending_meta", JSON.stringify(metaToStore));
    if (data.url) {
      localStorage.setItem("pegueiotexto_pending_url", data.url);
    }
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }

  // If a File is present, store in IndexedDB
  if (data.file) {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(data.file, "pending_file");
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn("Could not save pending file in IndexedDB:", err);
    }
  }
}

export async function getPendingMedia(): Promise<PendingMediaData | null> {
  if (typeof window === "undefined") return null;

  let meta: PendingMediaData = {};
  try {
    const rawMeta = localStorage.getItem("pegueiotexto_pending_meta");
    if (rawMeta) {
      meta = JSON.parse(rawMeta);
    } else {
      const fallbackUrl = localStorage.getItem("pegueiotexto_pending_url");
      if (fallbackUrl) {
        meta = { url: fallbackUrl, mode: "url" };
      }
    }
  } catch (e) {
    console.warn("Could not read pending metadata:", e);
  }

  if (!meta.url && !meta.fileName) {
    return null;
  }

  // Try to retrieve File from IndexedDB if in upload mode
  if (meta.mode === "upload" || meta.fileName) {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get("pending_file");
      const file = await new Promise<File | undefined>((resolve) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(undefined);
      });
      if (file) {
        meta.file = file;
      }
    } catch (err) {
      console.warn("Could not retrieve pending file from IndexedDB:", err);
    }
  }

  return meta;
}

export async function clearPendingMedia(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("pegueiotexto_pending_meta");
    localStorage.removeItem("pegueiotexto_pending_url");
  } catch (e) {}

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete("pending_file");
  } catch (e) {}
}
