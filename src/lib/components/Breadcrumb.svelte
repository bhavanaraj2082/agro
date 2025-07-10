<script>
	import { page } from '$app/stores';
	let crumbs = [];
	$: {
		const tokens = $page.url.pathname.split('/').filter((t) => t !== '');
		let tokenPath = '';
		crumbs = [];
		crumbs.push({ label: 'Home', href: '/' });
		if (tokens.length === 0) {
			crumbs = [];
		} else {
			if (tokens[0] === 'reset-password') {
				crumbs.push({ label: 'Reset Password', href: '/reset-password' });
			} else {
				tokens.forEach((t) => {
					tokenPath += '/' + t;
					const label = t
						.split('-')
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ');
					crumbs.push({
						label,
						href: tokenPath
					});
				});
			}
		}
	}
</script>

{#if crumbs.length > 0}
	<div class="w-11/12 mx-auto max-w-7xl">
		<div class="py-3 px-1 mx-auto lg:mx-0 w-full">
			<div class="flex flex-wrap text-primary-400 sm:text-sm text-2s items-center space-x-0">
				{#if crumbs.length === 1}
					<span class="text-primary-400 font-bold text-xs">{crumbs[0].label}</span>
				{:else}
					<div class="flex flex-wrap items-center">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 sm:h-5 h-3">
							<path
								d="M12 3l10 9h-3v8h-5v-5h-4v5H5v-8H2l10-9z"
								fill="none"
								stroke="currentColor"
								stroke-width="1"
							/>
						</svg>
						{#each crumbs.slice(0, -1) as c}
							<a
								href={c.href}
								class="text-primary-400 sm:text-sm text-2s hover:underline hover:underline-offset-4 hover:decoration-primary-600 transition-colors"
								>{c.label}</a
							>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="2em"
								height="2em"
								viewBox="0 0 30 30"
								class="mt-2"
							>
								<path
									d="M8.59 16.34L13.17 12 8.59 7.66 10 6.25l5.25 5.25L10 16.75z"
									fill="currentColor"
								/>
							</svg>
						{/each}
						<span class="text-primary-500 font-bold sm:text-sm text-2s">{crumbs[crumbs.length - 1].label}</span
						>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
