<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $shopSetting = \App\Models\ShopSetting::current();
            $appTitle = $shopSetting->app_name ?: config('app.name', 'Bengkel AC Mobil');
            $faviconHref = $shopSetting->favicon_path
                ? \Illuminate\Support\Facades\Storage::disk('public')->url($shopSetting->favicon_path)
                : asset('images/brand/favicon.svg');
            $appleHref = $shopSetting->logo_path
                ? \Illuminate\Support\Facades\Storage::disk('public')->url($shopSetting->logo_path)
                : asset('images/brand/apple-touch-icon.png');
        @endphp
        <title inertia>{{ $appTitle }}</title>
        <link rel="icon" href="{{ $faviconHref }}">
        <link rel="apple-touch-icon" href="{{ $appleHref }}">

        <script>
            (function () {
                var t = localStorage.getItem('berkahteknik_theme');
                var theme = (t === 'dark' || t === 'light') ? t : 'light';
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
                document.documentElement.style.colorScheme = theme;
            })();
        </script>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
