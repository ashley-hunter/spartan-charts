import { Component, Input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { CodeBlockComponent } from './code-block.component';

@Component({
  selector: 'app-example-viewer',
  host: {
    '[attr.title]': 'null',
  },
  
  imports: [NgComponentOutlet, CodeBlockComponent],
  template: `
    <section class="space-y-6">
      <div>
        <h2 class="text-3xl font-bold text-slate-100 mb-2 pt-8">{{ exampleTitle }}</h2>
        @if (description) {
          <p class="text-slate-400">{{ description }}</p>
        }
      </div>

      <div class="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
        <!-- Example Display -->
        <div class="example-container bg-slate-900 rounded-xl p-6 border border-slate-700 min-h-[450px]">
          <ng-container [ngComponentOutlet]="component" />
        </div>

        <!-- Source Code -->
        <div class="mt-6 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div class="bg-slate-900 px-6 py-3 border-b border-slate-700">
            <span class="text-sm font-medium text-slate-400">Code</span>
          </div>
          <app-code-block [code]="sourceCode" language="typescript" theme="github-dark" />
        </div>
      </div>
    </section>
  `,
  styles: [`
    .example-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .example-container ::ng-deep > * {
      width: 100%;
    }
  `],
})
export class ExampleViewerComponent {
  @Input({ required: true, alias: 'title' }) exampleTitle!: string;
  @Input() description?: string;
  @Input({ required: true }) component!: any;
  @Input({ required: true }) sourceCode!: string;
}
