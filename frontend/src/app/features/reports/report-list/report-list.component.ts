import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../core/services/upload.service';
import { ReportService } from '../../../core/services/report.service';
import { interval, switchMap, takeWhile } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {
  reports: any[] = [];
  isUploading = false;
  uploadMessage = '';
  isGenerating = false;
  displayedColumns: string[] = ['id', 'job_type', 'format', 'status', 'created_at', 'actions'];
  totalReports = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'created_at';
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  constructor(
    private uploadService: UploadService,
    private reportService: ReportService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports(this.pageIndex + 1, this.pageSize, this.sortBy, this.sortOrder).subscribe({
      next: (res) => {
        this.reports = res.data.jobs;
        this.totalReports = res.data.total;
      },
      error: () => {
        console.error('Failed to load reports history');
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadReports();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.sortBy = sortState.active;
      this.sortOrder = sortState.direction.toUpperCase() as 'ASC' | 'DESC';
      this.pageIndex = 0;
      this.loadReports();
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.uploadMessage = 'Uploading...';
      this.uploadService.uploadBulkProducts(file).subscribe({
        next: (res) => {
          this.snackBar.open(`Upload started! Job ID: ${res.data.jobId}`, 'Close', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'bottom' });
          this.pollJobStatus(res.data.jobId);
          this.isUploading = false;
        },
        error: (err) => {
          this.snackBar.open('Upload failed: ' + (err.error?.error || 'Unknown error'), 'Close', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'bottom', panelClass: ['error-snackbar'] });
          this.isUploading = false;
        }
      });
    }
  }

  generateReport(format: 'csv' | 'xlsx'): void {
    this.isGenerating = true;
    this.reportService.generateReport(format).subscribe({
      next: (res) => {
        alert(`Report generation started! Job ID: ${res.data.jobId}. You can download it once it's completed.`);
        this.isGenerating = false;
        this.loadReports();
      },
      error: () => {
        alert('Failed to start report generation.');
        this.isGenerating = false;
      }
    });
  }

  download(report: any): void {
    this.reportService.downloadReport(report.id).subscribe({
      next: (blob) => {
        let extension = report.format;

        if (!extension && report.result_file_path) {
          const parts = report.result_file_path.split('.');
          extension = parts[parts.length - 1];
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report_${report.id}.${extension || 'csv'}`;
        link.click();
      },
      error: (err) => {
        alert('Report might not be ready yet or an error occurred during download.');
      }
    });
  }

  deleteReport(id: string): void {
    if (confirm('Are you sure you want to delete this report history?')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          this.loadReports();
        },
        error: () => {
          alert('Failed to delete report.');
        }
      });
    }
  }

  pollJobStatus(jobId: string): void {
    interval(2000)
      .pipe(
        switchMap(() => this.reportService.getReportStatus(jobId)),
        takeWhile((res: any) => {
          const status = res.data.status;
          return status !== 'COMPLETED' && status !== 'FAILED';
        }, true)
      )
      .subscribe({
        next: (res: any) => {
          const status = res.data.status;
          if (status === 'COMPLETED') {
            this.snackBar.open('Bulk upload completed successfully! 🎉', 'Close', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
            this.loadReports();
          } else if (status === 'FAILED') {
            this.snackBar.open(`Bulk upload failed: ${res.data.error_message || 'Unknown error'}`, 'Close', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        },
        error: () => {
          console.error('Error polling job status');
        }
      });
  }
}
