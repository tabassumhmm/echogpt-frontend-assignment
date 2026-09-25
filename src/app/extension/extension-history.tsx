"use client";

import { Clock3, MessageSquareText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuickAction } from "@/lib/demo-data/extension-actions";
import { getModel } from "@/lib/demo-data/models";
import {
	isQuickActionId,
	type ExtensionSession,
	type QuickActionId,
} from "@/lib/storage/schema";

interface ExtensionHistoryProps {
	sessions: ExtensionSession[];
	selectedActionId: QuickActionId;
	onSelectAction: (actionId: QuickActionId) => void;
	onClearRequest: () => void;
}

function formatUpdatedAt(value: string): string {
	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

export function ExtensionHistory({
	sessions,
	selectedActionId,
	onSelectAction,
	onClearRequest,
}: ExtensionHistoryProps) {
	return (
		<section
			className="mx-auto w-full max-w-4xl space-y-5"
			aria-label="Extension action history"
		>
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<p className="text-sm font-medium text-muted-foreground">
						Per-action history
					</p>
					<h2 className="mt-1 text-2xl font-semibold tracking-tight">
						Your extension sessions
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Each action keeps its own messages and model provenance.
					</p>
				</div>
				<Button
					type="button"
					variant="outline"
					disabled={sessions.length === 0}
					onClick={onClearRequest}
				>
					<Trash2 aria-hidden="true" />
					Clear history
				</Button>
			</div>

			{sessions.length === 0 ? (
				<Card>
					<CardContent className="flex min-h-44 flex-col items-center justify-center text-center">
						<MessageSquareText
							className="size-8 text-muted-foreground"
							aria-hidden="true"
						/>
						<h3 className="mt-3 font-medium">No action history yet</h3>
						<p className="mt-1 max-w-sm text-sm text-muted-foreground">
							Run a quick action in Chat. Its request label and local response
							will appear here.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{[...sessions]
						.sort((left, right) =>
							right.updatedAt.localeCompare(left.updatedAt),
						)
						.map((session) => {
							if (!isQuickActionId(session.actionId)) return null;
							const action = getQuickAction(session.actionId);
							const response = [...session.messages]
								.reverse()
								.find((message) => message.role === "assistant");
							const model = response
								? getModel(response.modelId)
								: getModel("gpt-4");
							const selected = session.actionId === selectedActionId;
							return (
								<Card
									key={session.id}
									className={selected ? "border-primary/60" : undefined}
								>
									<CardHeader className="gap-2 pb-3 sm:flex-row sm:items-start sm:justify-between">
										<div>
											<CardTitle className="text-base">
												{action.label}
											</CardTitle>
											<p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
												<Clock3 className="size-3.5" aria-hidden="true" />
												{formatUpdatedAt(session.updatedAt)} ·{" "}
												{session.messages.length} messages
											</p>
										</div>
										<Button
											type="button"
											size="sm"
											variant={selected ? "secondary" : "ghost"}
											onClick={() => onSelectAction(action.id)}
										>
											{selected ? "Selected" : "Open in chat"}
										</Button>
									</CardHeader>
									<CardContent>
										<p className="mb-2 text-xs font-medium text-muted-foreground">
											{model.name}
										</p>
										<p className="line-clamp-3 text-sm leading-6 text-foreground/85">
											{response?.content || "No completed response."}
										</p>
									</CardContent>
								</Card>
							);
						})}
				</div>
			)}
		</section>
	);
}
