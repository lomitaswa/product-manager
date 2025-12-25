import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthService, User, AuthResponse } from '../services/auth.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthState {
    data: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    data: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(() => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (userStr && token) {
            const user = JSON.parse(userStr);
            return { ...initialState, data: user, isAuthenticated: true };
        }
        return initialState;
    }),
    withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
        login: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap((credentials) =>
                    authService.login(credentials).pipe(
                        tap((response) => {
                            patchState(store, {
                                data: response.data.user,
                                isLoading: false,
                                isAuthenticated: true,
                            });
                            router.navigate(['/products']);
                        }),
                        catchError((err) => {
                            patchState(store, {
                                isLoading: false,
                                error: err.error?.error || 'Login failed',
                            });
                            return of(err);
                        })
                    )
                )
            )
        ),
        signup: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap((userData) =>
                    authService.register(userData).pipe(
                        tap((response) => {
                            patchState(store, {
                                data: response.data.user,
                                isLoading: false,
                                isAuthenticated: true,
                            });
                            router.navigate(['/login']);
                        }),
                        catchError((err) => {
                            patchState(store, {
                                isLoading: false,
                                error: err.error?.error || 'Signup failed',
                            });
                            return of(err);
                        })
                    )
                )
            )
        ),
        logout() {
            authService.logout();
            patchState(store, { ...initialState });
            router.navigate(['/auth/login']);
        },
        clearError() {
            patchState(store, { error: null });
        }
    }))
);
