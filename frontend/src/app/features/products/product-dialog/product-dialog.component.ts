import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService, Category } from '../../../core/services/category.service';
import { Product, ProductService } from '../../../core/services/product.service';

@Component({
    selector: 'app-product-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule
    ],
    templateUrl: './product-dialog.component.html',
    styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {
    productForm: FormGroup;
    categories: Category[] = [];
    isEdit: boolean;
    selectedFile: File | null = null;
    isUploading = false;

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private productService: ProductService,
        public dialogRef: MatDialogRef<ProductDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { product?: Product }
    ) {
        this.isEdit = !!data?.product;
        this.productForm = this.fb.group({
            name: [data?.product?.name || '', [Validators.required, Validators.maxLength(255)]],
            price: [data?.product?.price || '', [Validators.required, Validators.min(0)]],
            category_id: [data?.product?.category_id || '', [Validators.required]],
            image_url: [data?.product?.image_url || '']
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe(res => {
            this.categories = res.data;
        });
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.uploadImage(file);
        }
    }

    uploadImage(file: File): void {
        this.isUploading = true;
        this.productService.uploadImage(file).subscribe({
            next: (res) => {
                this.productForm.patchValue({ image_url: res.data.url });
                this.isUploading = false;
            },
            error: () => {
                this.isUploading = false;
                alert('Upload failed');
            }
        });
    }

    onSubmit(): void {
        if (this.productForm.valid) {
            this.dialogRef.close(this.productForm.value);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
