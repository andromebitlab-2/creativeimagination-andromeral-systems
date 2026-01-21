import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="bg-black bg-opacity-50 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <a [routerLink]="['/']" class="flex-shrink-0 flex items-center space-x-2 text-white font-bold text-xl">
              <img class="h-10 w-10" [src]="logo" alt="Andromeral Systems Logo">
              <span>Andromeral Systems</span>
            </a>
          </div>
          <div class="flex items-center space-x-4">
            <a [routerLink]="['/']" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Inicio</a>
            @if (supabase.session()) {
              <a [routerLink]="['/create']" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Crear Post</a>
            }
          </div>
          <div class="flex items-center">
            @if (supabase.session(); as session) {
              <div class="flex items-center space-x-4">
                <span class="text-gray-300 text-sm">{{ session.user.email }}</span>
                <button (click)="handleLogout()" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                  Salir
                </button>
              </div>
            } @else {
               <a [routerLink]="['/login']" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                  Login
                </a>
            }
          </div>
        </div>
      </nav>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  supabase = inject(SupabaseService);
  // FIX: Added explicit type for router to resolve 'unknown' type error.
  private readonly router: Router = inject(Router);

  logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQKADAAQAAAABAAAAQAAAAABGUUKwAAADhElEQVR4Ae2bS2sUQRhAf+gq6qIIgoKK4EHxZtQLEQRMEC8iiG6i6MGL6EVEUNF9A95781EETy568CIQdBEFNyKi4EJRBK8V3W6aprtnq6Z7pnuECh/qup6+flVXV1dXVwc8YhGPYRGPX3iMV3is7iPwB97ijr/+BR6s7iMwA95Kgrt8h/diV2A8T4t4XvP8kEaxZt8/2F5oWkSBc+P8Qj/hYbxF4o/ECwS+Rk4Q+A1xLgFpQGAHhAtE/kocI/Al4jwC0oDAGwgXiPxJ/DMCPyHeIyANCGwA8IFIn8i/hkBPyHeIyANCGwA8IFIn8i/hkBPyHeIyANCGwA8IFIn8i/hkBPyHeIyANCGwA8IFIn8ifhOAy9gD5P4bM8q1A5BfR2d38F1gC/t4Dq+2+3kCSM3+sU9p3d/wD3AcO03W+3+wA2c3+sE9p3d9xDXgfO03W+3+wA3c3+sE9p3d9xDXgfO03W+3+QA3W3+sE9p3d9xDXgfO03W+3+QA3W3+sE9p3d9xDXgfO03W+3+QA3W3+sE9p3d9xDXgfO03W+3+QA3W3+sE9p3d9xDXgfO03W+3+QA3W3+sE9p3d9xDXgfaZqgJb1m261gY0uF8k4hC3+P096y/d6gO8iG+03+o/d6sK8CDe03+rD/Y9WwEeoC7o+0zVAQ7iL91rA25xG/9x67/d6gN8g/fYb/Wfu9WF+Bjv6b/VB/se7YCH8Brd0n6rDxDwC99y67/d6gM8gLfYb/Wf2Y+X4E+8pv9WH+x7tgKcw2t0S/utOkA+xS/c+q/3eoA/8RbfsX7r/9yNbMEP+B7vtP5Y+7Fr2AnwFm6i/VZvIMDv3Hqu93qAH/AB+2P91v/Zj5fgC3xD/60+2PdshSdwCW6i/VZvIMCX3Pqu93qAL/B77I/1W/+xG9mCX/Ae7bT+WPuya9gJ8B1upv5WbyDAF9z6rvd6gC/wE/bH+q3/sR/Zgi/wDevp/bH2Y9ewE+Az3EP9rT5AgN+49V3v9QAP4Dfsj/Vb//Fr2II/8A3raf2x9mPXsBPgM9xD/a0+QIDfuPVd7/UAD+A37I/1W//xa9iCP/AN62n9sfZj17AT4DPcQ/2tPkCA37j1Xe/1AA/gN+yP9Vv/8WvYgj/wDetp/bH2Y9ewE/y4+9/w3/8HnL/zR3gN9vG7zI8L+Pz/g0/+h3e4+O+f+fG5wD4vM+P/QHP6S71K6zHGyw0k8sLzT6x/CKx/CKxzL6w/CKw/CKwzL6w/CKw/CKwzL6w/CKw/CKwzL6w/CKw/CKwzL6w/CKw/CKwzL6w/CKw/CKwzL6w/CKw/CKwzL6w/CKw/CKwzL7wL/AN1a1La/bWUjUAAAAASUVORK5CYII=';

  async handleLogout() {
    try {
      await this.supabase.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
