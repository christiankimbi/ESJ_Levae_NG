import { Pipe, PipeTransform } from '@angular/core';
import { LeaveStatus } from '../models/leave-status.enum';

@Pipe({ name: 'leaveStatusLabel', standalone: true })
export class LeaveStatusLabelPipe implements PipeTransform {
  transform(status: LeaveStatus): string {
    switch (status) {
      case LeaveStatus.Pending:
        return 'Pending';
      case LeaveStatus.Approved:
        return 'Approved';
      case LeaveStatus.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }
}
