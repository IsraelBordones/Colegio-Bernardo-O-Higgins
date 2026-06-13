// Ruta de tu BFF (Asegúrate de que el puerto sea el que usa tu Spring Boot del BFF)
const API_URL = "http://localhost:8080/api/bff";



export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error en la autenticación');
        }

        return await response.json();
    } catch (error) {
        console.error("Error en authService:", error);
        throw error;
    }
};
