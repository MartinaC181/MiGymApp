import { MP_ACCESS_TOKEN } from "../../config.json";

export const handleIntegrationMercadoPago = async ({quotaDescription, monto}) => {
    const preference = {
        "items": [
            {
                "id": "Sound system",
                "title": "Cuota mensual",
                "description": quotaDescription,
                "picture_url": "https://i.imgur.com/77AE5KG.png",
                "category_id": "other",
                "quantity": 1,
                "currency_id": "ARS",
                "unit_price": monto
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
