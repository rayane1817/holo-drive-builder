const CACHE_KEY = 'tmImageCache_v1';
const MAX_CONCURRENT = 4;

interface ImageCache {
  [url: string]: string;
}

let cache: ImageCache = {};
let pending = new Set<string>();
let queue: Array<() => Promise<void>> = [];

// Load cache from localStorage
try {
  const stored = localStorage.getItem(CACHE_KEY);
  if (stored) cache = JSON.parse(stored);
} catch (e) {
  console.warn('Failed to load image cache:', e);
}

// Save cache to localStorage (debounced)
let saveTimeout: NodeJS.Timeout;
const saveCache = () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.warn('Failed to save image cache:', e);
    }
  }, 150);
};

// Fetch OG image from URL
const fetchOGImage = async (url: string): Promise<string | null> => {
  try {
    // Use a CORS proxy for external sites
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const html = await response.text();
    
    // Try OG image
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogMatch) return ogMatch[1];
    
    // Try Twitter image
    const twitterMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
    if (twitterMatch) return twitterMatch[1];
    
    // Try first img tag
    const imgMatch = html.match(/<img[^>]*src=["']([^"']+)["']/i);
    if (imgMatch) {
      const src = imgMatch[1];
      return src.startsWith('http') ? src : new URL(src, url).href;
    }
    
    return null;
  } catch (e) {
    console.warn('Failed to fetch image for', url, e);
    return null;
  }
};

// Process queue
const processQueue = async () => {
  while (queue.length > 0 && pending.size < MAX_CONCURRENT) {
    const task = queue.shift();
    if (task) await task();
  }
};

export const resolveProductImage = async (
  url: string,
  onResolved: (imageUrl: string | null) => void
): Promise<void> => {
  // Check cache first
  if (cache[url]) {
    onResolved(cache[url]);
    return;
  }
  
  // Skip if already pending
  if (pending.has(url)) return;
  
  const task = async () => {
    pending.add(url);
    try {
      const imageUrl = await fetchOGImage(url);
      if (imageUrl) {
        cache[url] = imageUrl;
        saveCache();
        onResolved(imageUrl);
      } else {
        onResolved(null);
      }
    } finally {
      pending.delete(url);
      processQueue();
    }
  };
  
  queue.push(task);
  processQueue();
};

export const getCachedImage = (url: string): string | undefined => {
  return cache[url];
};

// React hook for product images
import { useState, useEffect } from 'react';
import type { Product } from '../data/products';

export const useProductImages = (products: Product[]) => {
  const [images, setImages] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    products.forEach(p => {
      const cached = getCachedImage(p.url);
      if (cached) initial[p.id] = cached;
    });
    return initial;
  });

  useEffect(() => {
    products.forEach(product => {
      if (!images[product.id]) {
        resolveProductImage(product.url, (imageUrl) => {
          if (imageUrl) {
            setImages(prev => ({ ...prev, [product.id]: imageUrl }));
          }
        });
      }
    });
  }, [products, images]);

  return images;
};
