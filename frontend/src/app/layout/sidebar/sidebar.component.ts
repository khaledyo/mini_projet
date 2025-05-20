import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  constructor(private router: Router,private sidebarService: SidebarService) {}
  
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
      }
    });
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isCollapsed = isCollapsed;
    });
    
  }

  // Check if any child link in a dropdown is active
  isDropdownActive(dropdownId: string): boolean {
    switch (dropdownId) {
      case 'pages':
        return this.router.isActive('/enseignant', true) || this.router.isActive('/etudiants', true) ||this.router.isActive('/classe', true) ;
      case 'posts':
        return this.router.isActive('/Initiation', true) || this.router.isActive('/perfectionnement', true) || this.router.isActive('/pfe', true);
      case 'auth':
        return this.router.isActive('/reset-password', true) || this.router.isActive('/profile', true);
      default:
        return false;
    }
  }
}