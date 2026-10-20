import ServiciosAdminLista from '../../components/ServiciosAdminLista';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSolicitudesScreen() {
  const { resumen } = useAdmin();
  const n = resumen?.pendientes;

  return (
    <ServiciosAdminLista
      titulo="Solicitudes"
      subtitulo={n === undefined ? 'Servicios enviados a revisión' : `${n} ${n === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'} de revisión`}
      tabs={[
        { valor: 'pendiente', etiqueta: n ? `Pendientes (${n})` : 'Pendientes' },
        { valor: 'aprobado', etiqueta: 'Aprobados' },
        { valor: 'rechazado', etiqueta: 'Rechazados' },
      ]}
      vacios={{
        pendiente: 'No hay solicitudes pendientes. ¡Todo al día!',
        aprobado: 'Aún no hay servicios aprobados',
        rechazado: 'Aún no hay servicios rechazados',
      }}
    />
  );
}