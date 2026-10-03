import { useSyncExternalStore } from "react";
import type { Observable } from "@/domain/observer";


export function useObservable<T>(observable: Observable<T>): T {
  return useSyncExternalStore(observable.subscribe, observable.getSnapshot, observable.getSnapshot);
}
