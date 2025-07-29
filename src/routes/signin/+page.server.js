
import { fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia.js";
import { LuciaError } from "lucia";
import { authErrorMessages } from "$lib/server/lucia.js";
import Profile from "$lib/server/models/Profile.js";
export const actions = {
  login: async ({ request, cookies }) => {
  	const redirectUrls =
  		cookies.get('redirectUrl') || "/dashboard";
  	const formData = Object.fromEntries(await request.formData());
  	// console.log('formData', formData);

  	if (!formData.email) {
  	  return fail(400, {
  		success: false,
  		errorMsg: "Please provide your registered email address",
  	  });
  	}

  	if (!formData.password) {
  	  return fail(400, {
  		success: false,
  		errorMsg: "Please provide the password.",
  	  });
  	}

  	const { email, password } = formData;

  	try {
  	  const key = await auth.useKey("email", email, password);
  	  const user = await auth.getUser(key.userId);
  	  const session = await auth.createSession({
  		userId: user.userId,
  		attributes: {},
  	  });
  	  const sessionCookie = auth.createSessionCookie(session);
  	  cookies.set(
  		sessionCookie.name,
  		sessionCookie.value,
  		sessionCookie.attributes
  	  );
  	} catch (error) {
  	  if (error instanceof LuciaError) {
  		const errorMessage =
  		  authErrorMessages[error.message] || "An unknown error occurred.";
  		console.error(errorMessage);
  		return fail(400, { success: false, errorMsg: errorMessage });
  	  } else {
  		console.error("An unexpected error occurred:", error);
  		return fail(400, {
  		  success: false,
  		  errorMsg: "An unexpected error occurred:",
  		  error,
  		});
  	  }
  	}
  	// const redirectTo = "/dashboard";
  	throw redirect(302, redirectUrls);
  },
};