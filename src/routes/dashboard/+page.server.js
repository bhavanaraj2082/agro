
import { API_URL } from "$env/static/private";
import { PUBLIC_WEBSITE_NAME } from "$env/static/public";
import { updateProfile, addOrUpdateAddress, deleteAddress} from "$lib/server/mongoActions.js";


import Profile from "$lib/server/models/Profile.js";
export const load = async ({ locals }) => {
    if (!locals.user) {
        return null;
    }
    const authedUser = { id: locals.user.userId };
    const userProfile = await Profile.findOne({ userId: authedUser.id });

    if (!userProfile) {
        return null;
    }
    return JSON.parse(JSON.stringify({ profile: userProfile }));
};


export const actions = {
  updateProfile: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const userId = locals.authedUser.id;
      
      const data = {
        userId,
        fullName: formData.get('fullName'),
        companyName: formData.get('companyName'),
        mobileNr: formData.get('mobileNr'),
        email: formData.get('email'),
        alternateNr: formData.get('alternateNr'),
        companyType: formData.get('companyType'),
        companyUrl: formData.get('companyUrl'),
        country:formData.get('country')
      };
      
      return await updateProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: "Something went wrong while updating profile" };
    }
  },

  addAddress: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const userId = locals.authedUser.id;
      
      const addressType = formData.get('addressType');
      
      const addressData = {
        userId,
        fullName: formData.get('fullName'),
        companyName: formData.get('companyName'),
        mobileNr: formData.get('mobileNr'),
        country: formData.get('country'),
        addressLine1: formData.get('addressLine1'),
        addressLine2: formData.get('addressLine2'),
        pinCode: formData.get('pinCode'),
        city: formData.get('city'),
        district: formData.get('district'),
        state: formData.get('state'),
        companyWebUrl: formData.get('companyWebUrl'),
        addressType
      };
      
      return await addOrUpdateAddress(addressData);
    } catch (error) {
      console.error('Error adding address:', error);
      return { success: false, message: "Something went wrong while adding address" };
    }
  },

  updateAddress: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const userId = locals.authedUser.id;
      
      const addressId = formData.get('addressId');
      const addressType = formData.get('addressType');
      
      const addressData = {
        userId,
        addressId,
        fullName: formData.get('fullName'),
        companyName: formData.get('companyName'),
        mobileNr: formData.get('mobileNr'),
        country: formData.get('country'),
        addressLine1: formData.get('addressLine1'),
        addressLine2: formData.get('addressLine2'),
        pinCode: formData.get('pinCode'),
        city: formData.get('city'),
        district: formData.get('district'),
        state: formData.get('state'),
        companyWebUrl: formData.get('companyWebUrl'),
        addressType
      };
      
      return await addOrUpdateAddress(addressData);
    } catch (error) {
      console.error('Error updating address:', error);
      return { success: false, message: "Something went wrong while updating address" };
    }
  },

  deleteAddress: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const userId = locals.authedUser.id;
      const addressId = formData.get('addressId');
      
      return await deleteAddress({ userId, addressId });
    } catch (error) {
      console.error('Error deleting address:', error);
      return { success: false, message: "Something went wrong while deleting address" };
    }
  }
};



