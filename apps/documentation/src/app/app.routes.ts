import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./pages/getting-started.component').then(
        (m) => m.GettingStartedComponent
      ),
  },
  // shadcn chart showcases
  {
    path: 'charts/area-shadcn',
    loadComponent: () =>
      import('./pages/area-shadcn.component').then((m) => m.AreaShadcnComponent),
  },
  {
    path: 'charts/bar-shadcn',
    loadComponent: () =>
      import('./pages/bar-shadcn.component').then((m) => m.BarShadcnComponent),
  },
  {
    path: 'charts/line-shadcn',
    loadComponent: () =>
      import('./pages/line-shadcn.component').then((m) => m.LineShadcnComponent),
  },
  {
    path: 'charts/pie-shadcn',
    loadComponent: () =>
      import('./pages/pie-shadcn.component').then((m) => m.PieShadcnComponent),
  },
  {
    path: 'charts/radial-shadcn',
    loadComponent: () =>
      import('./pages/radial-shadcn.component').then((m) => m.RadialShadcnComponent),
  },
  {
    path: 'charts/radar-shadcn',
    loadComponent: () =>
      import('./pages/radar-shadcn.component').then((m) => m.RadarShadcnComponent),
  },
  // Chrome-less capture routes for the visual-diff harness
  {
    path: 'iso/area',
    loadComponent: () =>
      import('./pages/iso-area.component').then((m) => m.IsoAreaComponent),
  },
  {
    path: 'iso/bar',
    loadComponent: () =>
      import('./pages/iso-bar.component').then((m) => m.IsoBarComponent),
  },
  {
    path: 'iso/line',
    loadComponent: () =>
      import('./pages/iso-line.component').then((m) => m.IsoLineComponent),
  },
  {
    path: 'iso/pie',
    loadComponent: () =>
      import('./pages/iso-pie.component').then((m) => m.IsoPieComponent),
  },
  {
    path: 'iso/radial',
    loadComponent: () =>
      import('./pages/iso-radial.component').then((m) => m.IsoRadialComponent),
  },
  {
    path: 'iso/radar',
    loadComponent: () =>
      import('./pages/iso-radar.component').then((m) => m.IsoRadarComponent),
  },
  { path: '**', redirectTo: '' },
];
