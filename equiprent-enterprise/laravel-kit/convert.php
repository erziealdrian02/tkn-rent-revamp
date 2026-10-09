<?php
/**
 * EquipRent Enterprise — konversi prototype HTML → Laravel Blade (Tahap 2: slicing UI).
 *
 * Pakai:
 *   php convert.php --to=<folder project Laravel> [--from=<folder prototype>] [--register] [--force] [--dry-run]
 *   php convert.php --list                     tampilkan peta halaman saja
 *
 *   --from      folder prototype (default: folder induk laravel-kit)
 *   --to        root project Laravel (berisi artisan)
 *   --register  tambahkan `require __DIR__.'/prototype.php';` ke routes/web.php
 *   --force     timpa file Blade / layout yang sudah ada
 *   --dry-run   hanya tampilkan apa yang akan dibuat, tidak menulis file
 *
 * Hasil (lihat README.md):
 *   public/assets/**                         aset prototype (link .html di JS diganti URL route)
 *   resources/views/layouts/app.blade.php    kerangka utama (dari stubs/)
 *   resources/views/components/*.blade.php   sidebar & header (dari stubs/)
 *   resources/views/<view>.blade.php         1 file per halaman sesuai page-map.json
 *   routes/prototype.php                     Route::view per halaman
 */

const STANDARD_HEAD = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'assets/css/style.css',
];

// Directive Blade yang bisa "tidak sengaja" ada di teks/JS prototype → di-escape jadi @@
const BLADE_DIRECTIVES = 'if|elseif|else|endif|unless|endunless|isset|endisset|empty|endempty|auth|endauth|guest|endguest|production|endproduction|env|endenv|hasSection|sectionMissing|switch|case|break|default|endswitch|for|endfor|foreach|endforeach|forelse|endforelse|while|endwhile|continue|php|endphp|include|includeIf|includeWhen|includeUnless|includeFirst|each|once|endonce|push|endpush|pushOnce|endPushOnce|prepend|endprepend|stack|section|endsection|yield|show|stop|append|overwrite|parent|extends|component|endcomponent|slot|endslot|props|aware|verbatim|endverbatim|json|js|csrf|method|error|enderror|can|endcan|cannot|endcannot|canany|endcanany|lang|choice|class|style|checked|selected|disabled|readonly|required|dd|dump|vite|inject|use|fragment|endfragment|session|endsession|context|endcontext|livewire|livewireStyles|livewireScripts';

$opt = getopt('', ['from:', 'to:', 'register', 'force', 'dry-run', 'list', 'help']);
$kit = __DIR__;
if (isset($opt['help'])) { echo preg_replace('/^ \* ?/m', '', explode('*/', explode('/**', file_get_contents(__FILE__))[1])[0]); exit(0); }

$map = json_decode(file_get_contents("$kit/page-map.json"), true);
if (!$map) fail('page-map.json tidak valid');
$pages = [];
foreach ($map['groups'] as $g) foreach ($g['pages'] as $p) { $p['group'] = $g['label']; $pages[$p['html']] = $p; }

if (isset($opt['list'])) { listPages($map); exit(0); }

$from = rtrim($opt['from'] ?? dirname($kit), '/\\');
$to = isset($opt['to']) ? rtrim($opt['to'], '/\\') : null;
$dry = isset($opt['dry-run']);
$force = isset($opt['force']);
if (!$to) fail("--to wajib diisi (root project Laravel). Contoh: php convert.php --to=../equiprent-laravel\nLihat: php convert.php --help");
if (!is_file("$to/artisan")) fail("$to bukan project Laravel (artisan tidak ditemukan)");
if (!is_dir("$from/assets")) fail("$from bukan folder prototype (assets/ tidak ditemukan)");

// x.html → URL relatif (sama dgn nama file). app.js mengenali halaman dari segmen URL terakhir.
$slug = [];
foreach ($pages as $html => $p) $slug[$html] = substr($html, 0, -5);

$written = []; $skipped = []; $warnings = []; $unknownLinks = [];

