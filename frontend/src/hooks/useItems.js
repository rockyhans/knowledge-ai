import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listItems();
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { items, loading, refresh };
}
