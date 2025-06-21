document.getElementById('mostrarContrasena').addEventListener('change', function () {
    const contrasenaInput = document.getElementById('contrasena');
    contrasenaInput.type = this.checked ? 'text' : 'password';
});