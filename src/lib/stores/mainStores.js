import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const authedUser = writable({username:"",email:'',userId:''})
export const isLoading = writable(false);
export const shippingAddress = writable();
export const billingAddress = writable();
let totalPrice = browser ? JSON.parse(localStorage.getItem('totalPrice')) : 0;

export const cartTotal = writable(totalPrice);
export const cartTotalComps = writable(0)
export const currencyState= writable("inr")


export function logout() {
	authedUser.set({
	  email: '',
	  username: ''
	});
}