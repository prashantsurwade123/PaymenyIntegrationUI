export {};

const developmentAdmin = { email: 'Prashant', password: 'admin' };
let restoreModal: (() => void) | null = null;
const closeModal = () => { restoreModal?.(); restoreModal = null; document.querySelector('.admin-login-modal')?.remove(); };
export const openAdminLogin = () => {
  if (document.querySelector('.admin-login-modal')) return;
  const modal = document.createElement('div');
  modal.className = 'admin-login-modal';
  modal.innerHTML = `<div class="admin-modal-backdrop"></div><section class="admin-modal-card" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"><button class="admin-modal-close" type="button" aria-label="Close login">×</button><div class="admin-modal-mark">छ</div><p class="admin-modal-eyebrow">Shivaji Maharaj Sanstha</p><h2 id="admin-modal-title">Admin Login</h2><p class="admin-modal-subtitle">Secure administration access</p><form class="admin-modal-form"><label>Username<input name="email" type="text" autocomplete="username" placeholder="Enter your username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required></label><p class="admin-modal-error" aria-live="polite"></p><button type="submit">Sign in securely <span>→</span></button></form><p class="admin-modal-note">Development access only. Production authentication is verified by the backend.</p></section>`;
  document.body.append(modal);
  const previousFocus = document.activeElement as HTMLElement | null;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
    if (event.key === 'Tab') {
      const controls = Array.from(modal.querySelectorAll<HTMLElement>('button, input, a[href]'));
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };
  document.addEventListener('keydown', handleKey);
  restoreModal = () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  const email = modal.querySelector<HTMLInputElement>('[name=email]')!;
  const password = modal.querySelector<HTMLInputElement>('[name=password]')!;
  const error = modal.querySelector('.admin-modal-error')!;
  modal.querySelector('.admin-modal-close')?.addEventListener('click', closeModal);
  modal.querySelector('.admin-modal-backdrop')?.addEventListener('click', closeModal);
  modal.querySelector<HTMLFormElement>('form')!.addEventListener('submit', event => {
    event.preventDefault();
    if (email.value === developmentAdmin.email && password.value === developmentAdmin.password) {
      sessionStorage.setItem('sanstha_admin', JSON.stringify({ name: 'Admin', email: email.value, role: 'SUPER_ADMIN' }));
      location.assign('/admin/dashboard');
    } else error.textContent = 'Please check your administrator email and password.';
  });
  email.focus();
};
