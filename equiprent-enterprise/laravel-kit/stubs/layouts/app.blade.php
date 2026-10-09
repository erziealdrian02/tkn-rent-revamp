{{-- Kerangka utama semua halaman (dari laravel-kit). Isi sidebar & header masih dirender assets/js/app.js lewat initApp(). --}}
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title') - EquipRent Enterprise</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="{{ asset('assets/css/style.css') }}" rel="stylesheet">
  @stack('head')
</head>
<body>
  <div class="app-wrapper">
    @include('components.sidebar')
    <main class="app-main">
      @include('components.header')
      <div class="app-content" @yield('content_attrs')>
@yield('content')
      </div>
    </main>
  </div>

  @yield('modals')

  {{-- Tiap halaman memuat script-nya sendiri (urutan sama dengan prototype) --}}
  @stack('scripts')
</body>
</html>
