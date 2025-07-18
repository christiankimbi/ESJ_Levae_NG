import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '@services/leave.service';
import { LeaveRequest } from '@shared/models/leave-request.model';
import { extractResultData } from '@shared/utils/result.utils';
import { LeaveTypeLabelPipe } from '@shared/pipes/leave-type-label.pipe';

@Component({
  selector: 'app-approvals-list',
  standalone: true,
  imports: [CommonModule, LeaveTypeLabelPipe],
  template: `
    <div class="container mt-4">
      <h5>Team Leave Requests</h5>
      <ul class="list-group mt-3" *ngIf="leaves.length > 0; else noData">
        <li class="list-group-item" *ngFor="let leave of leaves">
          <div>
            <strong>{{ leave.leaveType | leaveTypeLabel }}</strong> |
            {{ leave.startDate | date }} → {{ leave.endDate | date }}
            <div class="text-muted small">{{ leave.comments }}</div>
          </div>
          <div class="mt-2">
            <button class="btn btn-sm btn-success me-2" (click)="approve(leave.id)">Approve</button>
            <button class="btn btn-sm btn-danger" (click)="reject(leave.id)">Reject</button>
          </div>
        </li>
      </ul>
      <ng-template #noData>
        <p class="text-muted">No pending team leave requests.</p>
      </ng-template>
    </div>
  `,
})
export class ApprovalsListComponent implements OnInit {
  private leaveService = inject(LeaveService);
  leaves: LeaveRequest[] = [];


  ngOnInit(): void {
    this.leaveService.getTeamLeave().subscribe({
      next: (res) => {
        const data = extractResultData<LeaveRequest[]>(res, () =>
          alert('Failed to load team leave requests.')
        );
        this.leaves = data ?? [];
      },
      error: () => alert('Something went wrong fetching approvals.')
    });
  }

  approve(id: string) {
    if (!confirm('Approve this leave request?')) return;
    this.leaveService.approveLeave(id).subscribe({
      next: (res) => {
        if (res?.isSuccess) {
          this.leaves = this.leaves.filter(l => l.id !== id);
        } else {
          alert(res?.error ?? 'Approval failed');
        }
      },
      error: () => alert('Could not approve request.')
    });
  }

  reject(id: string) {
    if (!confirm('Reject this leave request?')) return;
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    this.leaveService.rejectLeave(id, reason).subscribe({
      next: () => {
        this.leaves = this.leaves.filter(l => l.id !== id);
      },
      error: () => alert('Could not reject request.')
    });
  }
}
