async function procesarLogin(event) {
    event.preventDefault();
    console.log("Formulario enviado");

    //Obtienes los elementos del front
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    //Peticion al back para validar el login y redirigir 
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            //Se envia el usuario por la URL para validar la sesion
            const username = encodeURIComponent(JSON.stringify(data.userFound.username));
            //Se redirige
            window.location.href = `/dashboard?username=${username}`;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error al procesar el inicio de sesión:', error);
        alert('Error en el servidor. Por favor, inténtelo de nuevo.');
    }
}


