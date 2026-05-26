<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    private function scopedQuery()
    {
        $user = auth()->user();

        return Notification::where('is_deleted', false)
            ->when(
                $user->role === 'admin',
                fn ($q) => $q->where(function ($inner) use ($user) {
                    $inner->whereNull('user_id')
                        ->orWhere('user_id', $user->user_id);
                }),
                fn ($q) => $q->where('user_id', $user->user_id)
            )
            ->orderByDesc('created_at');
    }

    public function index(Request $request)
    {
        $limit = min((int) $request->input('limit', 100), 200);

        $notifications = $this->scopedQuery()
            ->limit($limit)
            ->get()
            ->map(fn (Notification $n) => $this->formatNotification($n));

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $notifications->where('is_read', false)->count(),
        ], 200);
    }

    public function markRead(Notification $notification)
    {
        if (!$this->canAccess($notification)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'message'      => 'Notification marked as read.',
            'notification' => $this->formatNotification($notification->fresh()),
        ], 200);
    }

    public function markAllRead()
    {
        $this->scopedQuery()
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'All notifications marked as read.',
        ], 200);
    }

    private function canAccess(Notification $notification): bool
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return $notification->user_id === null
                || (int) $notification->user_id === (int) $user->user_id;
        }

        return (int) $notification->user_id === (int) $user->user_id;
    }

    private function formatNotification(Notification $n): array
    {
        return [
            'notification_id' => $n->notification_id,
            'type'            => $n->type,
            'title'           => $n->title,
            'message'         => $n->message,
            'is_read'         => (bool) $n->is_read,
            'created_at'      => $n->created_at?->format('M j, Y g:i A') ?? '',
        ];
    }
}
