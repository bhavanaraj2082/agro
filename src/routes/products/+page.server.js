import { getProductdatas } from '$lib/server/mongoLoads.js';

export const load = async () => {
	try {
	  const records = await getProductdatas();
	  return { records };
	} catch (err) {
	  if (err.status === 404) {
		console.error("Error: Product not found", err.message);
		return { error: err.message, status: 404 };
	  } else {
		console.error("Error fetching product data:", err);
		return { error: "Failed to retrieve product data.", status: 500 };
	  }
	}
  };