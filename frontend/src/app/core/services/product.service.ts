import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Product {
    id: string;
    name: string;
    image_url?: string;
    price: number;
    category_id: string;
    category_name?: string;
}

export interface ProductListResponse {
    data: {
        products: Product[];
        total: number;
        page: number;
        limit: number;
    };
    msg: string;
}

export interface ProductFilters {
    category_id?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getProducts(filters: ProductFilters): Observable<ProductListResponse> {
        let params = new HttpParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, value.toString());
            }
        });

        return this.http.get<ProductListResponse>(this.apiUrl, { params });
    }

    getProduct(id: string): Observable<{ data: Product; msg: string }> {
        return this.http.get<{ data: Product; msg: string }>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, product);
    }

    updateProduct(id: string, product: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, product);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    uploadImage(file: File): Observable<{ data: { url: string }; msg: string }> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<{ data: { url: string }; msg: string }>(`${this.apiUrl}/upload`, formData);
    }
}