// ---------- 1. Cek semua file HTML terdaftar di skema ----------
foreach (glob("$from/*.html") as $f) {
    if (!isset($pages[basename($f)])) $warnings[] = 'Belum ada di page-map.json (tidak dikonversi): ' . basename($f);
}
foreach ($pages as $html => $p) {
    if (!is_file("$from/$html")) $warnings[] = "Ada di page-map.json tapi file tidak ada: $html";
}

// ---------- 2. Aset → public/assets ----------
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator("$from/assets", FilesystemIterator::SKIP_DOTS));
foreach ($it as $file) {
    $rel = str_replace('\\', '/', substr($file->getPathname(), strlen($from) + 1));
    $content = file_get_contents($file->getPathname());
    if (preg_match('/\.js$/', $rel)) $content = rewriteLinks($content, $rel);
    put("$to/public/$rel", $content, true);
}

// ---------- 3. Layout & komponen ----------
foreach (['layouts/app.blade.php', 'components/sidebar.blade.php', 'components/header.blade.php'] as $stub) {
    put("$to/resources/views/$stub", file_get_contents("$kit/stubs/$stub"), $force);
}

// ---------- 4. Halaman ----------
foreach ($pages as $html => $p) {
    if (!is_file("$from/$html")) continue;
    $src = preg_replace('/^\xEF\xBB\xBF/', '', file_get_contents("$from/$html"));
    $blade = $p['layout'] === 'app' ? convertAppPage($src, $p) : convertStandalone($src, $p);
    put("$to/resources/views/" . str_replace('.', '/', $p['view']) . '.blade.php', $blade, $force);
}

// ---------- 5. Routes ----------
$routes = "<?php\n\n// Dibuat otomatis oleh laravel-kit/convert.php dari page-map.json. Ubah page-map.json lalu jalankan ulang, jangan edit manual.\n"
    . "// URI sengaja = nama file HTML tanpa .html: assets/js/app.js (hak akses & menu aktif) mengenali halaman dari segmen URL terakhir.\n"
    . "// Nama route sudah dikelompokkan per modul; saat halaman diganti controller, cukup ganti Route::view-nya.\n\n"
    . "use Illuminate\\Support\\Facades\\Route;\n";
foreach ($map['groups'] as $g) {
    $routes .= "\n// " . $g['label'] . "\n";
    foreach ($g['pages'] as $p) {
        $routes .= sprintf("Route::view(%s, %s)->name(%s);\n", var_export($p['uri'], true), var_export($p['view'], true), var_export($p['route'], true));
        if ($p['uri'] === '/') $routes .= sprintf("Route::view('/index', %s);\n", var_export($p['view'], true));
    }
}
$routes .= "\n// Link lama berakhiran .html → URL baru\nRoute::get('/{page}.html', fn (string \$page) => redirect('/' . (\$page === 'index' ? '' : \$page)))->where('page', '[a-z0-9-]+');\n";
put("$to/routes/prototype.php", $routes, true);

if (isset($opt['register'])) {
    $web = "$to/routes/web.php";
    $code = is_file($web) ? file_get_contents($web) : "<?php\n";
    if (strpos($code, "prototype.php") === false) {
        put($web, rtrim($code) . "\n\n// Halaman prototype EquipRent (laravel-kit)\nrequire __DIR__.'/prototype.php';\n", true);
    } else $skipped[] = 'routes/web.php (sudah me-require prototype.php)';
} elseif (strpos((string) @file_get_contents("$to/routes/web.php"), 'prototype.php') === false) {
    $warnings[] = "routes/prototype.php belum didaftarkan. Tambahkan di routes/web.php:  require __DIR__.'/prototype.php';  (atau jalankan ulang dengan --register)";
}

