import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-feedback-success',
  standalone: true,
  imports: [CommonModule, Button, CardModule],
  templateUrl: './feedback-success.html',
  styleUrl: './feedback-success.css'
})
export class FeedbackSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  message: string = 'Operação realizada com sucesso!';
  actionLabel: string = 'Voltar para a lista';
  actionUrl: string = '/admin';
  createLabel: string = 'Criar novo';
  createUrl: string = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['message']) this.message = params['message'];
      if (params['actionLabel']) this.actionLabel = params['actionLabel'];
      if (params['actionUrl']) this.actionUrl = params['actionUrl'];
      if (params['createLabel']) this.createLabel = params['createLabel'];
      if (params['createUrl']) this.createUrl = params['createUrl'];
    });
  }

  goBack() {
    this.router.navigateByUrl(this.actionUrl);
  }

  createNew() {
    if(this.createUrl) {
        this.router.navigateByUrl(this.createUrl);
    }
  }
}
