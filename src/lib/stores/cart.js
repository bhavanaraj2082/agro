import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const cart = writable([])
