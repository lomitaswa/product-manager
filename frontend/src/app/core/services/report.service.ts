import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private readonly apiUrl = `${environment.apiUrl}/reports`;

    constructor(private http: HttpClient) { }

    generateReport(format: 'csv' | 'xlsx'): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/products`, { format });
    }

    getReportStatus(jobId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/status/${jobId}`);
    }

    getReports(page: number = 1, limit: number = 10, sortBy: string = 'created_at', sortOrder: 'ASC' | 'DESC' = 'DESC'): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/products?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    }

    downloadReport(jobId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/download/${jobId}`, { responseType: 'blob' });
    }

    deleteReport(jobId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${jobId}`);
    }
}
