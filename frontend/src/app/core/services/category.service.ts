import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Category {
    id: string;
    name: string;
}

export interface CategoryResponse {
    data: Category | Category[];
    msg: string;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) { }

    getCategories(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getCategory(id: string): Observable<CategoryResponse> {
        return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
    }

    createCategory(name: string): Observable<CategoryResponse> {
        return this.http.post<CategoryResponse>(this.apiUrl, { name });
    }

    updateCategory(id: string, name: string): Observable<CategoryResponse> {
        return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, { name });
    }

    deleteCategory(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
