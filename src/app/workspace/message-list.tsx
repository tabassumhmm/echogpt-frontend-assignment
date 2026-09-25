import { Bot, UserRound } from "lucide-react";

import { getModel } from "@/lib/demo-data/models";
import type { ChatMessage, ModelId } from "@/lib/storage/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MessageListProps {
	modelId: ModelId;
	items: ChatMessage[];
	compact: boolean;
}

function formatMessageTime(timestamp: string): string {
	return new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(timestamp));
}

export function MessageList({ modelId, items, compact }: MessageListProps) {
	const model = getModel(modelId);
	return (
		<Card
			className="min-w-0 overflow-hidden"
			aria-labelledby="conversation-title"
		>
			<CardHeader className="border-b border-border/60 bg-muted/20">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="eyebrow">Current history</p>
						<CardTitle id="conversation-title">{model.name}</CardTitle>
					</div>
					<Badge variant="secondary">{items.length} messages</Badge>
				</div>
			</CardHeader>
			<CardContent
				className={compact ? "space-y-3 p-3" : "space-y-4 p-4 md:p-6"}
			>
				<div
					className="max-h-[min(62vh,680px)] space-y-4 overflow-y-auto pr-1"
					role="log"
					tabIndex={0}
					aria-live="polite"
					aria-relevant="additions"
					aria-label={`${model.name} conversation`}
				>
					{items.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-border px-5 py-12 text-center">
							<p className="text-sm font-medium">Start with a prompt</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Your local response will appear here without contacting a
								provider.
							</p>
						</div>
					) : (
						items.map((item) => {
							const isUser = item.role === "user";
							return (
								<article
									key={item.id}
									className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
								>
									{!isUser ? (
										<span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
											<Bot className="size-4" aria-hidden="true" />
										</span>
									) : null}
									<div
										className={`max-w-[min(88%,680px)] ${isUser ? "items-end text-right" : ""}`}
									>
										<div
											className={`mb-1 flex items-center gap-2 text-xs text-muted-foreground ${isUser ? "justify-end" : ""}`}
										>
											<span>{isUser ? "You" : model.name}</span>
											<time dateTime={item.createdAt}>
												{formatMessageTime(item.createdAt)}
											</time>
											{item.status === "streaming" ? (
												<Badge variant="outline">Writing…</Badge>
											) : null}
											{item.status === "stopped" ? (
												<Badge variant="destructive">Stopped</Badge>
											) : null}
										</div>
										<div
											className={`rounded-2xl px-4 py-3 text-left text-sm leading-6 shadow-sm ${
												isUser
													? "bg-primary text-primary-foreground"
													: "border border-border/70 bg-background"
											}`}
										>
											<p className="whitespace-pre-wrap">
												{item.content || "Waiting for the local demo response…"}
											</p>
										</div>
									</div>
									{isUser ? (
										<span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
											<UserRound className="size-4" aria-hidden="true" />
										</span>
									) : null}
								</article>
							);
						})
					)}
				</div>
			</CardContent>
		</Card>
	);
}
