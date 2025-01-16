interface RateLimitState {
  count: number;
  reset: Date;
}

class RateLimiter {
  private limits: Map<string, RateLimitState> = new Map();
  
  check(key: string, limit: number): boolean {
    const now = new Date();
    const state = this.limits.get(key);
    
    // Clean up expired state
    if (state && state.reset < now) {
      this.limits.delete(key);
    }
    
    // If no state exists, create new one
    if (!this.limits.has(key)) {
      this.limits.set(key, {
        count: 0,
        reset: new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
      });
    }
    
    const currentState = this.limits.get(key)!;
    
    // Check if limit exceeded
    if (currentState.count >= limit) {
      return false;
    }
    
    // Increment counter
    currentState.count++;
    return true;
  }
  
  getReset(key: string): Date | null {
    return this.limits.get(key)?.reset || null;
  }
}

export const rateLimiter = new RateLimiter();