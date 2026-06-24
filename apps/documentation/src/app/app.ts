import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { CodeDrawerComponent } from './components/code-drawer.component';

@Component({
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CodeDrawerComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
