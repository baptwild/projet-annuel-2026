export function authHeaders(): Record<string, string> {
   return {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/merge-patch+json',
   }
}