export interface LeaveRequest {
  id: string;
  leaveType: number;
  startDate: string;
  endDate: string;
  comments?: string;
}
