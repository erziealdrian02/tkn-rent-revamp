// ... existing file contents up to line 406 ...

// --- Persistence Logic ---
(function() {
  const STORAGE_PREFIX = 'equiprent_';
  const dataKeys = Object.keys(MockData);
  
  dataKeys.forEach(key => {
    const storageKey = STORAGE_PREFIX + key;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        MockData[key] = JSON.parse(stored);
      } catch(e) {
        console.error("Error parsing", storageKey);
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(MockData[key]));
    }
  });
})();

// Helper to save data back to local storage
MockData.save = function(key) {
  const storageKey = 'equiprent_' + key;
  if(MockData[key]) {
    localStorage.setItem(storageKey, JSON.stringify(MockData[key]));
  }
};

MockData.reset = function() {
  const dataKeys = Object.keys(MockData).filter(k => typeof MockData[k] !== 'function');
  dataKeys.forEach(key => {
    localStorage.removeItem('equiprent_' + key);
  });
  location.reload();
};

MockData.generateId = function(prefix, collectionKey) {
  const items = MockData[collectionKey] || [];
  let max = 0;
  items.forEach(item => {
    if (item.id && item.id.startsWith(prefix + '-')) {
      const num = parseInt(item.id.replace(prefix + '-', ''));
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return prefix + '-' + String(max + 1).padStart(3, '0');
};
