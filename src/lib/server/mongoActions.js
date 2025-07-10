import Contact from '$lib/server/models/Contact.js';
import Profile from '$lib/server/models/Profile.js';
import TokenVerification from '$lib/server/models/TokenVerification.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import  User from '$lib/server/models/User.js'
import { nanoid } from 'nanoid';
import Feedback from '$lib/server/models/Feedback.js'
import SearchQueries from '$lib/server/models/SearchQueries.js';
import { auth } from '$lib/server/lucia.js';
import Product from '$lib/server/models/Product.js';
import Cart from '$lib/server/models/Cart.js';
import Category from "$lib/server/models/Category.js";
import SubCategory from "$lib/server/models/Subcategory.js";
import { redirect, error } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import {
	APP_URL,
	SENDER_EMAIL,
	SENDER_PASSWORD,
	WEBSITE_NAME,
	MAIL_HOST
} from '$env/static/private';
import { PUBLIC_WEBSITE_NAME } from '$env/static/public'; 
export const submitFeedback = async (data) => {
	try {
	  const newFeedback = new Feedback(data); // Use the Feedback model here
	  const savedFeedback = await newFeedback.save();
	  console.log("savedFeedback",savedFeedback);
	  
	  return savedFeedback;
	} catch (error) {
	//   console.error('Error saving feedback:', error);
	  throw new Error('Failed to save feedback information');
	}
  };
export const submitContactInfo = async (data) => {
	try {
		const newContact = new Contact(data); // Create a new instance of the ContactUS model
		const savedContact = await newContact.save(); // Save the document to the database
		return savedContact; // Return the saved document
	} catch (error) {
		console.error('Error saving contact info:', error);
		throw new Error('Failed to save contact information');
	}
};





