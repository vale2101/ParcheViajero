import PerfilScreen from '../src/screens/Usuario/PerfilScreen';

// Ruta alterna para ver el perfil del viajero con su drawer sin pasar por el login.
// Se abre en /vista_perfil
// Sin sesión no hay nombre ni correo, y "Mis reseñas" se queda en "Cargando…";
// lo que sí se puede probar es el ícono de apagar, el drawer y sus opciones.
export default function VistaPerfil() {
  return <PerfilScreen />;
}
