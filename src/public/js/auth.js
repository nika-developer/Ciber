async function procesarLogin(event) {
    event.preventDefault();
    console.log("Formulario enviado");

    // Obtiene los valores de los campos de entrada
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
                text: data.message,
                confirmButtonColor: "#3085d6",
            }).then(() => {
                // Se envía el usuario por la URL para validar la sesión
                const username = encodeURIComponent(JSON.stringify(data.userFound.username));
                // Redirige al dashboard
                if (data.userFound.username === 'admin') {
                    window.location.href = `/admin-dashboard?username=${username}`;
                }else{
                    window.location.href = `/dashboard?username=${username}`;
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: data.message,
                confirmButtonColor: "#d33",
            });
        }
    } catch (error) {
        console.error('Error al procesar el inicio de sesión:', error);
        Swal.fire({
            icon: "error",
            title: "¡Error en el servidor!",
            text: "Por favor, inténtelo de nuevo.",
            confirmButtonColor: "#d33",
        });
    }
}
