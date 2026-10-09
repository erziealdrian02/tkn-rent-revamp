{{-- Menu sidebar masih dirender assets/js/app.js (renderSidebarI18n) sesuai hak akses role. Tahap berikut: pindahkan menu ke sini + @can per modul. --}}
<aside class="app-sidebar @yield('sidebar_class')" id="appSidebar"></aside>
<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
