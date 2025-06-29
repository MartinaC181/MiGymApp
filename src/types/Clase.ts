// Definir tipos para las clases
export interface Clase {
    id: number;
    nombre: string;
    descripcion: string;
    diasHorarios: { [key: string]: string[] };
    activa: boolean;
    cupoMaximo: number;
}

// Tipos para el formulario
export interface ClaseFormData {
    nombre: string;
    descripcion: string;
    cupoMaximo: string;
    activa: boolean;
    diasSeleccionados: { [key: string]: boolean };
    horariosInput: { [key: string]: string };
}

// Días de la semana
export const diasSemana = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
]; 