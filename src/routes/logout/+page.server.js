import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies }) {
  try {
    let sessionIdToInvalidate = null;

    if (locals.authedUser) {
      sessionIdToInvalidate = locals.session?.sessionId;

      if (sessionIdToInvalidate) {
        await auth.invalidateSession(sessionIdToInvalidate);
        const authCookies = cookies.getAll();
        for (const cookie of authCookies) {
          if (cookie.name.startsWith('auth_')) {
            cookies.delete(cookie.name, { path: '/' });
          }
        }

        cookies.delete('auth_session', { path: '/' });
      }
    }

    locals.authedUser = undefined;
    locals.session = undefined;

    console.log('Redirecting to login page');
    // Redirect to signin with reload parameter
    throw redirect(302, '/signin?reload=true');
  } catch (err) {
    if (err.status === 302) {
      throw err;
    }
    throw redirect(302, '/signin');
  }
}
