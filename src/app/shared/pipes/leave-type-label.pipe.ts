import { Pipe, PipeTransform } from '@angular/core';
import { LeaveType } from '@shared/models/leave-type.enum';

@Pipe({
  name: 'leaveTypeLabel',
  standalone: true
})
export class LeaveTypeLabelPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case LeaveType.Annual:
        return 'Annual Leave';
      case LeaveType.Sick:
        return 'Sick Leave';
      case LeaveType.Unpaid:
        return 'Unpaid Leave';
      default:
        return 'Unknown';
    }
  }
}
