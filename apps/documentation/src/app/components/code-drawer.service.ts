import { Injectable, signal } from '@angular/core';

/** Holds the source currently shown in the global View Code drawer. */
@Injectable({ providedIn: 'root' })
export class CodeDrawerService {
  readonly code = signal<string | null>(null);

  open(code: string): void {
    this.code.set(code);
  }

  close(): void {
    this.code.set(null);
  }
}
