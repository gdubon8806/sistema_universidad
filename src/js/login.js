const mostrarContrasena = document.getElementById('mostrarContrasena');
if (mostrarContrasena) {
    mostrarContrasena.addEventListener('change', function () {
        const contrasenaInput = document.getElementById('contrasena');
        if (contrasenaInput) {
            contrasenaInput.type = this.checked ? 'text' : 'password';
        }
        const confirm = document.getElementById('confirmarContrasena');
        if (confirm) {
            confirm.type = this.checked ? 'text' : 'password';
        }
    });
}