// Mostrar contraseña
const pass = document.getElementById('contrasena');
document.getElementById('mostrarContrasena').addEventListener('change', function() {
    const tipo = this.checked ? 'text' : 'password';
    pass.type = tipo;
});

// Manejar el login
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('contrasena').value;
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena: password })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            // Redirigir o mostrar mensaje de éxito
            window.location.href = '../index.html';
        } else {
            loginError.textContent = data.message || 'Error de autenticación';
            loginError.style.display = 'block';
        }
    } catch (err) {
        loginError.textContent = 'Error de conexión con el servidor';
        loginError.style.display = 'block';
    }
});