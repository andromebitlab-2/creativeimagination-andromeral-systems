import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Post } from '../../types';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="space-y-12">
      <h1 class="text-4xl font-bold text-center tracking-tight text-white sm:text-5xl md:text-6xl">Últimas Noticias</h1>
      
      @if (loading()) {
        <!-- Skeleton Loader -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          @for (_ of [1,2,3]; track $index) {
            <div class="bg-gray-800 bg-opacity-60 rounded-lg overflow-hidden shadow-lg animate-pulse">
              <div class="bg-gray-700 h-48 w-full"></div>
              <div class="p-6 space-y-4">
                <div class="bg-gray-700 h-8 w-3/4 rounded"></div>
                <div class="bg-gray-700 h-4 w-1/2 rounded"></div>
                <div class="space-y-2">
                  <div class="bg-gray-700 h-4 rounded"></div>
                  <div class="bg-gray-700 h-4 w-5/6 rounded"></div>
                </div>
                <div class="bg-gray-700 h-5 w-1/4 rounded mt-2"></div>
              </div>
            </div>
          }
        </div>
      } @else if (error()) {
        <p class="text-center text-red-500">{{ error() }}</p>
      } @else if (posts().length > 0) {
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          @for (post of posts(); track post.id) {
            <div [routerLink]="['/post', post.id]" class="group flex flex-col h-full cursor-pointer bg-gray-800 bg-opacity-60 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="relative">
                <img class="w-full h-48 object-cover" [src]="post.image_url" [alt]="post.title">
                <div class="absolute top-0 left-0 bg-black bg-opacity-50 px-3 py-1 mt-4 ml-4 rounded">
                  <span class="text-white font-bold text-sm tracking-wider uppercase">Noticias</span>
                </div>
              </div>
              <div class="p-6 flex flex-col flex-grow">
                 <div class="flex-grow">
                    <h2 class="text-2xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">{{ post.title }}</h2>
                    <p class="text-gray-400 text-sm mb-4">{{ formatDate(post.created_at) }}</p>
                    <p class="text-gray-300 leading-relaxed h-20 overflow-hidden">{{ post.content }}</p>
                 </div>
                 <a [routerLink]="['/post', post.id]" class="inline-block mt-4 text-blue-400 hover:text-blue-300 font-semibold self-start">Leer más...</a>
              </div>
            </div>
          }
        </div>
      } @else {
        <p class="text-center text-gray-400">No hay posts todavía. ¡Vuelve pronto!</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private supabase = inject(SupabaseService);
  
  posts = signal<Post[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    this.loading.set(true);
    this.error.set(null);
    const { data, error } = await this.supabase.getPosts();
    if (error) {
      this.error.set('No se pudieron cargar las noticias. Inténtalo de nuevo más tarde.');
      console.error(error);
    } else {
      this.posts.set(data || []);
    }
    this.loading.set(false);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}