// ---------- Ringkasan ----------
foreach ($unknownLinks as $l => $files) $warnings[] = "Link ke $l tidak ada di skema (dibiarkan) di: " . implode(', ', array_unique($files));
echo ($dry ? "[DRY RUN] " : '') . count($written) . " file ditulis, " . count($skipped) . " dilewati (sudah ada; pakai --force untuk menimpa)\n";
foreach ($skipped as $s) echo "  - lewati: $s\n";
if ($warnings) { echo "\nPeringatan:\n"; foreach ($warnings as $w) echo "  ! $w\n"; }
echo "\nSelesai. Jalankan: php artisan serve  → buka http://127.0.0.1:8000/login\n";

// =====================================================================

function fail($msg) { fwrite(STDERR, "ERROR: $msg\n"); exit(1); }

function put($path, $content, $overwrite) {
    global $dry, $written, $skipped, $to;
    $rel = str_replace('\\', '/', substr($path, strlen($to) + 1));
    if (is_file($path) && !$overwrite) { $skipped[] = $rel; return; }
    $written[] = $rel;
    if ($dry) { echo "  + $rel\n"; return; }
    if (!is_dir(dirname($path))) mkdir(dirname($path), 0777, true);
    file_put_contents($path, $content);
}

// x.html → x (relatif). Hanya nama yang ada di skema; sisanya dicatat sebagai peringatan.
function rewriteLinks($text, $where) {
    global $slug, $unknownLinks;
    return preg_replace_callback('/(?<![\w\/.-])([a-z0-9][a-z0-9-]*)\.html\b/i', function ($m) use ($slug, $where, &$unknownLinks) {
        $f = strtolower($m[1]) . '.html';
        if (isset($slug[$f])) return $slug[$f];
        $unknownLinks[$f][] = $where;
        return $m[0];
    }, $text);
}

// Teks prototype jangan sampai dibaca sebagai sintaks Blade
function escapeBlade($text) {
    $text = str_replace(['{{', '{!!'], ['@{{', '@{!!'], $text);
    return preg_replace('/(?<![\w@])@(?=(?:' . BLADE_DIRECTIVES . ')\b)/', '@@', $text);
}

// src/href/url() ke assets/ → asset()
function assetUrls($text) {
    $text = preg_replace('/\b(src|href)="(assets\/[^"]+)"/', '$1="{{ asset(\'$2\') }}"', $text);
    return preg_replace('/url\(([\'"]?)(assets\/[^\'")]+)\1\)/', 'url($1{{ asset(\'$2\') }}$1)', $text);
}

function bladeText($text, $where) { return assetUrls(escapeBlade(rewriteLinks($text, $where))); }

// Ambil isi elemen yang tag pembukanya cocok $openRe, sampai tag penutup yang seimbang
function extractElement($html, $openRe, $tag = 'div') {
    if (!preg_match($openRe, $html, $m, PREG_OFFSET_CAPTURE)) return null;
    $start = $m[0][1]; $innerStart = $start + strlen($m[0][0]);
    $depth = 1;
    preg_match_all('/<(\/?)' . $tag . '\b[^>]*>/i', $html, $tags, PREG_OFFSET_CAPTURE, $innerStart);
    foreach ($tags[0] as $i => $t) {
        $depth += $tags[1][$i][0] === '/' ? -1 : 1;
        if ($depth === 0) return ['open' => $m[0][0], 'inner' => substr($html, $innerStart, $t[1] - $innerStart), 'start' => $start, 'end' => $t[1] + strlen($t[0])];
    }
    return null;
}

