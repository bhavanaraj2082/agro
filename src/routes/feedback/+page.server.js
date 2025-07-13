import { submitFeedback } from "$lib/server/mongoActions.js";
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '../../lib/server/models/TokenVerification';
import { verifyemailOtp, sendemailOtp } from '$lib/server/mongoActions.js';
// import { sanitizeFormData } from '$lib/utils/sanitize.js';
export const actions = {
  feedbacks: async ({ request }) => {
    try {
      // const rawData = await request.formData();
      // const formData = sanitizeFormData(rawData);

      const formData = await request.formData();
      console.log(formData,"formData");
      
      const body = {};
      for (const [key, value] of formData.entries()) {
        if (key === 'issue') {
          if (!body[key]) {
            body[key] = [value];
          }
          else if (Array.isArray(body[key])) {
            body[key].push(value);
          }
        } else {
          body[key] = value;
        }
      }
      await submitFeedback(body);
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



};


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
	// console.log(userProfile, "userProfile");
  
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
