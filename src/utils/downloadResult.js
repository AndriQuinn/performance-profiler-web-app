export function downloadFromSessionStorage(key, filename = 'data.json') {
  const data = sessionStorage.getItem(key);
  
  if (!data) {
    console.warn('No data found in sessionStorage for key:', key);
    return;
  }

  // create a blob and download link
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  // cleanup
  URL.revokeObjectURL(url);
}