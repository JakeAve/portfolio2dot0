import { IS_BROWSER } from "$fresh/runtime.ts";

export default function PageLoading() {
    if (IS_BROWSER) {
        globalThis.addEventListener('load', () => {
            const firstSec = document.querySelector('.first-sec') as HTMLElement;
            firstSec.setAttribute('data-content', '╲╱');
        })
    }
    return <></>
}