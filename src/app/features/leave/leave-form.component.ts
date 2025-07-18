import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '@services/leave.service';
import { ActivatedRoute, Router } from '@angular/router';
import { extractResultData } from '@shared/utils/result.utils';
import { LeaveRequest } from '@shared/models/leave-request.model';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4" style="max-width: 500px;">
      <h5 *ngIf="!isEdit">Submit Leave</h5>
      <h5 *ngIf="isEdit">Update Leave</h5>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="mb-3">
          <label>Leave Type</label>
          <select class="form-select" formControlName="leaveType">
            <option [value]="1">Annual</option>
            <option [value]="2">Sick</option>
            <option [value]="3">Unpaid</option>
          </select>
        </div>

        <div class="mb-3">
          <label>Start Date</label>
          <input type="date" class="form-control" formControlName="startDate" />
        </div>

        <div class="mb-3">
          <label>End Date</label>
          <input type="date" class="form-control" formControlName="endDate" />
        </div>

        <div class="mb-3">
          <label>Comments</label>
          <textarea class="form-control" formControlName="comments"></textarea>
        </div>

        <button class="btn btn-primary w-100" [disabled]="form.invalid">
          {{ isEdit ? 'Update' : 'Submit' }}
        </button>
      </form>
    </div>
  `
})
export class LeaveFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leaveService = inject(LeaveService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.nonNullable.group({
    leaveType: 1,
    startDate: '',
    endDate: '',
    comments: ''
  });

  isEdit = false;
  id: string | null = null;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.leaveService.getLeaveById(this.id!).subscribe({
        next: (res) => {
          const l = extractResultData<LeaveRequest>(res, () => alert('Failed to load leave data.'));
          if (l) {
            this.form.setValue({
              leaveType: l.leaveType,
              startDate: l.startDate.split('T')[0],
              endDate: l.endDate.split('T')[0],
              comments: l.comments ?? ''
            });
          }
        },
        error: () => alert('Something went wrong fetching the leave request.')
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue() as {
      leaveType: number;
      startDate: string;
      endDate: string;
      comments?: string;
    };

    const request = this.isEdit
      ? this.leaveService.updateLeave(this.id!, payload)
      : this.leaveService.submitLeave(payload);

    request.subscribe({
      next: () => this.router.navigateByUrl('/leave'),
      error: () => alert('Failed to save leave request')
    });
  }
}
