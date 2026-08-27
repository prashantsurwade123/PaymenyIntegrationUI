/** Public-site return path for the mock admin session. */
document.addEventListener('click', event => {
  const target = event.target as HTMLElement | null;
  const logout = target?.closest('button');
  if (!logout || logout.textContent?.trim() !== 'Logout') return;
  event.preventDefault();
  event.stopPropagation();
  sessionStorage.removeItem('sanstha_admin');
  location.assign('/');
}, true);
