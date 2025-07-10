import { passwordVerificationToken, userUpdatePassword } from '$lib/server/mongoActions.js';

export const actions = {
	resetrequestStep1: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());
		try {
			if (!body.email) {
				return {
					success: false,
					message: 'Please provide your registered email address'
				};
			}
			// const response = await resetpassmail(locals.pb, body); 
			return await passwordVerificationToken(body, 'Password');
			// return response;
		} catch (error) {
			console.log(error);
			return {
				success: false,
				message: 'Verification email could not be sent. Double-check your email address'
			};
		}
	}
};