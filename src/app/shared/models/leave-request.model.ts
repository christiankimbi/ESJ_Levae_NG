export interface LeaveRequest {
  id: string;
  leaveType: number;
  startDate: string;
  endDate: string;
  comments?: string;
}


export interface LeaveRequestResult {
  id: string;
  leaveType: number;
  status: number; 
  startDate: string;
  endDate: string;
  comments?: string;
  rejectionReason?: string;
  approvedBy?: number;
  createdAt?: string;
  employee?: EmployeeResult;
  approver?: EmployeeResult;
}

export interface EmployeeResult {
  id: number;
  fullName: string;
}
