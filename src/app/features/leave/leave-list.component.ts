import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '@services/leave.service';
import { LeaveRequest } from '@shared/models/leave-request.model';
import { extractResultData } from '@shared/utils/result.utils';
import { LeaveTypeLabelPipe } from '@shared/pipes/leave-type-label.pipe';


@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, LeaveTypeLabelPipe],
  template: `
    <div class="container mt-4">
      <h5>My Leave Requests</h5>
      <ul class="list-group mt-3" *ngIf="leaves.length > 0; else noData">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          *ngFor="let leave of leaves"
        >
          <div>
            <strong>{{ leave.leaveType | leaveTypeLabel }}</strong>| |
            {{ leave.startDate | date }} → {{ leave.endDate | date }}
            <div class="text-muted small">{{ leave.comments }}</div>
          </div>
          <button
            class="btn btn-sm btn-outline-danger"
            (click)="deleteLeave(leave.id)"
          >
            Delete
          </button>
        </li>
      </ul>
      <ng-template #noData>
        <p class="text-muted">No leave requests found.</p>
      </ng-template>
    </div>
  `,
})
export class LeaveListComponent implements OnInit {
  private leaveService = inject(LeaveService);
  leaves: LeaveRequest[] = [];

  ngOnInit(): void {
    this.fetchLeaves();
  }

  fetchLeaves(): void {
    this.leaveService.getMyLeave().subscribe({
      next: (res) => {
        const data = extractResultData<LeaveRequest[]>(res, () =>
          alert('Failed to load your leave requests.')
        );
        this.leaves = data ?? [];
      },
      error: () => alert('Something went wrong loading your leave list.')
    });
  }

  deleteLeave(id: string): void {
    if (!confirm('Are you sure you want to delete this leave request?')) return;

    this.leaveService.cancelLeave(id).subscribe({
      next: () => {
        this.leaves = this.leaves.filter((l) => l.id !== id);
      },
      error: () => alert('Failed to delete leave request')
    });
  }
}
