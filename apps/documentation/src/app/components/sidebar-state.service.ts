import { Injectable, signal } from '@angular/core';

/** Shared open/closed state for the mobile sidebar drawer. */
@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }
}
