export {};

if (location.pathname.startsWith('/admin')) {
  await import('./admin');
} else {
  await import('./main');
  await import('./public-login-link');
}
