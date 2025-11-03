<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Brain Agriculture') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/favicon.ico">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet">

        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/frontend/app.tsx', "resources/frontend/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>

    <body class="font-sans antialiased" translate="no">
        @inertia
    </body>
</html>


