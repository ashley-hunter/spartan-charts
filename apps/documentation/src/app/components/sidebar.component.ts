import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarStateService } from './sidebar-state.service';

@Component({
  selector: 'app-sidebar',

  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile backdrop -->
    @if (sidebar.open()) {
      <div
        class="fixed inset-0 z-30 bg-black/60 lg:hidden"
        (click)="sidebar.close()"
        aria-hidden="true"
      ></div>
    }

    <aside
      class="fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-background pt-16 overflow-y-auto transition-transform duration-200 ease-in-out lg:!translate-x-0"
      [class.translate-x-0]="sidebar.open()"
      [class.-translate-x-full]="!sidebar.open()"
    >
      <nav class="px-4 py-6 space-y-6" (click)="onNavClick($event)">
        <!-- Getting Started -->
        <div>
          <h3 class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Getting Started
          </h3>
          <ul class="space-y-1">
            <li>
              <a routerLink="/" routerLinkActive="bg-accent text-foreground" [routerLinkActiveOptions]="{exact: true}"
                 class="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Introduction
              </a>
            </li>
            <li>
              <a routerLink="/getting-started" routerLinkActive="bg-accent text-foreground"
                 class="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Installation
              </a>
            </li>
          </ul>
        </div>

        <!-- Charts -->
        <div>
          <h3 class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Charts
          </h3>
          <ul class="space-y-1">
            <li>
              <a routerLink="/charts/area-shadcn" routerLinkActive="bg-accent text-foreground"
                 class="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Area Chart
              </a>
            </li>
            <li>
              <a routerLink="/charts/bar-shadcn" routerLinkActive="bg-accent text-foreground"
                 class="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Bar Chart
              </a>
            </li>
            <li>
              <a routerLink="/charts/line-shadcn" routerLinkActive="bg-accent text-foreground"
                 class="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Line Chart
              </a>
            </li>
            <li>
              <a routerLink="/charts/pie-shadcn" routerLinkActive="bg-accent text-foreground"
                 class="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Pie Chart
              </a>
            </li>
            <li>
              <a routerLink="/charts/radial-shadcn" routerLinkActive="bg-accent text-foreground"
                 class="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Radial Chart
              </a>
            </li>
            <li>
              <a routerLink="/charts/radar-shadcn" routerLinkActive="bg-accent text-foreground"
                 class="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                Radar Chart
              </a>
            </li>
          </ul>
        </div>

      </nav>
    </aside>
  `,
  styles: [],
})
export class SidebarComponent {
  protected readonly sidebar = inject(SidebarStateService);

  /** Close the mobile drawer when a nav link is tapped. */
  onNavClick(event: Event): void {
    if ((event.target as HTMLElement).closest('a')) {
      this.sidebar.close();
    }
  }
}
