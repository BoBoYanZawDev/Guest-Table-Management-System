<?php

namespace App\Utility;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

trait TelegramBotUtility
{
    public function sendTelegram($message)
    {
        return self::sendTelegramStatic($message);
    }

    public static function sendTelegramStatic($message)
    {
        $setting = appSettingCache();
        $botToken = $setting['bot_token'] ?? null;
        $chatId = $setting['chat_id'] ?? null;

        if (!$botToken || !$chatId) {
            Log::error('Telegram settings are not configured properly.');
            return false;
        }

        $client = new Client();

        try {
            // for text only 
            $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
            $data = [
                'chat_id' => $chatId,
                'text'    => $message,
                'parse_mode' => 'HTML'
            ];

            $response = $client->post($url, [
                'form_params' => $data,
            ]);

            $body = json_decode($response->getBody(), true);

            if (!isset($body['ok']) || $body['ok'] !== true) {
                Log::error('Telegram API fail', $body);
                return false;
            }
            return true;
        } catch (\Exception $e) {
            Log::error('Telegram request error: ' . $e->getMessage());
            return false;
        }
    }
}
