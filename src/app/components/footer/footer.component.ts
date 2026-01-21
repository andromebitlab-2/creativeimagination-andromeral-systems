import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-black bg-opacity-30 mt-auto">
      <div class="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {{ currentYear }} Andromeral Systems. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}