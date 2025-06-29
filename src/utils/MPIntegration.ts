import { MP_ACCESS_TOKEN } from "../../config.json";

export const handleIntegrationMercadoPago = async () => {
    const preference = {
        "items": [
            {
                "id": "Sound system",
                "title": "Cuota mensual",
                "description": "Cuota mensual",
                "picture_url": "https://www.myapp.com/myimage.jpg",
                "category_id": "other",
                "quantity": 1,
                "currency_id": "$",
                "unit_price": 10000
            }
        ]
    }

    try {
        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MP_ACCESS_TOKEN}`
            },
            body: JSON.stringify(preference)

        })

        const data = await response.json();
        
        // Redirigir a la página de mercado pago
        return data.init_point;
    } catch (error) {
        console.error(error);
    }
}
