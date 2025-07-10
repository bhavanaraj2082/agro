import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const guestList = ['Guest', 'guest'];

	if (
		!locals.authedUser ||
		!locals.authedUser.email ||
		locals.authedUser.email === 'guest@partskeys.com'
	) {
		throw redirect(307, '/signin');
	}

	return;
}
