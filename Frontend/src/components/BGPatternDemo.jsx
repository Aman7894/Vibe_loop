import React from 'react';
import { BGPattern } from './ui/bg-pattern';

export default function DemoOne() {
	return (
		<div className="mx-auto max-w-4xl space-y-5 p-8">
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2 overflow-hidden bg-slate-50 dark:bg-black/50">
				<BGPattern variant="grid" mask="fade-edges" className="text-slate-300 dark:text-neutral-800" />
				<h2 className="text-3xl font-bold">Grid Background</h2>
				<p className="text-muted-foreground font-mono">With (fade-edges) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2 overflow-hidden bg-slate-50 dark:bg-black/50">
				<BGPattern variant="dots" mask="fade-center" className="text-slate-300 dark:text-neutral-800" />
				<h2 className="text-3xl font-bold">Dots Background</h2>
				<p className="text-muted-foreground font-mono">With (fade-center) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2 overflow-hidden bg-slate-50 dark:bg-black/50">
				<BGPattern variant="diagonal-stripes" mask="fade-y" className="text-slate-300 dark:text-neutral-800" size={16} />
				<h2 className="text-3xl font-bold">Diagonal Stripes</h2>
				<p className="text-muted-foreground font-mono">With (fade-y) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2 overflow-hidden bg-slate-50 dark:bg-black/50">
				<BGPattern variant="horizontal-lines" mask="fade-right" className="text-slate-300 dark:text-neutral-800" />
				<h2 className="text-3xl font-bold">Horizontal Lines</h2>
				<p className="text-muted-foreground font-mono">With (fade-right) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2 overflow-hidden bg-slate-50 dark:bg-black/50">
				<BGPattern variant="vertical-lines" mask="fade-bottom" className="text-slate-300 dark:text-neutral-800" />
				<h2 className="text-3xl font-bold">Vertical Lines</h2>
				<p className="text-muted-foreground font-mono">With (fade-bottom) Mask</p>
			</div>
			<div className="relative flex aspect-video flex-col items-center justify-center rounded-2xl border-2 overflow-hidden bg-slate-50 dark:bg-black/50">
				<BGPattern variant="checkerboard" mask="fade-top" className="text-slate-300 dark:text-neutral-800" />
				<h2 className="text-3xl font-bold">Checkerboard Background</h2>
				<p className="text-muted-foreground font-mono">With (fade-top) Mask</p>
			</div>
		</div>
	);
}
