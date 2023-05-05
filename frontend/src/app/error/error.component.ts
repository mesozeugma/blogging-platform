import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  message = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (paramMap) => {
        const errorCode = paramMap.get('errorCode');
        if (errorCode === '404') {
          this.message = '404 - Not Found';
        } else {
          this.message = 'Unexpected error';
        }
      },
    });
  }
}
