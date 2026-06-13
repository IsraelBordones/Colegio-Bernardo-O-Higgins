// Ruta de tu BFF (Asegúrate de que el puerto sea el que usa tu Spring Boot del BFF)
const API_URL = "http://localhost:8080/api/bff";

export const login = async (username, password) => {
    let response;
    try {
        response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
    } catch (networkError) {
        // Error de red o CORS: el BFF no está corriendo o no es alcanzable
        console.error("Error de red en authService:", networkError);
        throw new Error(
            `No se pudo conectar al servidor (${API_URL}). ` +
            `Verifica que el BFF esté corriendo con "docker compose up -d".`
        );
    }

    if (!response.ok) {
        // El servidor respondió con un código de error (401, 500, etc.)
        let errorMsg = `Error HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData || errorMsg;
        } catch (_) {
            // La respuesta no era JSON; usamos el mensaje genérico
        }
        console.error("Error del servidor en authService:", errorMsg);
        throw new Error(errorMsg);
    }

    const userData = await response.json();
    console.log("Respuesta del BFF:", userData); // Útil para depurar el campo rol
    return userData;
};