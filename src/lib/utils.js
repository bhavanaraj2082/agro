import { deserialize } from '$app/forms';

export const sendMessage = (actionTarget, formData, callback) => {
	try {
		fetch(actionTarget, {
			method: 'POST',
			body: formData,
			headers: { 'x-sveltekit-action': 'true' }
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.text();
			})
			.then((data) => {
				if (callback && data) {
					const result = deserialize(data);
					if (result.status === 200) callback(result.data);
				} else {
					callback();
				}
			})
			.catch((_) => {
				console.log('-----error------', _);
			});
	} catch (_) {
		console.log('-----error------', _);
	}
};