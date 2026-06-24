import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarStateService } from './sidebar-state.service';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-header',

  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-4 lg:space-x-8">
            <!-- Mobile menu button -->
            <button
              type="button"
              (click)="sidebar.toggle()"
              class="lg:hidden -ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <a routerLink="/" class="flex items-center space-x-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <span class="text-base font-semibold text-foreground"
                >Spartan Charts</span
              >
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center space-x-6">
              <a
                routerLink="/"
                routerLinkActive="text-foreground"
                [routerLinkActiveOptions]="{ exact: true }"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </a>
              <a
                routerLink="/getting-started"
                routerLinkActive="text-foreground"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Getting Started
              </a>
              <a
                routerLink="/charts/area-shadcn"
                routerLinkActive="text-foreground"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Charts
              </a>
            </nav>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-1">
            <!-- Theme toggle -->
            <button
              type="button"
              (click)="theme.toggle()"
              class="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              @if (theme.theme() === 'dark') {
                <!-- Sun -->
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" stroke-width="2" />
                  <path
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  />
                </svg>
              } @else {
                <!-- Moon -->
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  />
                </svg>
              }
            </button>

            <a
              href="https://github.com/ashley-hunter/spartan-charts"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span class="sr-only">GitHub</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  protected readonly sidebar = inject(SidebarStateService);
  protected readonly theme = inject(ThemeService);
}
