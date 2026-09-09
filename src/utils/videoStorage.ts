/**
 * IndexedDB storage for video files.
 * Unlike localStorage (which has a strict 5MB quota that breaks on video upload),
 * IndexedDB has hundreds of megabytes of quota and supports native Blob storage.
 */

const DB_NAME = 'BodybondMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
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

/**
 * Save a video file/blob to IndexedDB under a specific reel id
 */
export async function saveVideoBlob(reelId: string, fileOrBlob: Blob): Promise<string> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(fileOrBlob, reelId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Return an immediate blob URL for playback
    return URL.createObjectURL(fileOrBlob);
  } catch (err) {
    console.warn('Failed to save video to IndexedDB, fallback to memory url:', err);
    return URL.createObjectURL(fileOrBlob);
  }
}

/**
 * Retrieve a video blob from IndexedDB and return an object URL
 */
export async function loadVideoBlobUrl(reelId: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(reelId);
      req.onsuccess = () => {
        const result = req.result;
        if (result instanceof Blob) {
          resolve(URL.createObjectURL(result));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Check if a custom video blob exists in IndexedDB
 */
export async function hasVideoBlob(reelId: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(reelId);
      req.onsuccess = () => {
        resolve(req.result instanceof Blob);
      };
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Delete a custom video from IndexedDB
 */
export async function deleteVideoBlob(reelId: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(reelId);
  } catch (e) {
    console.warn('Failed to delete video from IndexedDB:', e);
  }
}

/**
 * Clear all stored videos
 */
export async function clearAllVideoBlobs(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
  } catch (e) {
    console.warn('Failed to clear video DB:', e);
  }
}
