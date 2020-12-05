export default function validarCrearCuenta(valores) {

    let errores = {};

    // Validar el nombre del usuario
    if (!valores.nombre) {
        errores.nombre = "El Nombre  es obligatorio";
    }

    // validar empresa
    if (!valores.apellido) {
        errores.apellido = "El apellido es obligatorio";
    }

    // validar edad
    if (!valores.edad) {
        errores.edad = "La edad es obligatoria";
    }

    // validar descripción
    if (!valores.descripcion) {
        errores.descripcion = "Agrega una descripción";
    }

    return errores;
}