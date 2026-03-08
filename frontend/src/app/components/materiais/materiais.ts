import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { MateriaisService, Material } from '../../services/materiais.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-materiais',
  templateUrl: './materiais.html',
  styleUrls: ['./materiais.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonModule]
})
export class Materiais implements OnInit {
  materials: Material[] = [];
  isLoading = true;

  constructor(private materiaisService: MateriaisService) {}

  ngOnInit() {
    this.materiaisService.getMateriais().subscribe({
      next: (data) => {
        this.materials = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching materials:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(url: string | undefined): string {
    if (!url) return 'assets/Imagens/placeholder.jpg';
    if (url.startsWith('http')) return url;
    
    // If it starts with /media/, we need to ensure it uses the backend URL
    // But remove duplicate / if needed
    const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
  }

  onDownload(material: Material): void {
    console.log('Download requested for:', material.name);
    
    if (material.file) {
      const fileUrl = this.getImageUrl(material.file);
      console.log('Attempting to download from:', fileUrl);

      // 1. Open in new tab (as fallback)
      window.open(fileUrl, '_blank');

      // 2. Trigger automatic download
      this.materiaisService.downloadFile(fileUrl).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const filename = material.file?.split('/').pop() || 'download';
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Download via service failed:', error);
          // Fallback is already handled by the window.open
        }
      });
    } else {
      console.warn('Material has no file associated for download.');
    }
  }
}
