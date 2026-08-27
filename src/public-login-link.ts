export {};

const developmentAdmin = { email: 'Prashant', password: 'admin' };
const closeModal = () => document.querySelector('.admin-login-modal')?.remove();
const openModal = () => {
  if (document.querySelector('.admin-login-modal')) return;
  const modal = document.createElement('div');
  modal.className = 'admin-login-modal';
  modal.innerHTML = `<div class="admin-modal-backdrop"></div><section class="admin-modal-card" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title"><button class="admin-modal-close" type="button" aria-label="Close login">×</button><div class="admin-modal-mark">छ</div><p class="admin-modal-eyebrow">Shivaji Maharaj Sanstha</p><h2 id="admin-modal-title">Admin Login</h2><p class="admin-modal-subtitle">Secure administration access</p><form class="admin-modal-form"><label>Username<input name="email" type="text" autocomplete="username" placeholder="Enter your username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required></label><p class="admin-modal-error" aria-live="polite"></p><button type="submit">Sign in securely <span>→</span></button></form><p class="admin-modal-note">Development access only. Production authentication is verified by the backend.</p></section>`;
  document.body.append(modal);
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
const addAdminLink = () => {
  if (document.querySelector('.admin-login-link')) return true;
  const actions = document.querySelector('header .header-actions');
  if (!actions) return false;
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'admin-login-link'; button.textContent = 'Admin Login';
  button.setAttribute('aria-label', 'Open Admin Portal login'); button.addEventListener('click', openModal); actions.prepend(button);
  return true;
};
if (!addAdminLink()) { const observer = new MutationObserver(() => { if (addAdminLink()) observer.disconnect(); }); observer.observe(document.body, { childList: true, subtree: true }); }
