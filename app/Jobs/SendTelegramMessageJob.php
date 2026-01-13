<?php

namespace App\Jobs;

use App\Models\Category;
use Throwable;
use App\Models\User;
use App\Models\Rating;
use App\Models\SubCategory;
use Illuminate\Bus\Queueable;
use App\Utility\TelegramBotUtility;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendTelegramMessageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    use TelegramBotUtility;

    public int $tries = 5;
    public int $backoff = 5;

    public int $user_id;
    public int $rating_id;
    public  $feedback_msg;
    public ?int $cat_id;
    public ?int $subcat_id;

    public function __construct(int $user_id, int $rating_id, $feedback_msg, ?int $cat_id, ?int $subcat_id)
    {
        $this->user_id = $user_id;
        $this->rating_id = $rating_id;
        $this->feedback_msg = $feedback_msg;
        $this->cat_id = $cat_id;
        $this->subcat_id = $subcat_id;
    }

    public function handle(): void
    {
        $rating = Rating::find($this->rating_id);
        if ($rating && $rating->point >= 1) return;

        $user = User::with(['branch', 'department'])->find($this->user_id);
        if (!$user) return;

        $cat = Category::find($this->cat_id);
        $subCat = SubCategory::find($this->subcat_id);

        $ratingTitle = $rating?->title ?? "-";

        $message =
            "[Rating] Bad Rating received from \n\n"
            . "🏢 Branch : " . ($user->branch?->branch_name ?? "-") . "\n\n"
            . "🏢 Department : " . ($user->department?->dept_name ?? "-") . "\n\n"
            . ($cat
                ? "📊 Category : " . ($cat->cat_name ?? "-") . "\n\n"
                : "")
            . ($subCat
                ? "📊 SubCategory : " . ($subCat->subcat_name ?? "-") . "\n\n"
                : "")
            . "⭐ Rating : " . $ratingTitle . "\n\n"
            . "💬 FeedBack : " . ($this->feedback_msg ?: "-") . "\n";

        $this->sendTelegram($message);

        usleep(300000);
    }

    // ✅ Helpful: see the real error in logs if it fails
    public function failed(Throwable $e): void
    {
        Log::error('SendTelegramMessageJob failed', [
            'user_id' => $this->user_id,
            'rating_id' => $this->rating_id,
            'error' => $e->getMessage(),
        ]);
    }
}
