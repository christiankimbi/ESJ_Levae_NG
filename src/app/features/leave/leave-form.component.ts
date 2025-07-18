import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveService } from '@services/leave.service';
import { ActivatedRoute, Router } from '@angular/router';
import { extractResultData } from '@shared/utils/result.utils';
import { LeaveRequest } from '@shared/models/leave-request.model';
import { NotificationService } from '@shared/utils/notification.service';
import {
  formatToDateInput,
  countWorkingDays,
  isWeekend,
  isPublicHoliday,
  toIsoDate
} from '@shared/utils/date-utils'

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-form.component.html'
})
export class LeaveFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leaveService = inject(LeaveService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public notification = inject(NotificationService);

  form = this.fb.nonNullable.group({
    leaveType: 1,
    startDate: '',
    endDate: '',
    comments: ''
  });

  isEdit = false;
  id: string | null = null;
  daysCount = 0;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.leaveService.getLeaveById(this.id!).subscribe({
        next: (res) => {
          const l = extractResultData<LeaveRequest>(res, () =>
            this.notification.show('Failed to load leave data.')
          );
          if (l) {
            this.form.setValue({
              leaveType: l.leaveType,
              startDate: formatToDateInput(l.startDate),
              endDate: formatToDateInput(l.endDate),
              comments: l.comments ?? ''
            });
            this.validateStartDate();
            this.updateDaysCount();
          }
        },
        error: () => this.notification.show('Error fetching the leave request')
      });
    }

    this.form.get('startDate')?.valueChanges.subscribe(() => {
      this.validateStartDate();
      this.updateDaysCount();
    });

    this.form.get('endDate')?.valueChanges.subscribe(() => {
      this.updateDaysCount();
    });
  }

  validateStartDate(): void {
    const value = this.form.get('startDate')?.value;
    if (!value) return;

    const date = new Date(value);
    if (isWeekend(date) || isPublicHoliday(date)) {
      this.notification.show('Start date cannot be a weekend or public holiday', 'danger');
      this.form.get('startDate')?.setValue('');
    }
  }

  updateDaysCount(): void {
    const start = this.form.get('startDate')?.value;
    const end = this.form.get('endDate')?.value;

    this.daysCount = countWorkingDays(start ?? '', end ?? '');
  }
  
  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();

    const request = this.isEdit
      ? this.leaveService.updateLeave(this.id!, payload)
      : this.leaveService.submitLeave(payload);

    request.subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.notification.show(this.isEdit ? 'Leave updated successfully' : 'Leave submitted successfully', 'success');
          this.router.navigateByUrl('/leave');
        } else {
          this.notification.show(res.error || 'Failed to save leave request', 'danger');
        }
      },
      error: (err) => {
        const serverMessage = err?.error?.error ?? 'There was a problem serving your request';
        this.notification.show(serverMessage, 'danger');
      }
    });
  }
}
