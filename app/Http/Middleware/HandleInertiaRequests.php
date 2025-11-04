<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $toasts = [];
        
        // Converter mensagens flash do Laravel em toasts
        if ($request->session()->has('success')) {
            $toasts[] = [
                'type' => 'success',
                'message' => $request->session()->get('success'),
            ];
        }
        
        if ($request->session()->has('error')) {
            $toasts[] = [
                'type' => 'error',
                'message' => $request->session()->get('error'),
            ];
        }
        
        if ($request->session()->has('warning')) {
            $toasts[] = [
                'type' => 'warning',
                'message' => $request->session()->get('warning'),
            ];
        }
        
        if ($request->session()->has('info')) {
            $toasts[] = [
                'type' => 'info',
                'message' => $request->session()->get('info'),
            ];
        }
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'image' => $request->user()->image ?? null,
                    'email_verified_at' => $request->user()->email_verified_at,
                    'active_frame_id' => null,
                    'points' => 0,
                    'streak' => 0,
                    'freeze_count' => 0,
                    'roles' => [],
                ] : null,
            ],
            'ziggy' => fn() => [
                'location' => $request->url(),
                'query' => $request->query(),
            ],
            'toasts' => $toasts,
        ];
    }
}


