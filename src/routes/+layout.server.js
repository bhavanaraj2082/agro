import { redirect } from '@sveltejs/kit';
import Profile from '$lib/server/models/Profile.js';

export const load = async ({ url, cookies, locals, depends }) => {
  try {
    // Handle logout functionality
    if (url.pathname === '/logout') {
      cookies.delete('token', { path: '/' });
      redirect(302, '/signin');
    }

    depends("data:load");

    // Check if user exists in locals
    if (!locals.user) {
      return {
        authedUser: null,
        error: 'Not authenticated',
      };
    }

    // Get user data from locals
    const authedUser = { id: locals.user.userId };
    const userProfile = await Profile.findOne({ userId: authedUser.id });

    console.log(userProfile, "userProfile");

    if (!userProfile) {
      return {
        authedUser: null,
        error: 'Profile not found',
      };
    }

    // Return the profile data
    const finalResult = JSON.parse(JSON.stringify({ profile: userProfile }));

    return {
      authedUser: {
        id: authedUser.id,
        firstname: userProfile.firstName || '',
        email : userProfile.email || '',
        phone: userProfile.cellPhone || '',
      },
      profile: finalResult.profile,
    };

  } catch (error) {
    console.error('Load function error:', error);
    return {
      authedUser: null,
      error: 'Failed to load data',
    };
  }
};