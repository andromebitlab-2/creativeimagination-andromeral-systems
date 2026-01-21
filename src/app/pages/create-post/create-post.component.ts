import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-create-post',
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="bg-gray-800 bg-opacity-80 rounded-lg shadow-xl p-8 space-y-8">
        <div>
          <h2 class="text-center text-3xl font-extrabold text-white">
            Crear Nuevo Post
          </h2>
        </div>
        <form class="space-y-6" [formGroup]="postForm" (ngSubmit)="handleCreatePost()">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-300">Título</label>
            <input formControlName="title" id="title" name="title" type="text" required
              class="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label for="image_url" class="block text-sm font-medium text-gray-300">URL de la Imagen</label>
            <input formControlName="image_url" id="image_url" name="image_url" type="url" required
              class="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label for="content" class="block text-sm font-medium text-gray-300">Contenido</label>
            <textarea formControlName="content" id="content" name="content" rows="10" required
              class="mt-1 block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            <p class="mt-2 text-xs text-gray-400">Puedes usar Markdown para dar formato al texto.</p>
          </div>
          
          @if (errorMessage()) {
            <p class="text-red-500 text-sm text-center">{{ errorMessage() }}</p>
          }

          <div class="flex justify-end space-x-4">
             <a [routerLink]="['/']" class="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900">
                Cancelar
              </a>
            <button type="submit" [disabled]="postForm.invalid || loading()"
              class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50">
              {{ loading() ? 'Publicando...' : 'Publicar Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private supabase = inject(SupabaseService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  postForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    image_url: ['', [Validators.required, Validators.pattern('https?://.+')]],
  });

  async handleCreatePost() {
    if (this.postForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const { error } = await this.supabase.createPost(this.postForm.value as any);
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