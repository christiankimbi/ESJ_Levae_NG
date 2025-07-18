export enum LeaveType {
  Annual = 1,
  Sick = 2,
  Unpaid = 3
}

export function getLeaveTypeLabel(type: number): string {
  switch (type) {
    case LeaveType.Annual: return 'Annual Leave';
    case LeaveType.Sick: return 'Sick Leave';
    case LeaveType.Unpaid: return 'Unpaid Leave';
    default: return 'Unknown';
  }
}
