import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { UserResponseDTO } from '../../../models/user';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css'
})
export class Ranking implements OnInit {
  topUsers: UserResponseDTO[] = [];
  currentUserId: string | null = null;
  isLoading = true;

  constructor(private userService: UserService, private authService: AuthService) {
    const user = this.authService.getUser();
    this.currentUserId = user ? user.id : null;
  }

  ngOnInit(): void {
    this.userService.getLeaderboard().subscribe({
      next: (users: UserResponseDTO[]) => {
        this.topUsers = users;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando ranking', err);
        this.isLoading = false;
      }
    });
  }

  getRankClass(index: number): string {
    if (index === 0) return 'rank-gold';
    if (index === 1) return 'rank-silver';
    if (index === 2) return 'rank-bronze';
    return 'rank-default';
  }
}