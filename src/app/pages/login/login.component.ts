import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="flex items-center justify-center">
      <div class="max-w-md w-full bg-gray-800 bg-opacity-80 rounded-lg shadow-xl p-8 space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
            Iniciar sesión
          </h2>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="handleLogin()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Email</label>
              <input formControlName="email" id="email-address" name="email" type="email" autocomplete="email" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm rounded-t-md"
                placeholder="Email">
            </div>
            <div>
              <label for="password" class="sr-only">Contraseña</label>
              <input formControlName="password" id="password" name="password" type="password" autocomplete="current-password" required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm rounded-b-md"
                placeholder="Contraseña">
            </div>
          </div>

          @if (errorMessage()) {
            <p class="text-red-500 text-sm text-center">{{ errorMessage() }}</p>
          }

          <div>
            <button type="submit" [disabled]="loginForm.invalid || loading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50">
              {{ loading() ? 'Iniciando...' : 'Iniciar sesión' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // FIX: Added explicit type for FormBuilder to resolve 'unknown' type error.
  private fb: FormBuilder = inject(FormBuilder);
  // FIX: Added explicit type for Router to resolve 'unknown' type error.
  private router: Router = inject(Router);
  private supabase = inject(SupabaseService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async handleLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const { error } = await this.supabase.signIn(this.loginForm.value);
      if (error) {
        this.errorMessage.set(error.message);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Ocurrió un error inesperado.');
    } finally {
      this.loading.set(false);
    }
  }
}
