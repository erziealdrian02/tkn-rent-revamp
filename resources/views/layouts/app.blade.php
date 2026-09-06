<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'EquipRent Enterprise')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="{{ asset('assets/css/style.css') }}" rel="stylesheet">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @stack('styles')
</head>
<body>
    <div class="app-wrapper">
        <aside class="app-sidebar" id="appSidebar"></aside>
        <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
        <main class="app-main">
            <header class="app-header" id="appHeader"></header>
            <div class="app-content" id="appContent">
                @yield('content')
            </div>
        </main>
    </div>

    {{-- Inject authenticated user into sessionStorage for prototype JS compatibility --}}
    <script>
        @auth
        (function() {
            var laravelUser = {
                id: @json(Auth::user()->id),
                username: @json(Auth::user()->username),
                name: @json(Auth::user()->name),
                role: @json(Auth::user()->roles->first()?->name ?? 'Admin'),
                initials: @json(Auth::user()->initials),
                permissions: @json(Auth::user()->roles->flatMap->permissions->pluck('code')->unique()->values())
            };
            sessionStorage.setItem('er_user', JSON.stringify(laravelUser));
        })();
        @endauth
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts-before')
    <script src="{{ asset('assets/js/mock-data.js') }}"></script>
    <script src="{{ asset('assets/js/business-logic.js') }}"></script>
    <script src="{{ asset('assets/js/app.js') }}"></script>

    {{-- Override logout to use Laravel's POST /logout --}}
    <script>
        function logout() {
            var form = document.createElement('form');
            form.method = 'POST';
            form.action = '{{ route("logout") }}';
            var csrf = document.createElement('input');
            csrf.type = 'hidden';
            csrf.name = '_token';
            csrf.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            form.appendChild(csrf);
            document.body.appendChild(form);
            form.submit();
        }
    </script>
    @stack('scripts')
</body>
</html>

