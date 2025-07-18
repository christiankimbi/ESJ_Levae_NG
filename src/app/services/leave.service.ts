import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from '@shared/models/leave-request.model';
import { Result } from '@shared/models/result.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private http = inject(HttpClient);

  getLeaveById(id: string): Observable<Result<LeaveRequest>> {
    return this.http.get<Result<LeaveRequest>>(`/api/leave/requests/${id}`);
  }


  getMyLeave(): Observable<Result<LeaveRequest[]>> {
    return this.http.get<Result<LeaveRequest[]>>(`/api/leave/requests/mine`);
  }


  submitLeave(payload: Omit<LeaveRequest, 'id'>): Observable<Result<any>> {
    return this.http.post<Result<any>>(`/api/leave/requests`, payload);
  }


  updateLeave(id: string, payload: Omit<LeaveRequest, 'id'>): Observable<Result<any>> {
    return this.http.put<Result<any>>(`/api/leave/requests/${id}`, payload);
  }

  cancelLeave(id: string): Observable<void> {
    return this.http.delete<void>(`/api/leave/requests/${id}`);
  }


  approveLeave(id: string): Observable<Result<any>> {
    return this.http.post<Result<any>>(`/api/leave/requests/${id}/approve`, {});
  }

  rejectLeave(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`/api/leave/requests/${id}/reject`, { reason });
  }


  getTeamLeave(): Observable<Result<LeaveRequest[]>> {
    return this.http.get<Result<LeaveRequest[]>>(`/api/leave/requests/team`);
  }


}
