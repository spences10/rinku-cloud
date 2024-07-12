<script lang="ts">
	import { get_pocketbase_image_url } from '$lib/utils';
	import type { LayoutServerData } from '../../routes/$types';

	interface Props {
		data: LayoutServerData;
	}

	const { data }: Props = $props();
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">Rinku Cloud</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li>
				<details>
					<summary>
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<label
							tabindex="0"
							class="avatar btn btn-circle btn-ghost"
						>
							<div class="w-10 rounded-full">
								<img
									src={data?.avatar
										? get_pocketbase_image_url(
												data?.collectionId,
												data?.id,
												data?.avatar
											)
										: `https://ui-avatars.com/api/?name=${data?.name}`}
									alt="User avatar"
								/>
							</div>
						</label>
					</summary>
					<ul class="rounded-t-none bg-base-100 p-2">
						<form action="/logout" method="POST">
							<button
								type="submit"
								class="btn btn-warning btn-sm my-2"
							>
								Logout
							</button>
						</form>
						<li><a href="/settings">Settings</a></li>
					</ul>
				</details>
			</li>
		</ul>
	</div>
</div>
