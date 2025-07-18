import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '@services/leave.service';
import { extractResultData } from '@shared/utils/result.utils';
import { LeaveRequestResult } from '@shared/models/leave-request.model';
import { LeaveTypeLabelPipe } from '@shared/pipes/leave-type-label.pipe';
import { LeaveStatusLabelPipe } from '@shared/pipes/leave-status-label.pipe';
declare var bootstrap: any;

@Component({
  selector: 'app-approvals-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LeaveStatusLabelPipe, LeaveTypeLabelPipe],
  templateUrl: './approvals-list.component.html',
})
export class ApprovalsListComponent implements OnInit {
  private leaveService = inject(LeaveService);

  leaves: LeaveRequestResult[] = [];
  selectedId: string | null = null;
  rejectionReason: string = '';

  ngOnInit(): void {
    this.leaveService.getTeamLeave().subscribe({
      next: (res) => {
        const data = extractResultData<LeaveRequestResult[]>(res, () =>
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

  openRejectModal(id: string) {
    this.selectedId = id;
    this.rejectionReason = '';
    const modal = new bootstrap.Modal(document.getElementById('rejectModal'));
    modal.show();
  }

  submitRejection(event: Event) {
    event.preventDefault();
    if (!this.selectedId || !this.rejectionReason) return;

    this.leaveService.rejectLeave(this.selectedId, this.rejectionReason).subscribe({
      next: () => {
        this.leaves = this.leaves.filter(l => l.id !== this.selectedId);
        const modalEl = document.getElementById('rejectModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
      },
      error: () => alert('Could not reject request.')
    });
  }
}
