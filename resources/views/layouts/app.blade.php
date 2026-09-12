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
        <aside class="app-sidebar" id="appSidebar">
            @include('layouts.partials.sidebar')
        </aside>
        <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
        <main class="app-main">
            <header class="app-header" id="appHeader">
                @include('layouts.partials.header', [
                    'headerBreadcrumbs' => $headerBreadcrumbs ?? [],
                    'headerTitle'       => $headerTitle ?? '',
                ])
            </header>
            <div class="app-content" id="appContent">
                @yield('content')
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
    @stack('scripts-before')
    <script src="{{ asset('assets/js/app.js') }}"></script>

    {{-- Theme initialisation (must run before paint) --}}
    <script>
        (function () {
            var saved = localStorage.getItem('er_theme') || 'light';
            document.documentElement.setAttribute('data-theme', saved);
            var icon  = document.getElementById('themeIcon');
            var label = document.getElementById('themeLabel');
            if (icon)  icon.className  = saved === 'dark' ? 'bi bi-sun'  : 'bi bi-moon';
            if (label) label.textContent = saved === 'dark' ? 'Light Mode' : 'Dark Mode';
        })();

        function toggleTheme() {
            var current = document.documentElement.getAttribute('data-theme');
            var next    = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('er_theme', next);
            var icon  = document.getElementById('themeIcon');
            var label = document.getElementById('themeLabel');
            if (icon)  icon.className  = next === 'dark' ? 'bi bi-sun'  : 'bi bi-moon';
            if (label) label.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
        }

        function logout() {
            var form  = document.createElement('form');
            form.method = 'POST';
            form.action = '{{ route("logout") }}';
            var csrf  = document.createElement('input');
            csrf.type = 'hidden';
            csrf.name = '_token';
            csrf.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            form.appendChild(csrf);
            document.body.appendChild(form);
            form.submit();
        }

        function toggleSidebar() {
            var sidebar = document.getElementById('appSidebar');
            var overlay = document.getElementById('sidebarOverlay');
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        }

        function closeSidebar() {
            var sidebar = document.getElementById('appSidebar');
            var overlay = document.getElementById('sidebarOverlay');
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        }

        function toggleNotifications() {
            var dd = document.getElementById('notifDropdown');
            if (dd) dd.classList.toggle('show');
        }

        function markAllRead() {
            var dot = document.querySelector('.badge-dot');
            if (dot) dot.style.display = 'none';
        }

        function openGlobalSearch() {}
        function closeGlobalSearch() {}

        document.addEventListener('click', function (e) {
            var dd  = document.getElementById('notifDropdown');
            var btn = document.getElementById('notifBtn');
            if (dd && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
                dd.classList.remove('show');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeGlobalSearch();
        });
    </script>
    @stack('scripts')
</body>
</html>
