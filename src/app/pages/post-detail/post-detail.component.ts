import { ChangeDetectionStrategy, Component, inject, signal, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Post } from '../../types';

declare const marked: any;

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  transform(value: string): string {
    if (typeof marked !== 'undefined' && value) {
      return marked.parse(value);
    }
    return value || '';
  }
}

@Component({
  selector: 'app-post-detail',
  imports: [RouterLink, SafeHtmlPipe],
  template: `
    <div class="max-w-6xl mx-auto">
      @if (loading()) {
        <!-- Skeleton Loader -->
        <div class="animate-pulse bg-gray-800 bg-opacity-70 rounded-lg shadow-xl overflow-hidden">
          <div class="bg-gray-700 h-96 w-full"></div>
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-1/4 p-8 border-b-2 md:border-b-0 md:border-r-2 border-gray-700">
                <div class="bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
                <div class="bg-gray-700 h-4 w-1/2 rounded mb-6"></div>
                <div class="bg-gray-700 h-6 w-3/4 rounded mb-2"></div>
                <div class="bg-gray-700 h-4 w-1/2 rounded"></div>
            </div>
            <div class="w-full md:w-3/4 p-8 md:p-12">
              <div class="bg-gray-700 h-12 w-full rounded mb-6"></div>
              <div class="space-y-4">
                <div class="h-4 bg-gray-700 rounded"></div>
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-4 bg-gray-700 rounded col-span-2"></div>
                  <div class="h-4 bg-gray-700 rounded col-span-1"></div>
                </div>
                <div class="h-4 bg-gray-700 rounded"></div>
                 <div class="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      } @else if (error()) {
        <p class="text-center p-8 text-red-500">{{ error() }}</p>
      } @else if (post(); as p) {
        <div class="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl overflow-hidden">
          <img class="w-full h-96 object-cover" [src]="p.image_url" [alt]="p.title">
          <div class="flex flex-col md:flex-row">
            <!-- Sidebar -->
            <aside class="w-full md:w-1/4 p-8 border-b-2 md:border-b-0 md:border-r-2 border-gray-700">
              <div class="sticky top-20">
                <h3 class="font-bold text-white text-lg">Escrito por</h3>
                <p class="text-gray-400 break-words">{{ p.author_email }}</p>
                <h3 class="font-bold text-white text-lg mt-4">Publicado</h3>
                <p class="text-gray-400">{{ formatDate(p.created_at) }}</p>
                <a [routerLink]="['/']" class="inline-block mt-8 text-blue-400 hover:text-blue-300 font-semibold">&larr; Volver a Noticias</a>
              </div>
            </aside>
            <!-- Main Content -->
            <main class="w-full md:w-3/4 p-8 md:p-12">
              <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-4">{{ p.title }}</h1>
              <div class="prose prose-invert prose-lg max-w-none" [innerHTML]="p.content | safeHtml"></div>
            </main>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .prose {
      line-height: 1.75;
    }
    .prose a {
      color: #60a5fa; /* text-blue-400 */
      text-decoration: underline;
    }
    .prose a:hover {
      color: #93c5fd; /* text-blue-300 */
    }
    .prose code {
      background-color: #1f2937; /* bg-gray-800 */
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
    }
    .prose code::before, .prose code::after {
      content: '';
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supabase = inject(SupabaseService);
  
  post = signal<Post | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loading.set(true);
      this.error.set(null);
      const { data, error } = await this.supabase.getPostById(postId);
      if (error) {
        this.error.set('No se pudo encontrar el post.');
        console.error(error);
      } else {
        this.post.set(data);
      }
      this.loading.set(false);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
