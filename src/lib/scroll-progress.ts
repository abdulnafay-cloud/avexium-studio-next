/** Finish a pinned sequence when its stage releases, using its actual layout size. */
export function scrollProgress(section: HTMLElement, stage?: HTMLElement | null) {
 const bounds = section.getBoundingClientRect();
 const duration = bounds.height - (stage ? stage.getBoundingClientRect().height : window.innerHeight);
 return Math.max(0, Math.min(1, -bounds.top / Math.max(1, duration)));
}
