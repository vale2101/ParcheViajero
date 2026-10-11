import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../src/components/Button';
import ServicioFichaModal from '../src/components/ServicioResenaModal';
import ServicioReviewModal from '../src/components/ServicioReviewModal';
import type { Resena } from '../src/api/resena';
import type { Servicio } from '../src/api/servicio';

// Datos de mentiras para ver la ficha sin backend
const servicioFalso: Servicio = {
_id: '1',
usuario_id: 'u1',
categoria_id: 'Restaurante',
municipio_id: 'Manizales',
nombre: 'Mondongos y más',
descripcion:
'Comida típica caldense en pleno centro de Manizales. Ambiente familiar y porciones generosas, ideal para conocer el sabor de la región.',
direccion: 'Cra 23 # 45-67, Manizales',
latitud: 5.0703,
longitud: -75.5138,
telefono: '300 123 4567',
horario_atencion: 'Lun a dom, 8am - 8pm',
//servicios: ['Almuerzo ejecutivo', 'Domicilios', 'Reservas'],
};

// 5 reseñas falsas: 5, 5, 5, 5 y 4 estrellas (promedio 4.8)
// La ficha muestra la última del arreglo (hace 2 días)
const calificaciones = [5, 5, 5, 5, 4];
const resenasFalsas: Resena[] = calificaciones.map((calificacion, i) => ({
_id: `r${i}`,
usuario_id: 'x',
servicio_id: '1',
calificacion,
comentario: 'Excelente sabor y buena atención, volveré pronto.',
fecha: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
}));

export default function PruebaFicha() {
const [ficha, setFicha] = useState(true);
const [resenando, setResenando] = useState(false);

return (
<View style={styles.screen}>
    <Button text="Abrir ficha" onPress={() => setFicha(true)} />

    {/* Primero la ficha */}
    <ServicioFichaModal
    visible={ficha && !resenando}
    servicio={servicioFalso}
    onClose={() => setFicha(false)}
    onDejarResena={() => setResenando(true)}
    resenasDemo={resenasFalsas}
    autorDemo="Laura G."
    />

    {/* Y desde "Dejar reseña" se abre este */}
    <ServicioReviewModal
    visible={resenando}
    servicio={servicioFalso}
    onClose={() => setResenando(false)}
    />
</View>
);
}

const styles = StyleSheet.create({
screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FDFBF6' },
});