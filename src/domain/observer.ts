export type Listener<T> = (state: T) => void;


export abstract class Observable<T> {
  private readonly listeners = new Set<Listener<T>>();
  private state: T;

  protected constructor(initialState: T) {
    this.state = initialState;
  }

  getSnapshot = (): T => this.state;

  /** Registers an observer and returns a function that unsubscribes it. */
  subscribe = (listener: Listener<T>): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  protected setState(next: T): void {
    this.state = next;
    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
