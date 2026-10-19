import ServiciosAdminLista from '../../components/ServiciosAdminLista';

export default function AdminServiciosScreen() {
  return (
    <ServiciosAdminLista
      titulo="Historial de servicios"
      subtitulo="Todos los servicios de la plataforma"
      tabs={[
        { valor: 'todos', etiqueta: 'Todos' },
        { valor: 'pendiente', etiqueta: 'Pendientes' },
        { valor: 'aprobado', etiqueta: 'Aprobados' },
        { valor: 'rechazado', etiqueta: 'Rechazados' },
      ]}
      vacios={{ todos: 'Aún no hay servicios registrados' }}
    />
  );
}