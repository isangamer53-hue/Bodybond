import { DocumentReference, SetOptions, setDoc, deleteDoc } from 'firebase/firestore';

// In-memory & session storage circuit breaker for Firestore quota & write-stream backoff
let _isQuotaExceeded = false;

try {
  if (typeof window !== 'undefined') {
    _isQuotaExceeded = sessionStorage.getItem('bodybond_firestore_quota_exceeded') === 'true';
  }
} catch {
  // Ignore storage access errors
}

export function isFirestoreQuotaExceeded(): boolean {
  return _isQuotaExceeded;
}

export function setFirestoreQuotaExceeded(value: boolean): void {
  _isQuotaExceeded = value;
  try {
    if (typeof window !== 'undefined') {
      if (value) {
        sessionStorage.setItem('bodybond_firestore_quota_exceeded', 'true');
      } else {
        sessionStorage.removeItem('bodybond_firestore_quota_exceeded');
      }
      window.dispatchEvent(new CustomEvent('firestore-quota-status', { detail: { exceeded: value } }));
    }
  } catch {
    // Ignore storage errors
  }
}

export function isResourceExhaustedError(error: unknown): boolean {
  if (!error) return false;
  const code = (error as any)?.code || '';
  const message = error instanceof Error ? error.message : String(error);
  
  return (
    code === 'resource-exhausted' ||
    message.includes('resource-exhausted') ||
    message.includes('Resource has been exhausted') ||
    message.includes('Write stream exhausted') ||
    message.includes('maximum allowed queued writes') ||
    message.includes('Quota limit exceeded') ||
    message.toLowerCase().includes('quota') ||
    message.includes('backoff delay')
  );
}

export function checkAndHandleFirestoreError(error: unknown): boolean {
  if (isResourceExhaustedError(error)) {
    if (!_isQuotaExceeded) {
      console.warn('Firestore quota exhausted or write stream blocked. Switching to local-only persistence mode.');
      setFirestoreQuotaExceeded(true);
    }
    return true;
  }
  return false;
}

/**
 * Safely executes a setDoc write only if the Firestore write stream is not exhausted.
 * Prevents throwing "Write stream exhausted maximum allowed queued writes" by circuit-breaking
 * writes when the backend is backing off or quota is exhausted.
 */
export async function safeSetDoc(
  docRef: DocumentReference, 
  data: any, 
  options?: SetOptions
): Promise<void> {
  if (isFirestoreQuotaExceeded()) {
    // Gracefully skip remote write; local state / localStorage already handles the data
    return;
  }

  try {
    if (options) {
      await setDoc(docRef, data, options);
    } else {
      await setDoc(docRef, data);
    }
  } catch (err) {
    if (checkAndHandleFirestoreError(err)) {
      // Circuit breaker tripped; subsequent writes will be skipped cleanly
      return;
    }
    console.error('Firestore safeSetDoc error:', err);
  }
}

/**
 * Safely executes a deleteDoc only if the Firestore write stream is not exhausted.
 */
export async function safeDeleteDoc(docRef: DocumentReference): Promise<void> {
  if (isFirestoreQuotaExceeded()) {
    return;
  }

  try {
    await deleteDoc(docRef);
  } catch (err) {
    if (checkAndHandleFirestoreError(err)) {
      return;
    }
    console.error('Firestore safeDeleteDoc error:', err);
  }
}
