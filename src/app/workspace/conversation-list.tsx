import {
	Check,
	MessageSquare,
	Pencil,
	Pin,
	PinOff,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import {
	type Conversation,
	MAX_CONVERSATION_TITLE_LENGTH,
} from "@/lib/storage/schema";

interface ConversationListProps {
	conversations: Conversation[];
	activeId: string;
	disabled: boolean;
	onSelect: (conversationId: string) => void;
	onCreate: () => void;
	onRename: (conversationId: string, title: string) => void;
	onTogglePin: (conversationId: string) => void;
	onDelete: (conversationId: string) => void;
}

function sortConversations(conversations: Conversation[]): Conversation[] {
	return [...conversations].sort((left, right) => {
		if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
		return right.updatedAt.localeCompare(left.updatedAt);
	});
}

export function ConversationList({
	conversations,
	activeId,
	disabled,
	onSelect,
	onCreate,
	onRename,
	onTogglePin,
	onDelete,
}: ConversationListProps) {
	const [query, setQuery] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draftTitle, setDraftTitle] = useState("");
	const visibleConversations = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return sortConversations(conversations).filter((conversation) => {
			if (normalizedQuery.length === 0) return true;
			return `${conversation.title} ${conversation.messages.map((message) => message.content).join(" ")}`
				.toLowerCase()
				.includes(normalizedQuery);
		});
	}, [conversations, query]);

	function startRename(conversation: Conversation) {
		setEditingId(conversation.id);
		setDraftTitle(conversation.title);
	}

	function cancelRename() {
		setEditingId(null);
		setDraftTitle("");
	}

	function submitRename(conversationId: string) {
		onRename(conversationId, draftTitle);
		cancelRename();
	}

	return (
		<Card role="region" aria-labelledby="conversation-list-title">
			<CardHeader className="border-b border-border/60 bg-muted/20">
				<div className="flex items-center justify-between gap-3">
					<div>
						<p className="eyebrow">Local histories</p>
						<CardTitle id="conversation-list-title">Conversations</CardTitle>
					</div>
					<Button
						type="button"
						size="icon-sm"
						variant="outline"
						onClick={onCreate}
						disabled={disabled}
						aria-label="New conversation"
					>
						<Plus aria-hidden="true" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-3 p-3">
				<div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background px-2.5">
					<Search
						className="size-4 shrink-0 text-muted-foreground"
						aria-hidden="true"
					/>
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.currentTarget.value)}
						placeholder="Search histories"
						aria-label="Search conversation histories"
						className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
					/>
					{query.length > 0 ? (
						<IconButton
							type="button"
							label="Clear history search"
							size="icon-xs"
							variant="ghost"
							onClick={() => setQuery("")}
						>
							<X aria-hidden="true" />
						</IconButton>
					) : null}
				</div>
				<div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
					{visibleConversations.length === 0 ? (
						<p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
							{conversations.length === 0
								? "No histories for this model yet."
								: "No matching histories."}
						</p>
					) : (
						visibleConversations.map((conversation) => {
							const active = conversation.id === activeId;
							const editing = editingId === conversation.id;
							return (
								<div
									key={conversation.id}
									className={`group flex min-w-64 items-center gap-1 rounded-xl border pr-1 transition-colors lg:min-w-0 ${
										active
											? "border-primary/40 bg-primary/8 text-foreground"
											: "border-border/60 bg-background text-muted-foreground hover:bg-muted"
									}`}
								>
									{editing ? (
										<form
											className="flex min-w-0 flex-1 items-center gap-1 p-1"
											onSubmit={(event) => {
												event.preventDefault();
												submitRename(conversation.id);
											}}
										>
											<input
												value={draftTitle}
												maxLength={MAX_CONVERSATION_TITLE_LENGTH}
												onChange={(event) =>
													setDraftTitle(event.currentTarget.value)
												}
												onKeyDown={(event) => {
													if (event.key === "Escape") cancelRename();
												}}
												aria-label={`Rename ${conversation.title}`}
												className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
											/>
											<IconButton
												type="submit"
												label="Save conversation name"
												size="icon-xs"
												variant="ghost"
												disabled={draftTitle.trim().length === 0}
											>
												<Check aria-hidden="true" />
											</IconButton>
											<IconButton
												type="button"
												label="Cancel rename"
												size="icon-xs"
												variant="ghost"
												onClick={cancelRename}
											>
												<X aria-hidden="true" />
											</IconButton>
										</form>
									) : (
										<button
											type="button"
											className="flex min-w-0 flex-1 items-start gap-2 p-3 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
											aria-current={active ? "page" : undefined}
											onClick={() => onSelect(conversation.id)}
											disabled={disabled}
										>
											<MessageSquare
												className="mt-0.5 size-4 shrink-0"
												aria-hidden="true"
											/>
											<span className="min-w-0 flex-1">
												<span className="flex items-center gap-2 text-sm font-medium">
													<span className="truncate">{conversation.title}</span>
													{conversation.pinned ? (
														<Pin
															className="ml-auto size-3.5 shrink-0 text-primary"
															aria-label="Pinned"
														/>
													) : null}
												</span>
												<span className="mt-1 block text-xs text-muted-foreground">
													{conversation.messages.length} messages
												</span>
											</span>
										</button>
									)}
									{editing ? null : (
										<div className="flex shrink-0 items-center">
											<IconButton
												type="button"
												label={
													conversation.pinned
														? `Unpin ${conversation.title}`
														: `Pin ${conversation.title}`
												}
												size="icon-xs"
												variant="ghost"
												onClick={() => onTogglePin(conversation.id)}
												disabled={disabled}
											>
												{conversation.pinned ? (
													<PinOff aria-hidden="true" />
												) : (
													<Pin aria-hidden="true" />
												)}
											</IconButton>
											<IconButton
												type="button"
												label={`Rename ${conversation.title}`}
												size="icon-xs"
												variant="ghost"
												onClick={() => startRename(conversation)}
												disabled={disabled}
											>
												<Pencil aria-hidden="true" />
											</IconButton>
											<IconButton
												type="button"
												label={`Delete ${conversation.title}`}
												size="icon-xs"
												variant="ghost"
												onClick={() => onDelete(conversation.id)}
												disabled={disabled}
											>
												<Trash2 aria-hidden="true" />
											</IconButton>
										</div>
									)}
								</div>
							);
						})
					)}
				</div>
			</CardContent>
		</Card>
	);
}