function convertAppPage($src, $p) {
    global $warnings;
    $where = $p['html'];
    preg_match('/<head>(.*?)<\/head>/is', $src, $hm);
    preg_match('/<body[^>]*>(.*)<\/body>/is', $src, $bm);
    $head = $hm[1] ?? ''; $body = $bm[1] ?? '';

    // Head: buang yang sudah ada di layout, sisanya (style/link tambahan) → @push('head')
    $extraHead = preg_replace('/<meta charset[^>]*>|<meta name="viewport"[^>]*>|<title>.*?<\/title>/is', '', $head);
    foreach (STANDARD_HEAD as $href) $extraHead = preg_replace('/<link href="' . preg_quote($href, '/') . '" rel="stylesheet">/', '', $extraHead);
    $extraHead = trim($extraHead);

    $wrap = extractElement($body, '/<div class="app-wrapper"[^>]*>/');
    $content = $wrap ? extractElement($wrap['inner'], '/<div class="app-content"[^>]*>/') : null;
    if (!$wrap || !$content) { $warnings[] = "$where: kerangka app-wrapper/app-content tidak ditemukan, dikonversi sebagai standalone"; return convertStandalone($src, $p); }

    // Class tambahan di sidebar (mis. driver-sidebar di portal driver) → @section('sidebar_class')
    $sidebarClass = preg_match('/<aside class="app-sidebar([^"]*)"/', $wrap['inner'], $am) ? trim($am[1]) : '';
    // Kerangka di luar app-content harus sama persis dgn layout, kalau tidak beri peringatan
    $shell = preg_replace('/\s+/', '', substr($wrap['inner'], 0, $content['start']) . substr($wrap['inner'], $content['end']));
    $shell = str_replace('class="app-sidebar' . preg_replace('/\s+/', '', $am[1] ?? '') . '"', 'class="app-sidebar"', $shell);
    if ($shell !== '<asideclass="app-sidebar"id="appSidebar"></aside><divclass="sidebar-overlay"id="sidebarOverlay"onclick="closeSidebar()"></div><mainclass="app-main"><headerclass="app-header"id="appHeader"></header></main>')
        $warnings[] = "$where: ada elemen di luar app-content yang tidak ikut ke layout, cek manual";
    $contentAttrs = trim(preg_replace('/^<div\s+class="app-content"\s*|>$/', '', $content['open']));

    $after = substr($body, $wrap['end']);
    $scriptPos = stripos($after, '<script');
    $modals = trim($scriptPos === false ? $after : substr($after, 0, $scriptPos));
    $scripts = $scriptPos === false ? '' : rtrim(substr($after, $scriptPos));

    $title = preg_match('/<title>(.*?)<\/title>/is', $head, $tm) ? preg_replace('/\s*-\s*EquipRent Enterprise\s*$/', '', trim($tm[1])) : $p['title'];

    $out = "{{-- Dikonversi dari {$p['html']} oleh laravel-kit/convert.php. Grup menu: {$p['group']}. Route: {$p['route']} --}}\n@extends('layouts.app')\n\n";
    $out .= "@section('title')" . escapeBlade($title) . "@endsection\n";
    if ($contentAttrs !== '') $out .= "@section('content_attrs'){$contentAttrs}@endsection\n";
    if ($sidebarClass !== '') $out .= "@section('sidebar_class'){$sidebarClass}@endsection\n";
    if ($extraHead !== '') $out .= "\n@push('head')\n  " . bladeText($extraHead, $where) . "\n@endpush\n";
    $out .= "\n@section('content')\n" . rtrim(bladeText(dedent($content['inner']), $where)) . "\n@endsection\n";
    if ($modals !== '') $out .= "\n@section('modals')\n  " . bladeText($modals, $where) . "\n@endsection\n";
    if ($scripts !== '') $out .= "\n@push('scripts')\n  " . bladeText($scripts, $where) . "\n@endpush\n";
    return $out;
}

// Halaman berdiri sendiri (login, redirect): seluruh file, hanya link & aset yang disesuaikan
function convertStandalone($src, $p) {
    return "{{-- Dikonversi dari {$p['html']} oleh laravel-kit/convert.php (halaman berdiri sendiri, tanpa layout). Route: {$p['route']} --}}\n" . bladeText($src, $p['html']);
}

// Isi app-content di prototype menjorok 8 spasi; rapikan jadi 2
function dedent($s) {
    return preg_replace('/^      /m', '', $s);
}

function listPages($map) {
    foreach ($map['groups'] as $g) {
        echo "\n" . $g['label'] . "\n";
        foreach ($g['pages'] as $p)
            printf("  %-28s %-28s %-48s %s\n", $p['html'], $p['uri'], 'resources/views/' . str_replace('.', '/', $p['view']) . '.blade.php', $p['layout'] === 'app' ? '' : '(standalone)');
    }
}
