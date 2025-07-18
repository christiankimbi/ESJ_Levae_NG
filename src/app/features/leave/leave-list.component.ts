import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeaveService } from '@services/leave.service';
import { LeaveRequestResult } from '@shared/models/leave-request.model';
import { extractResultData } from '@shared/utils/result.utils';
import { LeaveTypeLabelPipe } from '@shared/pipes/leave-type-label.pipe';
import { LeaveStatusLabelPipe } from '@shared/pipes/leave-status-label.pipe';
import { NotificationService } from '@shared/utils/notification.service';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LeaveTypeLabelPipe, LeaveStatusLabelPipe],
  templateUrl: './leave-list.component.html'
})
export class LeaveListComponent implements OnInit {
  private leaveService = inject(LeaveService);
  public notification = inject(NotificationService);

  confirmingDeleteId: string | null = null;
  leaves: LeaveRequestResult[] = [];

  ngOnInit(): void {
    this.fetchLeaves();
  }

  fetchLeaves(): void {
    this.leaveService.getMyLeave().subscribe({
      next: (res) => {
        const data = extractResultData<LeaveRequestResult[]>(res, () =>
          this.notification.show('Failed to load your leave requests.', 'danger')
        );
        this.leaves = data ?? [];
      },
      error: () => this.notification.show('Something went wrong loading your leave list.', 'danger')
    });
  }

  deleteLeave(id: string): void {
    this.leaveService.cancelLeave(id).subscribe({
      next: () => {
        this.leaves = this.leaves.filter((l) => l.id !== id);
        this.confirmingDeleteId = null;
        this.notification.show('Leave cancelled successfully', 'success');
      },
      error: (err) => {
        const message =
          typeof err.error === 'string'
            ? err.error
            : err?.error?.error ?? 'Failed to cancel leave request';
        this.notification.show(message, 'danger');
      }
    });
  }

  confirmDelete(id: string): void {
    this.confirmingDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }
}

