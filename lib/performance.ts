import { CacheEntry, PerformanceMetrics, PerformanceReport } from './types';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiResponseTime: number;
  cacheHitRate: number;
  bundleSize: number;
}

export interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
  stale: boolean; // Allow stale data
}

export interface LazyLoadOptions {
  threshold: number; // Intersection threshold
  rootMargin: string; // Root margin for intersection observer
  preload: boolean; // Preload images/components
}

export class PerformanceCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl: number = 300000): void { // Default 5 minutes
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getHitRate(): number {
    // This would need to be tracked separately in a real implementation
    return Math.random() * 0.3 + 0.7; // Mock 70-100% hit rate
  }
}

export class LazyLoader {
  private observer: IntersectionObserver | null = null;
  private options: LazyLoadOptions;

  constructor(options: LazyLoadOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    preload: false,
  }) {
    this.options = options;
    this.initializeObserver();
  }

  private initializeObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target as HTMLElement);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin,
      }
    );
  }

  observe(element: HTMLElement): void {
    if (this.observer) {
      this.observer.observe(element);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadElement(element);
    }
  }

  private loadElement(element: HTMLElement): void {
    const src = element.getAttribute('data-src');
    const srcset = element.getAttribute('data-srcset');

    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      if (src) img.src = src;
      if (srcset) img.srcset = srcset;
    } else if (element.tagName === 'IFRAME') {
      const iframe = element as HTMLIFrameElement;
      if (src) iframe.src = src;
    }

    element.classList.remove('lazy');
    element.classList.add('loaded');
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private cache = new PerformanceCache(200);

  private constructor() {
    this.initializeMonitoring();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor page load performance
    window.addEventListener('load', () => {
      this.recordLoadMetrics();
    });

    // Monitor memory usage periodically
    setInterval(() => {
      this.recordMemoryMetrics();
    }, 30000); // Every 30 seconds
  }

  private recordLoadMetrics(): void {
    if (!performance || !performance.timing) return;

    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const renderTime = timing.domContentLoadedEventEnd - timing.navigationStart;

    const metrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      memoryUsage: this.getMemoryUsage(),
      apiResponseTime: 0, // Will be updated by API calls
      cacheHitRate: this.cache.getHitRate(),
      bundleSize: this.getBundleSize(),
    };

    this.metrics.push(metrics);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  private recordMemoryMetrics(): void {
    const memoryUsage = this.getMemoryUsage();
    
    if (this.metrics.length > 0) {
      this.metrics[this.metrics.length - 1].memoryUsage = memoryUsage;
    }
  }

  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    return 0;
  }

  private getBundleSize(): number {
    // In a real implementation, this would be calculated during build
    return Math.random() * 500 + 1000; // Mock 1000-1500 KB
  }

  recordApiCall(url: string, responseTime: number): void {
    if (this.metrics.length > 0) {
      this.metrics[this.metrics.length - 1].apiResponseTime = responseTime;
    }

    // Cache API response times for analysis
    this.cache.set(`api_${url}_${Date.now()}`, responseTime, 3600000); // 1 hour
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        loadTime: 0,
        renderTime: 0,
        memoryUsage: 0,
        apiResponseTime: 0,
        cacheHitRate: 0,
        bundleSize: 0,
      };
    }

    const sum = this.metrics.reduce((acc, metric) => ({
      loadTime: acc.loadTime + metric.loadTime,
      renderTime: acc.renderTime + metric.renderTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      apiResponseTime: acc.apiResponseTime + metric.apiResponseTime,
      cacheHitRate: acc.cacheHitRate + metric.cacheHitRate,
      bundleSize: acc.bundleSize + metric.bundleSize,
    }));

    const count = this.metrics.length;

    return {
      loadTime: Math.round(sum.loadTime / count),
      renderTime: Math.round(sum.renderTime / count),
      memoryUsage: Math.round(sum.memoryUsage / count),
      apiResponseTime: Math.round(sum.apiResponseTime / count),
      cacheHitRate: Math.round((sum.cacheHitRate / count) * 100) / 100,
      bundleSize: Math.round(sum.bundleSize / count),
    };
  }

  getCache(): PerformanceCache {
    return this.cache;
  }
}

export class PerformanceOptimizer {
  private static monitor = PerformanceMonitor.getInstance();
  private static lazyLoader = new LazyLoader();

  static async optimizeApiCall<T>(
    key: string,
    apiCall: () => Promise<T>,
    cacheOptions: CacheOptions = { ttl: 300000, maxSize: 100, stale: false }
  ): Promise<T> {
    const cache = this.monitor.getCache();
    
    // Check cache first
    const cachedData = cache.get(key);
    if (cachedData) {
      return cachedData;
    }

    // Make API call with timing
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Record performance metrics
      this.monitor.recordApiCall(key, responseTime);

      // Cache the result
      cache.set(key, result, cacheOptions.ttl);

      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      this.monitor.recordApiCall(key, responseTime);
      throw error;
    }
  }

  static debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  static throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static async preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  static async preloadImages(srcs: string[]): Promise<void> {
    const promises = srcs.map(src => this.preloadImage(src));
    await Promise.all(promises);
  }

  static initializeLazyLoading(): void {
    if (typeof window === 'undefined') return;

    // Find all lazy-loadable elements
    const lazyElements = document.querySelectorAll('.lazy');
    
    lazyElements.forEach((element) => {
      this.lazyLoader.observe(element as HTMLElement);
    });
  }

  static optimizeBundle(): {
    suggestions: string[];
    potentialSavings: string;
  } {
    const metrics = this.monitor.getAverageMetrics();
    const suggestions: string[] = [];
    let potentialSavings = 0;

    if (metrics.bundleSize > 1500) {
      suggestions.push('Consider code splitting to reduce bundle size');
      potentialSavings += 200;
    }

    if (metrics.loadTime > 3000) {
      suggestions.push('Implement lazy loading for non-critical components');
      potentialSavings += 500;
    }

    if (metrics.cacheHitRate < 0.8) {
      suggestions.push('Improve caching strategy for better performance');
      potentialSavings += 300;
    }

    if (metrics.memoryUsage > 50) {
      suggestions.push('Optimize memory usage by cleaning up unused objects');
      potentialSavings += 100;
    }

    return {
      suggestions,
      potentialSavings: `${potentialSavings}ms`,
    };
  }

  static generatePerformanceReport(): {
    metrics: PerformanceMetrics;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    recommendations: string[];
  } {
    const metrics = this.monitor.getAverageMetrics();
    let score = 100;

    // Scoring algorithm
    if (metrics.loadTime > 3000) score -= 20;
    if (metrics.renderTime > 1500) score -= 15;
    if (metrics.memoryUsage > 50) score -= 15;
    if (metrics.apiResponseTime > 1000) score -= 20;
    if (metrics.cacheHitRate < 0.8) score -= 15;
    if (metrics.bundleSize > 1500) score -= 15;

    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

    const recommendations: string[] = [];
    
    if (metrics.loadTime > 3000) {
      recommendations.push('Optimize initial page load time');
    }
    if (metrics.apiResponseTime > 1000) {
      recommendations.push('Implement API response caching');
    }
    if (metrics.bundleSize > 1500) {
      recommendations.push('Use code splitting and tree shaking');
    }
    if (metrics.memoryUsage > 50) {
      recommendations.push('Implement memory leak detection');
    }

    return {
      metrics,
      grade,
      recommendations,
    };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
export default PerformanceOptimizer; 