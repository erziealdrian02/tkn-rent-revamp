<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — EquipRent Enterprise</title>
    <meta name="description" content="EquipRent Enterprise Equipment Rental & Asset Management System">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="{{ asset('assets/css/style.css') }}" rel="stylesheet">
    <style>
        .login-split { display:flex; height:100vh; width:100vw; overflow:hidden; }
        .login-image { flex:0 0 75%; background:url('{{ asset('assets/images/background-login.jpg') }}') no-repeat center center; background-size:cover; position:relative; }
        .login-image-overlay { position:absolute; inset:0; background:linear-gradient(to right,rgba(0,0,0,0.2),rgba(15,23,42,0.9)); display:flex; flex-direction:column; justify-content:flex-end; padding:60px; color:white; }
        .login-form-container { flex:0 0 25%; background:var(--bg-card); display:flex; flex-direction:column; justify-content:center; padding:40px; box-shadow:-5px 0 25px rgba(0,0,0,0.1); z-index:10; overflow-y:auto; }
        .login-brand-split { display:flex; flex-direction:column; align-items:center; margin-bottom:30px; text-align:center; }
        .login-brand-icon-split { width:56px; height:56px; background:var(--primary); color:white; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:28px; margin-bottom:16px; box-shadow:0 4px 15px rgba(37,99,235,0.3); }
        .login-brand-split h1 { font-size:24px; font-weight:700; color:var(--text-primary); margin:0 0 4px; letter-spacing:-0.5px; }
        .login-brand-split p { font-size:13px; color:var(--text-secondary); margin:0; }
        .login-footer-split { margin-top:40px; text-align:center; font-size:11px; color:var(--text-muted); }
        @media (max-width:1200px) { .login-image { flex:0 0 65%; } .login-form-container { flex:0 0 35%; padding:30px; } }
        @media (max-width:992px) { .login-image { flex:0 0 50%; } .login-form-container { flex:0 0 50%; } .login-image-overlay { padding:40px; } }
        @media (max-width:768px) { .login-image { display:none; } .login-form-container { flex:1; padding:24px; justify-content:center; } }
    </style>
</head>
<body>
    <div class="login-split">
        <div class="login-image">
            <div class="login-image-overlay">
                <h2 class="display-5 fw-bold text-white mb-2">EquipRent Enterprise</h2>
                <p class="fs-5 text-white-50 mb-0">Next-generation equipment rental and logistics management system.</p>
            </div>
        </div>
        <div class="login-form-container">
            <div class="login-brand-split">
                <div class="login-brand-icon-split"><i class="bi bi-gear-wide-connected"></i></div>
                <h1>Welcome Back</h1>
                <p>Please sign in to your account</p>
            </div>
            <form id="loginForm" method="POST" action="{{ route('login') }}">
                @csrf
                <div class="mb-3">
                    <label class="form-label form-label-er" for="username">Username</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input type="text" class="form-control @error('username') is-invalid @enderror" id="username" name="username" placeholder="Enter username" value="{{ old('username', 'admin') }}" required>
                    </div>
                    @error('username')
                        <div class="text-danger fs-12 mt-1">{{ $message }}</div>
                    @enderror
                </div>
                <div class="mb-3">
                    <label class="form-label form-label-er" for="password">Password</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-lock"></i></span>
                        <input type="password" class="form-control @error('password') is-invalid @enderror" id="password" name="password" placeholder="Enter password" required>
                        <button class="btn btn-outline-secondary" type="button" onclick="togglePassword()">
                            <i class="bi bi-eye" id="pwdIcon"></i>
                        </button>
                    </div>
                    @error('password')
                        <div class="text-danger fs-12 mt-1">{{ $message }}</div>
                    @enderror
                </div>
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember" name="remember">
                        <label class="form-check-label fs-13" for="remember">Remember me</label>
                    </div>
                    <a href="#" class="fs-12 text-primary text-decoration-none">Forgot password?</a>
                </div>
                <button type="submit" class="btn btn-primary w-100" id="loginBtn" style="padding:10px 0;">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Sign In
                </button>
                @if(session('error'))
                    <div class="alert alert-danger mt-3 py-2 fs-12">
                        <i class="bi bi-exclamation-circle me-1"></i> {{ session('error') }}
                    </div>
                @endif
            </form>
            <div class="login-footer-split">
                <p class="mb-1">&copy; 2026 PT EquipRent Indonesia.<br>All rights reserved.</p>
            </div>
        </div>
    </div>
    <script>
        const saved = localStorage.getItem('er_theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        function togglePassword() {
            const pwd = document.getElementById('password');
            const icon = document.getElementById('pwdIcon');
            if (pwd.type === 'password') { pwd.type = 'text'; icon.className = 'bi bi-eye-slash'; }
            else { pwd.type = 'password'; icon.className = 'bi bi-eye'; }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
