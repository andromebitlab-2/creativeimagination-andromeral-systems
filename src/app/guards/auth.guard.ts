import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = () => {
  const supabaseService = inject(SupabaseService);
  // FIX: Added explicit type for router to resolve 'unknown' type error.
  const router: Router = inject(Router);

  if (supabaseService.session()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
