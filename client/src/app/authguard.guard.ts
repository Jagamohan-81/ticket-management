import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const authguardGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem('token') || false;
  const router = inject(Router);
  if (token) {
    return true;
  } else {
    // router.navigate(['/login']);
    return false;
  }
};
