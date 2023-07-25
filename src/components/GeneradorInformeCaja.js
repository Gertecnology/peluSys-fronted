import { formatearDinero } from "@/helpers";
import { useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    table: {
        display: 'table',
        width: 'auto',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        alignItems: 'center',
        height: 30,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#f0f0f0',
    },
    tableHeader: {
        width: '20%',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableData: {
        width: '20%',
        fontSize: 10,
        textAlign: 'center',
    },
    tableFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 30,
        marginTop: 10,
    },
    tableFooter: {
        width: '20%',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    tableCol: {
        width: '33.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5
    },
    // Estilos para el tfoot
    tableFooter: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        fontWeight: 'bold',
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
    },
    tableFooterCell: {
        fontSize: 12,
        padding: 8,
        textAlign: 'center',
    },
});

const GeneradorInformeCaja = ({ data, totalPeriodo, clientes, texto, fechaInicio, fechaCierre }) => {
    const [clientesArr, setClientesArr] = useState(clientes)




    const formatearCliente = (id) => {
        const cliente = clientes?.find(cliente => cliente.id === id);
        return cliente?.nombre;
    }

    const calcularTotalSubtotalesFactura = (data) => {
        let totalSubtotales = 0;

        if (data.facturaList && Array.isArray(data.facturaList)) {
            data.facturaList.forEach((factura) => {
                if (factura.detalles && Array.isArray(factura.detalles)) {
                    factura.detalles.forEach((detalle) => {
                        totalSubtotales += detalle.subtotal;
                    });
                }
            });
        }

        return totalSubtotales;
    };

    return (
        <Document>
            {data.map((data, index) => (
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.title}>PeluSys - Informe de Cajas</Text>
                        <Text style={styles.subtitle}>Periodo: {fechaInicio} - {fechaCierre}</Text>
                        <Text style={styles.subtitle}>Cajero: {data.aperturaCaja?.empleadoNombre} {data.aperturaCaja?.empleadoApellido}</Text>
                        <Text style={styles.subtitle}>Caja: {data.caja?.detalle}</Text>
                        <Text style={styles.subtitle}>Monto de Apertura: {formatearDinero(data.aperturaCaja?.monto)}</Text>
                        <Text style={styles.subtitle}>Monto de Cierre: {formatearDinero(data.arqueoCaja?.montoReal)}</Text>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={styles.tableHeader}>Nro. Factura</Text>
                                <Text style={styles.tableHeader}>Cliente</Text>
                                <Text style={styles.tableHeader}>Monto Total de Factura</Text>
                            </View>
                            {data.facturaList?.map((factura, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableData}>{factura?.numero_factura}</Text>
                                    <Text style={styles.tableData}>{formatearCliente(factura?.cliente_id)}</Text>
                                    <Text style={styles.tableData}>{formatearDinero(factura?.precio_total)}</Text>
                                </View>
                            ))}
                            {/* Footer de la tabla */}

                            <View style={styles.tableFooter}>
                                <Text style={styles.tableFooterCell}>Monto Total de Facturas:</Text>
                                <Text style={styles.tableFooterCell}></Text>
                                <Text style={styles.tableFooterCell}>{formatearDinero(calcularTotalSubtotalesFactura(data))}</Text>
                            </View>
                        </View>
                    </View>
                </Page>
            ))}
        </Document>

    );
};

export default GeneradorInformeCaja;
