import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  signal,
} from '@angular/core';

/**
 * shadcn-style "View Code" control: the chart stays visible; the button opens
 * the full component source in a right-side drawer (overlay) with a copy button.
 * Fully themed via the shadcn tokens.
 */
@Component({
  selector: 'app-code-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <button type="button" class="ghost-btn" (click)="open.set(true)">View Code</button>
    </div>

    <div class="preview">
      <ng-content />
    </div>

    @if (open()) {
      <div class="drawer-backdrop" (click)="open.set(false)"></div>
      <aside class="drawer" role="dialog" aria-label="Component source">
        <header class="drawer-head">
          <span class="drawer-title">Code</span>
          <div class="drawer-actions">
            <button type="button" class="copy-btn" (click)="copy()">
              {{ copied() ? 'Copied' : 'Copy' }}
            </button>
            <button type="button" class="close-btn" aria-label="Close" (click)="open.set(false)">
              &#10005;
            </button>
          </div>
        </header>
        <pre><code>{{ code() }}</code></pre>
      </aside>
    }
  `,
  styles: [
    `
      :host { display: block; }
      .bar { display: flex; justify-content: flex-end; margin-bottom: 0.75rem; }
      .ghost-btn {
        font-size: 0.8125rem;
        font-weight: 500;
        color: hsl(var(--muted-foreground));
        background: transparent;
        border: 1px solid hsl(var(--border));
        border-radius: calc(var(--radius) - 2px);
        padding: 0.25rem 0.625rem;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
      }
      .ghost-btn:hover { color: hsl(var(--foreground)); background: hsl(var(--accent)); }

      .drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgb(0 0 0 / 0.5);
        z-index: 50;
        animation: fade 0.15s ease-out;
      }
      .drawer {
        position: fixed;
        top: 0;
        right: 0;
        height: 100dvh;
        width: min(680px, 92vw);
        z-index: 51;
        display: flex;
        flex-direction: column;
        background: hsl(var(--background));
        border-left: 1px solid hsl(var(--border));
        box-shadow: -8px 0 24px -8px rgb(0 0 0 / 0.3);
        animation: slide 0.2s ease-out;
      }
      @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
      .drawer-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid hsl(var(--border));
      }
      .drawer-title { font-size: 0.875rem; font-weight: 600; color: hsl(var(--foreground)); }
      .drawer-actions { display: flex; align-items: center; gap: 0.5rem; }
      .copy-btn, .close-btn {
        font-size: 0.75rem;
        color: hsl(var(--muted-foreground));
        background: transparent;
        border: 1px solid hsl(var(--border));
        border-radius: calc(var(--radius) - 2px);
        padding: 0.125rem 0.5rem;
        cursor: pointer;
      }
      .copy-btn:hover, .close-btn:hover { color: hsl(var(--foreground)); background: hsl(var(--accent)); }
      pre {
        margin: 0;
        padding: 1.25rem;
        flex: 1;
        overflow: auto;
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        font-size: 0.8125rem;
        line-height: 1.6;
        color: hsl(var(--foreground));
        background: hsl(var(--muted) / 0.3);
        tab-size: 2;
      }
    `,
  ],
})
export class CodePreviewComponent {
  /** Full component source to show in the drawer. */
  readonly code = input<string>('');
  protected readonly open = signal(false);
  protected readonly copied = signal(false);

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.open.set(false);
  }

  protected copy(): void {
    navigator.clipboard?.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }
}
