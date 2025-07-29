
// import { getSearchData } from '$lib/server/mongoLoads.js'
// import { saveMailId } from '$lib/server/mongoActions.js';
// import Profile from '$lib/server/models/Profile.js';
// export const load = async ({ url, locals }) => {
// 	try {
// 		const search = url.searchParams.get('query');

// 		const result = await getSearchData(search);
// 		const userId = locals?.authedUser?.id;

// 		if (userId) {
// 			try {
// 				// console.log('userId:', userId);
// 				const userProfile = await Profile.findOne({ userId });

// 				if (userProfile) {
// 					return {
// 						result,
// 						userProfile: {
// 							firstname: userProfile.firstname,
// 							email: userProfile.email,

// 							userId: userProfile.userId,
// 						}
// 					};
// 				} else {
// 					console.log('No profile found for userId:', userId);
// 				}
// 			} catch (profileError) {
// 				console.error('Error fetching user profile:', profileError);
// 			}
// 		} else {
// 			console.log('No userId found in locals, skipping profile fetch.');
// 		}
// 		return { result };
// 	} catch (error) {
// 		console.error('Error in load function:', error);
// 		return {
// 			message: error.response?.message || 'An error occurred while processing your request',
// 			status: error.response?.status || 500
// 		};
// 	}
// };


// export const actions = {
// 	// noresults:async({request})=>{
// 	// 	const body = Object.fromEntries(await request.formData());
// 	// 	console.log(body,"***********************");

// 	// 	const result = await saveMailId(body);
// 	// 	return  result ;
// 	// },
// 	noresults: async ({ request }) => {
// 		const body = Object.fromEntries(await request.formData());
// 		// console.log(body, "***********************");

// 		const userEmail = body.email;
// 		const query = body.query;
	




// 		const result = await saveMailId(body);
// 		return result;
// 	},

// }
