export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly ratePerSecond: number,
    private readonly capacity: number,
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const refillAmount = Math.floor(elapsed * this.ratePerSecond);

    if (refillAmount > 0) {
      this.tokens = Math.min(this.tokens + refillAmount, this.capacity);
      this.lastRefill = now;
    }
  }

  tryTakeToken(): boolean {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
  numberOfTokensLeft() {
    return this.tokens;
  }
}
