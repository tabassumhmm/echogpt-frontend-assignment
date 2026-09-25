"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatBytes(size: number): string {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

interface ImportReviewDialogProps {
	open: boolean;
	fileName: string;
	fileSize: number;
	conversationCount: number;
	isImporting: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ImportReviewDialog({
	open,
	fileName,
	fileSize,
	conversationCount,
	isImporting,
	onConfirm,
	onCancel,
}: ImportReviewDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen && !isImporting) onCancel();
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Replace local workspace history?</AlertDialogTitle>
					<AlertDialogDescription>
						{fileName} contains {conversationCount} conversation
						{conversationCount === 1 ? "" : "s"}. Shared settings and extension
						sessions will stay unchanged.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<p className="text-xs text-muted-foreground">
					{formatBytes(fileSize)} · Import replaces only workspace history.
				</p>
				{isImporting ? (
					<progress
						className="h-1 w-full accent-primary"
						aria-label="Importing workspace history"
					/>
				) : null}
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isImporting}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={isImporting}
						onClick={(event) => {
							event.preventDefault();
							onConfirm();
						}}
					>
						{isImporting ? "Importing…" : "Confirm import"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

interface DeleteConversationDialogProps {
	open: boolean;
	title: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export function DeleteConversationDialog({
	open,
	title,
	onConfirm,
	onCancel,
}: DeleteConversationDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(nextOpen) => !nextOpen && onCancel()}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
					<AlertDialogDescription>
						“{title}” will be removed from this browser. This cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={(event) => {
							event.preventDefault();
							onConfirm();
						}}
					>
						Delete conversation
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

interface ResetDialogProps {
	open: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ResetDialog({ open, onConfirm, onCancel }: ResetDialogProps) {
	return (
		<AlertDialog
			open={open}
			onOpenChange={(nextOpen) => !nextOpen && onCancel()}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Reset the local demo?</AlertDialogTitle>
					<AlertDialogDescription>
						This clears workspace history, extension sessions, and shared local
						settings, then restores the demo seed.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={(event) => {
							event.preventDefault();
							onConfirm();
						}}
					>
						Reset demo
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
