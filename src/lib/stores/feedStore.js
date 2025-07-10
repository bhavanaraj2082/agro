import { writable } from 'svelte/store';
export const currentUrl = writable('');
export const prev = writable('');
export const urlHistory = writable([]);
