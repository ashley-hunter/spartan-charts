/** Build a representative standalone-component TS snippet for the View Code TS tab. */
export function chartComponentTs(
  selector: string,
  imports: string[],
  html: string,
  data: unknown,
): string {
  const imp = imports.join(', ');
  const tmpl = html
    .split('\n')
    .map((l) => '    ' + l)
    .join('\n');

  // Keep the data readable: cap long datasets (e.g. the 90-day interactive set).
  let value = data;
  let trailer = '';
  if (Array.isArray(data) && data.length > 8) {
    value = data.slice(0, 6);
    trailer = `\n    // ...${data.length - 6} more rows`;
  }
  const dataStr = JSON.stringify(value, null, 2)
    .split('\n')
    .map((l, i) => (i ? '  ' : '') + l)
    .join('\n')
    .replace(/\n\]$/, `${trailer}\n  ]`);

  // Define any helpers the template references so the snippet compiles as-is.
  const members = [`  readonly data = ${dataStr};`];
  if (html.includes('"fmt"')) {
    members.push('  readonly fmt = (value: string) => value.slice(0, 3);');
  }

  return `import { Component } from '@angular/core';
import { ${imp} } from '@spartan-ng/charts';

@Component({
  selector: '${selector}',
  imports: [${imp}],
  template: \`
${tmpl}
  \`,
})
export class ChartDemo {
${members.join('\n\n')}
}`;
}
