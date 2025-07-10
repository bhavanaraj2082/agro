import { submitContactInfo } from "$lib/server/mongoActions.js";

import Profile from '$lib/server/models/Profile.js';

export const actions = {

  contactus: async ({ request }, event) => {
    try {
      const body = Object.fromEntries(await request.formData());
      // console.log("body", body);
      await submitContactInfo(body);
     
      return {
        type: "success",
        data: {
          message: "Contact details submitted successfully!",
        },
      };
    } catch (error) {
      console.error("Error creating contact:", error);
      return {
        type: "error",
        data: {
          error: "Error submitting your data. Please try again later!",
        },
      };
    }
  },
}




export const load = async ({ locals }) => {
  // Check if there's an authenticated user
  if (!locals.user) {
    console.log('No authenticated user found');
    return null;
  }

  // Create authedUser object with userId
  const authedUser = { id: locals.user.userId };
  console.log(authedUser, "authedUser");

  // Fetch the user profile from the database
  const userProfile = await Profile.findOne({ userId: authedUser.id });
  console.log(userProfile, "userProfile");

  // If no profile is found, return null
  if (!userProfile) {
    console.log('User profile not found');
    return null;
  }

  // Final result to return
  const finalResult = JSON.parse(JSON.stringify({ profile: userProfile }));
  console.log(finalResult, "finalResult");

  return finalResult;
};