import { writable } from 'svelte/store';

const initialCart =
	typeof window !== 'undefined' && localStorage.getItem('cart')
		? JSON.parse(localStorage.getItem('cart'))
		: [];

export const cart = writable([]);
export const guestCart = writable(initialCart);

export const checkoutError = writable('');

if (typeof window !== 'undefined') {
	guestCart.subscribe((items) => {
		localStorage.setItem('cart', JSON.stringify(items));
	});
}

// Function to add item to cart
export function addItemToCart(item) {
	guestCart.update((items) => {
		// ('3553', Array.isArray(item));
		if (Array.isArray(item)) {
			if (!items.length) return item;

			const inCart = item.filter((item1) => items.some((item2) => item2.productId === item1.productId && item2.stockId === item1.stockId));
			//console.log('add to cart',inCart);
			if (inCart.length) {
				inCart.forEach((obj) => {
					const search = items.find((item) => item.productId === obj.productId && item.stockId === obj.stockId);
					if (search !== undefined) Object.assign(search, obj);
				});
			}
			const notInCart = item.filter((item1) => !items.some((item2) => item2.productId === item1.productId && item2.stockId === item1.stockId));
			notInCart.forEach((obj) => {
				items.push(obj);
			});
			return items;
		} else {
			if (!items.length) return [item];
			const search = items.find((itm) => itm.productId === item.productId && itm.stockId === item.stockId);
			if (search === undefined) {
				items.push(item);
			} else {
				Object.assign(search, item);
			}
			return items;
		}

		// const index = items.findIndex((i) => i.id === item.id);
		// if (index === -1) {
		// 	return [...items, { ...item}];
		// } else {
		// 	items[index].quantity += item.quantity;
		// 	return items;
		// }
	});
}

// Function to remove item from cart
export function removeFromCart(id) {
	if(id === undefined) {
		console.log('fdssssssd',id);
		cart.update(items => items = [])
		guestCart.update(items => items = [])
	}
	cart.update((items) => items.filter((item,inx) => inx !== id));
	guestCart.update((items) => items.filter((item,inx) => inx !== id));
}