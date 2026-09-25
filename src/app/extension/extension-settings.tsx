"use client";

import { Keyboard, Monitor, RotateCcw, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { quickActions } from "@/lib/demo-data/extension-actions";
import { MODEL_CATALOG, getModel } from "@/lib/demo-data/models";
import {
	isModelId,
	type DemoState,
	type QuickActionId,
} from "@/lib/storage/schema";

type ExtensionSettingsState = Pick<
	DemoState,
	| "defaultModelId"
	| "streamingEnabled"
	| "compactMode"
	| "keyboardShortcutsEnabled"
>;

interface ExtensionSettingsProps {
	settings: ExtensionSettingsState;
	enabledActionIds: QuickActionId[];
	onSettingChange: <Key extends keyof ExtensionSettingsState>(
		key: Key,
		value: ExtensionSettingsState[Key],
	) => void;
	onToggleAction: (actionId: QuickActionId, enabled: boolean) => void;
	onResetRequest: () => void;
}

export function ExtensionSettings({
	settings,
	enabledActionIds,
	onSettingChange,
	onToggleAction,
	onResetRequest,
}: ExtensionSettingsProps) {
	return (
		<section className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
			<Card>
				<CardHeader>
					<CardTitle>Behavior</CardTitle>
					<CardDescription>
						Choose the local defaults used when the extension opens.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="space-y-2">
						<label
							htmlFor="extension-default-model"
							className="text-sm font-medium"
						>
							Default model
						</label>
						<Select
							value={settings.defaultModelId}
							onValueChange={(value) => {
								if (isModelId(value)) onSettingChange("defaultModelId", value);
							}}
						>
							<SelectTrigger id="extension-default-model" className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{MODEL_CATALOG.map((model) => (
									<SelectItem key={model.id} value={model.id}>
										{model.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground">
							Current response model: {getModel(settings.defaultModelId).name}
						</p>
					</div>

					<SettingRow
						icon={Sparkles}
						title="Streaming response"
						description="Show a composing state before the local response is ready."
						checked={settings.streamingEnabled}
						onCheckedChange={(checked) =>
							onSettingChange("streamingEnabled", checked)
						}
					/>
					<SettingRow
						icon={Monitor}
						title="Compact messages"
						description="Use tighter spacing for extension history cards."
						checked={settings.compactMode}
						onCheckedChange={(checked) =>
							onSettingChange("compactMode", checked)
						}
					/>
					<SettingRow
						icon={Keyboard}
						title="Keyboard shortcuts"
						description="Enable Ctrl/Command + Enter to run the selected action."
						checked={settings.keyboardShortcutsEnabled}
						onCheckedChange={(checked) =>
							onSettingChange("keyboardShortcutsEnabled", checked)
						}
					/>
				</CardContent>
			</Card>

			<div className="space-y-5">
				<Card>
					<CardHeader>
						<CardTitle>Quick actions</CardTitle>
						<CardDescription>
							Disabled actions are unavailable in the action launcher.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{quickActions.map((action) => (
							<div
								key={action.id}
								className="flex items-center justify-between gap-4"
							>
								<div className="min-w-0">
									<p className="text-sm font-medium">{action.label}</p>
									<p className="truncate text-xs text-muted-foreground">
										{action.description}
									</p>
								</div>
								<Switch
									aria-label={`Enable ${action.label}`}
									checked={enabledActionIds.includes(action.id)}
									onCheckedChange={(checked) =>
										onToggleAction(action.id, checked)
									}
								/>
							</div>
						))}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Demo data</CardTitle>
						<CardDescription>
							Reset extension history, workspace conversations, and shared
							settings.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							type="button"
							variant="destructive"
							onClick={onResetRequest}
						>
							<RotateCcw aria-hidden="true" />
							Reset demo data
						</Button>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}

interface SettingRowProps {
	icon: LucideIcon;
	title: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

function SettingRow({
	icon: Icon,
	title,
	description,
	checked,
	onCheckedChange,
}: SettingRowProps) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 p-3">
			<div className="flex min-w-0 items-start gap-3">
				<Icon
					className="mt-0.5 size-4 shrink-0 text-muted-foreground"
					aria-hidden="true"
				/>
				<div>
					<p className="text-sm font-medium">{title}</p>
					<p className="text-xs text-muted-foreground">{description}</p>
				</div>
			</div>
			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
				aria-label={title}
			/>
		</div>
	);
}