export const signUp = async (body, cookies) => {
  try {
    console.log("=== SIGNUP PROCESS STARTED ===");
    console.log("Request body:", JSON.stringify(body, null, 2));
    console.log("Cookies object:", cookies);

    // Step 1: Check for existing user by email
    console.log("Step 1: Checking for existing user by email...");
    let existingUser = null;
    try {
      existingUser = await auth.getKey("email", body.email);
      console.log("Existing user found:", existingUser);
    } catch (error) {
      console.log("No existing user found by email (expected):", error.message);
      existingUser = null;
    }

    // Step 2: Check for existing username
    console.log("Step 2: Checking for existing username...");
    let existingUsernameKey = null;
    try {
      existingUsernameKey = await auth.getKey('username', body.username);
      console.log("Existing username found:", existingUsernameKey);
    } catch (error) {
      console.log("No existing username found (expected):", error.message);
      existingUsernameKey = null;
    }

    console.log("existingUser:", existingUser);
    console.log("existingUsernameKey:", existingUsernameKey);

    // Step 3: Validate uniqueness
    if (existingUser) {
      console.log("ERROR: Email already exists");
      return {
        success: false,
        message: "This email already exists. Please login or try with another.",
      };
    }

    if (existingUsernameKey) {
      console.log("ERROR: Username already exists");
      return {
        success: false,
        message: "This username already exists. Please login or try with another.",
      };
    }

    // Step 4: Create Lucia user
    console.log("Step 4: Creating Lucia user...");
    let luciaUser = null;
    try {
      luciaUser = await auth.createUser({
        key: {
          providerId: "email",
          providerUserId: body.email,
          password: body.password,
        },
        attributes: {
          username: body.firstName,
          email: body.email,
        },
      });
      console.log("Lucia user created successfully:", JSON.stringify(luciaUser, null, 2));
    } catch (error) {
      console.error("ERROR creating Lucia user:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    // Step 5: Create user profile
    console.log("Step 5: Creating user profile...");
    let savedProfile = null;
    try {
      const newProfile = new Profile({
        userId: luciaUser.userId,
        firstName: body.firstName,
        lastName: body.lastName,
        cellPhone: body.phone,
        email: body.email,
        isPhoneVerified: body.isPhoneVerified,
        isEmailVerified: body.isEmailVerified,
        country: body.country,
        currency: body.currency,
      });
      console.log("Profile object created:", JSON.stringify(newProfile, null, 2));
      
      savedProfile = JSON.parse(JSON.stringify(await newProfile.save()));
      console.log("Profile saved successfully:", JSON.stringify(savedProfile, null, 2));
    } catch (error) {
      console.error("ERROR creating/saving profile:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    // Step 6: Subscribe user - REMOVED as requested

    // Step 7: Create empty cart
    console.log("Step 7: Creating empty cart...");
    try {
      const cart = new Cart({
        cartItems: [],
        userId: luciaUser.userId,
        userEmail: body.email
      });
      console.log("Cart object created:", JSON.stringify(cart, null, 2));
      
      await cart.save();
      console.log("Cart saved successfully");
    } catch (error) {
      console.error("ERROR creating/saving cart:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to create cart: ${error.message}`);
    }

    // Step 8: Use key for authentication
    console.log("Step 8: Using key for authentication...");
    let key = null;
    try {
      key = await auth.useKey("email", body.email, body.password);
      console.log("Key retrieved successfully:", JSON.stringify(key, null, 2));
    } catch (error) {
      console.error("ERROR using key:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to use key: ${error.message}`);
    }

    // Step 9: Get user
    console.log("Step 9: Getting user...");
    let user = null;
    try {
      user = await auth.getUser(key.userId);
      console.log("User retrieved successfully:", JSON.stringify(user, null, 2));
    } catch (error) {
      console.error("ERROR getting user:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to get user: ${error.message}`);
    }

    // Step 10: Create session
    console.log("Step 10: Creating session...");
    let session = null;
    try {
      session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      console.log("Session created successfully:", JSON.stringify(session, null, 2));
    } catch (error) {
      console.error("ERROR creating session:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to create session: ${error.message}`);
    }

    // Step 11: Create session cookie
    console.log("Step 11: Creating session cookie...");
    let sessionCookie = null;
    try {
      sessionCookie = auth.createSessionCookie(session);
      console.log("Session cookie created successfully:", JSON.stringify(sessionCookie, null, 2));
    } catch (error) {
      console.error("ERROR creating session cookie:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to create session cookie: ${error.message}`);
    }

    // Step 12: Set cookie
    console.log("Step 12: Setting cookie...");
    try {
      cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      console.log("Cookie set successfully");
      console.log("Cookie name:", sessionCookie.name);
      console.log("Cookie value:", sessionCookie.value);
      console.log("Cookie attributes:", JSON.stringify(sessionCookie.attributes, null, 2));
    } catch (error) {
      console.error("ERROR setting cookie:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to set cookie: ${error.message}`);
    }

    console.log("=== SIGNUP PROCESS COMPLETED SUCCESSFULLY ===");
    return {
      success: true,
      message: "Signup successful",
    };

  } catch (error) {
    console.error("=== SIGNUP PROCESS FAILED ===");
    console.error("Final error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return {
      success: false,
      message: `Signup failed: ${error.message}`,
      error: error.stack
    };
  }
};

// export const signUp = async (body, cookies) => {
//   console.log(body, "bodysignUp");
//   const existingUser = await auth.getKey("email", body.email).catch(() => null);
//   const existingUsernameKey = await auth.getKey('username', body.username).catch(() => null);
//   // const existingPhoneKey = await auth
//   //   .getKey("phone", body.phone)
//   //   .catch(() => null);
// console.log(existingUser,"existing user");
// console.log(existingUsernameKey,"existingUsernameKey")

//   if (existingUser) {
//     return {
//       success: false,
//       message: "This email already exists. Please login or try with another.",
//     };
//   }

//   if (existingUsernameKey) {
//     return {
//       success: false,
//       message: "This username already exists. Please login or try with another.",
//     };
//   }


//   const luciaUser = await auth.createUser({
//     key: {
//       providerId: "email",
//       providerUserId: body.email,
//       password: body.password,
//     },
//     attributes: {
//       username: body.firstName,
//       email: body.email,
//       // phone: body.phone,
//     },
//   });

//   // if (!existingPhoneKey) {
//   //   await auth.createKey({
//   // 	userId: luciaUser.userId,
//   // 	providerId: "phone",
//   // 	providerUserId: body.phone,
//   // 	password: "Password123",
//   //   });
//   // }

//   // if (!existingUsernameKey) {
//   // 	await auth.createKey({
//   // 		userId: luciaUser.userId,
//   // 		providerId: "username",
//   // 		providerUserId: body.username,
//   // 		password: body.password,
//   // 	});
//   // }
//   console.log(luciaUser, "luciaUser");

//   const newProfile = new Profile({
//     userId: luciaUser.userId,
//     firstName: body.firstName,
//     lastName: body.lastName,
//     cellPhone: body.phone,
//     email: body.email,
//     isPhoneVerified: body.isPhoneVerified,
//     isEmailVerified: body.isEmailVerified,
//     country: body.country,
//     currency: body.currency,
//   });

//   const savedProfile = JSON.parse(JSON.stringify(await newProfile.save()));
//   console.log(savedProfile, "savedProfile");

//   const subscribeUrl = `${API_URL}/subscribe`;
//   await subscribeIfNotAlready(subscribeUrl, body.email, PUBLIC_WEBSITE_NAME, token);

//   // 2. Create empty cart for user
//   const cart = new Cart({
//     cartItems: [],
//     userId: luciaUser.userId,
//     userEmail: body.email
//   });

//   await cart.save();

//   const key = await auth.useKey("email", body.email, body.password);
//   console.log("key.userId", key);

//   const user = await auth.getUser(key.userId);
//   const session = await auth.createSession({
//     userId: user.userId,
//     attributes: {},
//   });

//   const sessionCookie = auth.createSessionCookie(session);
//   cookies.set(
//     sessionCookie.name,
//     sessionCookie.value,
//     sessionCookie.attributes
//   );
//   console.log("Session created successfully");

//   return {
//     success: true,
//     message: "Signup successful",
//   };
// };

  export const passwordVerificationToken = async (body, verifyType) => {
    const { email, userId } = body;
    // console.log(body, 'Body from actions');
    // console.log(email, 'Email received');
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: 'Please provide your registered email address to proceed with resetting your password'
      };
    }
  
    console.log(user, 'User fetched');
    const token = uuidv4();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    console.log(token,expiry);
    const verification = await TokenVerification.create({
      email,
      token,
      expiry,
      verificationType: 'reset',
      userId
    });
    console.log('-------', verification);
    const transporter = nodemailer.createTransport({
      service: 'partskeys', 
      host: 'mail.partskeys.com',
      port: 587, 
      secure: false,
      auth: {
        user: SENDER_EMAIL, 
        pass: SENDER_PASSWORD 
      }
    });
    console.log('=======',transporter);
    const mailOptions = {
      from: SENDER_EMAIL,
      to: email,
      subject: `Password Reset Request for Your ${PUBLIC_WEBSITE_NAME} Account `,
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333333; text-align: center; font-size: 24px;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #555555; line-height: 1.5; text-align: center;">
          Hi there,<br/><br/>
          We received a request to reset your password. To proceed, please click the button below to reset your password.
        </p>
        <div style="text-align: center;">
          <a href="${APP_URL}/reset-password?token=${token}" style="display: inline-block; background-color: #e87a3f; color: #ffffff; padding: 15px 30px; font-size: 16px; text-decoration: none; border-radius: 5px; text-transform: uppercase; font-weight: bold; margin-top: 20px;">
          Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #777777; text-align: center; margin-top: 30px;">
          If you didn't sign up for this account, you can ignore this email.
        </p>
        <p style="font-size: 14px; color: #777777; text-align: center;">
          Thanks,<br/>
          The ${PUBLIC_WEBSITE_NAME} Team
        </p>
        </div>
      </body>
      </html>
    `
    };
    console.log("+++++++",mailOptions);
    try {
      const res = await transporter.sendMail(mailOptions);
      console.log('mail response', res);
      return {
        success: true,
        message: 'Password verification token is sent to your email. Please verify.'
      };
    } catch (err) {
      // return {
      // 	success: false,
      // 	message: 'Something went wrong. try again later:',err
      // };
      console.error(err);
      throw error(500, { message: 'Something went wrong. try again later' });
    }
  };


  export const ResetPassword = async (body) => {
    try {
      const { email, newPassword, token } = body;
      console.log("Password reset request for:", email || "token-based reset");
  
      // Case 1: If token is provided, verify it
      if (token) {
        const tokenRecord = await TokenVerification.findOne({ token });
  
        // If token is not found or expired, return an error
        if (!tokenRecord) {
          return { success: false, message: 'Invalid or expired token.' };
        }
  
        const currentTime = new Date();
        if (currentTime > tokenRecord.expiry) {
          await TokenVerification.deleteOne({ token });
          return { success: false, message: 'Token has expired' };
        }
  
        // If token is already used, prevent reuse
        if (tokenRecord.used) {
          return { success: false, message: 'Token has already been used' };
        }
  
        // Mark token as used and get the associated email
        await TokenVerification.updateOne({ token }, { $set: { used: true } });
        const userEmail = tokenRecord.email;
  
        // Update password directly in Profile collection
        const updatedProfile = await Profile.findOneAndUpdate(
          { email: userEmail },
          { 
            password: newPassword,
            needsPasswordSetup: false 
          },
          { new: true }
        );
  
        if (!updatedProfile) {
          return { success: false, message: 'Profile not found with the associated email' };
        }
  
        // Delete token record after successful password update
        await TokenVerification.deleteOne({ token });
  
        return { success: true, message: 'Password reset successful' };
      }
  
      // Case 2: If email is provided directly, reset password
      if (email) {
        const updatedProfile = await Profile.findOneAndUpdate(
          { email: email },
          { 
            password: newPassword,
            needsPasswordSetup: false 
          },
          { new: true }
        );
  
        if (!updatedProfile) {
          return { success: false, message: 'Profile not found with this email' };
        }
  
        return { success: true, message: 'Password reset successful' };
      }
  
      // Case 3: If neither token nor email is provided, return an error
      return { success: false, message: 'Token or email is required but missing.' };
  
    } catch (error) {
      console.error("Error during password reset:", error);
      return { 
        success: false, 
        message: 'Failed to reset the password',
        error: error.message  // Including the error message for debugging
      };
    }
  };
  export const saveMailId = async (body) => {
    // console.log(body);
    
    const newSearchQuery = new SearchQueries(body);
    // console.log(newSearchQuery);
    
    await newSearchQuery.save();
    return { status: 200 };
  };
  export const searchByQuery = async (body) => {
    console.log("body.query", body.query);
  
    const cleanedQuery = body.query.trim();
    const keywords = cleanedQuery.split(/\s+/); // split into words
    const regexes = keywords.map(word => new RegExp(word, 'i'));
  
    try {
      const result = await Product.find({
        $and: regexes.map(r => ({
          $or: [
            { name: { $regex: r } },
            { product_number: { $regex: r } }
          ]
        }))
      })
        .limit(10)
        .populate('category')
        .populate('subcategory')
        .exec();
  
      console.log(result, "result");
  
      return JSON.parse(JSON.stringify(result));
    } catch (error) {
      console.error(error);
      return { success: false, message: 'something went wrong' };
    }
  };

  export const addToCart = async (item) => {
    console.log("Incoming item:", item);
    console.log("User email:", item?.userEmail);
  const userEmail =item?.userEmail;
    const startTime = Date.now();
  
    try {
      const cart = await Cart.findOne({
        userEmail,
        isActiveCart: true
      });
  
      if (!cart) {
      const newCart = await Cart.create({
          cartId: nanoid(8),
          cartName: "mycart",
          cartItems: [{
            productId: item.productId,
            quantity: item.quantity
          }],
          userEmail,
          isActiveCart: true
        });
        return { success: true, message: "Product added to new cart" };
      } else {
        const productIndex = cart.cartItems.findIndex(cartItem =>
          (cartItem.productID && cartItem.productID.toString() === item.productId.toString()) ||
          (cartItem.productId && cartItem.productId.toString() === item.productId.toString())
        );
  
        if (productIndex === -1) {
  
          const updatedCart = await Cart.findOneAndUpdate(
            { userEmail, isActiveCart: true },
            {
              $push: {
                cartItems: {
                  productId: item.productId,
                  quantity: item.quantity
                }
              }
            },
            { new: true }
          );
          return { success: true, message: "Product added to cart" };
        } else {
         const updatedCartItems = [...cart.cartItems];
          updatedCartItems[productIndex].quantity = item.quantity;
  
          const updatedCart = await Cart.findOneAndUpdate(
            { userEmail, isActiveCart: true },
            { $set: { cartItems: updatedCartItems } },
            { new: true }
          );
          const endTime = Date.now();
      
          return { success: true, message: "Product quantity updated in cart" };
        }
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
 

  export async function updateProfile(body) {
    console.log(body,"body");
    
  try {
    const {
      userId,
      fullName,
      companyName,
      mobileNr,
      email,
      alternateNr,
      companyType,
      companyUrl,
      country
    } = body;

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = new Profile({
        userId,
        fullName,
        companyName,
        mobileNr,
        email,
        alternateNr,
        companyType,
        companyUrl,
        country,
        addresses: [],
        emailContacts: [],
      });
    } else {
      profile.fullName = fullName;
      profile.companyName = companyName;
      profile.cellPhone = mobileNr;
      profile.email = email;
      profile.alternateNr = alternateNr;
      profile.companyType = companyType;
      profile.companyUrl = companyUrl;
      profile.country = country;
    }

    await profile.save();

    return {
      success: true,
      message: "Profile updated successfully",
      profile: JSON.parse(JSON.stringify(profile))
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "Failed to update profile",
      error: error.message
    };
  }
}

export async function addOrUpdateAddress(body) {
  try {
    const { userId, addressId, addressType, ...addressData } = body;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return { success: false, message: "Profile not found" };
    }

    addressData.type = addressType;

    if (addressId) {
      const addressIndex = profile.addresses.findIndex(addr => addr._id.toString() === addressId);

      if (addressIndex !== -1) {
        profile.addresses[addressIndex] = {
          ...profile.addresses[addressIndex].toObject(),
          ...addressData,
          _id: profile.addresses[addressIndex]._id
        };
      } else {
        return { success: false, message: "Address not found" };
      }
    } else {
      // Add new address
      profile.addresses.push(addressData);
    }

    await profile.save();

    return {
      success: true,
      message: addressId ? "Address updated successfully" : "Address added successfully",
      profile: JSON.parse(JSON.stringify(profile))
    };
  } catch (error) {
    console.error("Error with address operation:", error);
    return {
      success: false,
      message: "Failed to process address",
      error: error.message
    };
  }
}

export async function deleteAddress(body) {
  try {
    const { userId, addressId } = body;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return { success: false, message: "Profile not found" };
    }

    profile.addresses = profile.addresses.filter(addr => addr._id.toString() !== addressId);

    await profile.save();

    return {
      success: true,
      message: "Address deleted successfully",
      profile: JSON.parse(JSON.stringify(profile))
    };
  } catch (error) {
    console.error("Error deleting address:", error);
    return {
      success: false,
      message: "Failed to delete address",
      error: error.message
    };
  }
}

export const addItemInCart = async (body) => {
  try {
    const { userId, productId, stockId, qty } = body;
    console.log(body, "body");

    // First, try to find if user has a cart
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      // Create new cart if user doesn't have one
      userCart = new Cart({
        userId,
        cartItems: [{ productId, stockId, qty }],
        isActive: true
      });
      await userCart.save();
    } else {
      // Check if item already exists in cart
      const existingItemIndex = userCart.cartItems.findIndex(
        item => item.productId.toString() === productId.toString()
      );

      if (existingItemIndex > -1) {
        // Update existing item
        await Cart.updateOne(
          { userId, "cartItems.productId": productId },
          {
            $set: {
              "cartItems.$.qty": qty,
              "cartItems.$.stockId": stockId, // Include stockId in update
              isActive: true
            }
          }
        );
      } else {
        // Add new item to cart
        await Cart.updateOne(
          { userId },
          {
            $push: {
              cartItems: { productId, stockId, qty }
            },
            $set: {
              isActive: true
            }
          }
        );
      }
    }

    // Return updated cart with populated data if needed
    const updatedCart = await Cart.findOne({ userId })
      .populate('cartItems.productId') // Populate product details
      .lean();

    console.log("cart after adding/updating item", updatedCart);
    
    return {
      success: true,
      cart: JSON.parse(JSON.stringify(updatedCart)),
      message: "Item added to cart successfully"
    };

  } catch (error) {
    console.error("Error in addItemInCart:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to add item to cart"
    };
  }
};