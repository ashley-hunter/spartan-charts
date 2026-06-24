import { Component, input, OnInit, signal, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { codeToHtml } from 'shiki';

@Component({
  selector: 'app-code-block',
  
  template: `
    @if (highlightedCode()) {
      <div [innerHTML]="highlightedCode()"></div>
    } @else {
      <pre class="p-6 overflow-x-auto"><code class="text-sm text-foreground font-mono">{{ code() }}</code></pre>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
    :host ::ng-deep pre {
      margin: 0;
      padding: 1.5rem;
      overflow-x: auto;
      border-radius: 0;
      /* Keep shiki's own (dark) background so github-dark colours stay readable. */
    }
    :host ::ng-deep code {
      font-size: 0.875rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }
  `],
})
export class CodeBlockComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  
  code = input.required<string>();
  language = input<string>('typescript');
  theme = input<string>('github-dark');

  highlightedCode = signal<SafeHtml>('');

  async ngOnInit() {
    try {
      const html = await codeToHtml(this.code(), {
        lang: this.language(),
        theme: this.theme(),
      });
      // Shiki generates safe HTML, but we explicitly mark it as trusted
      this.highlightedCode.set(this.sanitizer.bypassSecurityTrustHtml(html));
    } catch (error) {
      console.error('Error highlighting code:', error);
      // Fallback to plain code if highlighting fails
    }
  }
}
