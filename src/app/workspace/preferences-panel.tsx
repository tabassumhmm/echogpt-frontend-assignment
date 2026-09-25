import { Keyboard, PanelTop, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface PreferencesPanelProps {
	streamingEnabled: boolean;
	compactMode: boolean;
	keyboardShortcutsEnabled: boolean;
	onStreamingChange: (value: boolean) => void;
	onCompactChange: (value: boolean) => void;
	onKeyboardShortcutsChange: (value: boolean) => void;
}

interface PreferenceRowProps {
	id: string;
	icon: React.ReactNode;
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
}

function PreferenceRow({
	id,
	icon,
	label,
	description,
	checked,
	onCheckedChange,
}: PreferenceRowProps) {
	return (
		<div className="flex items-start justify-between gap-4 border-b border-border/60 py-4 last:border-0 last:pb-0 first:pt-0">
			<div className="flex min-w-0 gap-3">
				<span className="mt-0.5 text-primary" aria-hidden="true">
					{icon}
				</span>
				<div>
					<label htmlFor={id} className="text-sm font-medium">
						{label}
					</label>
					<p className="mt-1 text-xs leading-5 text-muted-foreground">
						{description}
					</p>
				</div>
			</div>
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				aria-label={label}
			/>
		</div>
	);
}

export function PreferencesPanel({
	streamingEnabled,
	compactMode,
	keyboardShortcutsEnabled,
	onStreamingChange,
	onCompactChange,
	onKeyboardShortcutsChange,
}: PreferencesPanelProps) {
	return (
		<Card className="h-fit" aria-labelledby="preferences-title">
			<CardHeader className="border-b border-border/60 bg-muted/20">
				<p className="eyebrow">Shared settings</p>
				<CardTitle id="preferences-title">Workspace behavior</CardTitle>
			</CardHeader>
			<CardContent className="p-4 md:p-5">
				<PreferenceRow
					id="streaming-enabled"
					icon={<Sparkles className="size-4" />}
					label="Simulate streaming"
					description="Show a writing state while the deterministic response resolves."
					checked={streamingEnabled}
					onCheckedChange={onStreamingChange}
				/>
				<PreferenceRow
					id="compact-mode"
					icon={<PanelTop className="size-4" />}
					label="Compact mode"
					description="Reduce message spacing for denser side-by-side work."
					checked={compactMode}
					onCheckedChange={onCompactChange}
				/>
				<PreferenceRow
					id="keyboard-shortcuts"
					icon={<Keyboard className="size-4" />}
					label="Keyboard shortcuts"
					description="Keep the prompt composer ready for keyboard-first navigation."
					checked={keyboardShortcutsEnabled}
					onCheckedChange={onKeyboardShortcutsChange}
				/>
				<p className="mt-4 rounded-xl bg-muted/50 px-3 py-3 text-xs leading-5 text-muted-foreground">
					Settings, workspace histories, and extension sessions stay in this
					browser. Page text from the extension is never stored.
				</p>
			</CardContent>
		</Card>
	);
}
