import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../src/components/Button';
import ServicioFichaModal from '../src/components/ServicioReviewModal';
import type { Servicio } from '../src/api/servicio';

// Datos de mentiras solo para ver cómo se ve la ficha
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
    };

    export default function PruebaFicha() {
    const [visible, setVisible] = useState(true);

    return (
        <View style={styles.screen}>
        <Button text="Abrir ficha" onPress={() => setVisible(true)} />
        <ServicioFichaModal
            visible={visible}
            servicio={servicioFalso}
            onClose={() => setVisible(false)}
        />
        </View>
    );
    }

    const styles = StyleSheet.create({
    screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FDFBF6' },
    });