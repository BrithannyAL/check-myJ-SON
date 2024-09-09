document.getElementById("uploadBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const message = document.getElementById("message");

    if (!fileInput.files.length) {
        message.textContent = "Por favor seleccione un archivo.";
        return;
    }
    
    const file = fileInput.files[0];
    if (file.type !== "application/json") {
        message.textContent = "El archivo debe ser de tipo .json.";
        return;
    }

    if (file.size > 1048576) { // 1MB
        message.textContent = "El archivo no debe exceder 1MB.";
        return;
    }

    message.textContent = "Cargando archivo...";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch('http://127.0.0.1:8000/upload/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            message.textContent = "Archivo subido exitosamente.";
        } else {
            message.textContent = "Error al subir el archivo.";
        }
    } catch (error) {
        //message.textContent = "Error al conectar con el servidor.";
        message.textContent = error;
        console.log(error);
        //esperar unos segundos
        await new Promise(resolve => setTimeout(resolve, 50000));        
    }
});

document.getElementById("validateBtn").addEventListener("click", async () => {
    const message = document.getElementById("message");
    const validationResults = document.getElementById("validationResults");

    message.textContent = "Validando archivos...";

    try {
        const response = await fetch('http://127.0.0.1:8000/validate/');

        if (response.ok) {
            const files = await response.json();
            validationResults.innerHTML = "<h2>Resultados de Validación</h2>";
            files.forEach(file => {
                validationResults.innerHTML += `<p>El archivo llamado "${file.name}": <br> -> Tiene un tamaño de ${file.size} MB <br> ->Su validez es: ${file.validation}</p>`;
            });
            message.textContent = "Validación completada.";
        } else {
            message.textContent = "Error al validar los archivos.";
        }
    } catch (error) {
        message.textContent = "Error al conectar con el servidor.";
    }
});
