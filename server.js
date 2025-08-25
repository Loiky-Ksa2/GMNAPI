// server.js

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const port = 3000;

// Middleware para servir archivos estáticos (nuestro frontend)
app.use(express.static('public'));
// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Inicializar el cliente de la API de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint para el chat
app.post('/chat', async (req, res) => {
    try {
        const userInput = req.body.prompt;
        if (!userInput) {
            return res.status(400).json({ error: 'El prompt es requerido' });
        }

        // Seleccionamos el modelo gemini-pro
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(userInput);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("Error al comunicarse con la API de Gemini:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});