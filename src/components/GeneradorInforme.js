import { formatearDinero } from "@/helpers";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        fontSize: 12,
        padding: 20,
    },
    section: {
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    table: {
        width: '100%',
        marginTop: 10,
    },
    tableHeaderRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#000',
        color: '#fff',
        padding: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    headerName: {
        flex: 3,
    },
    headerQuantity: {
        flex: 1,
    },
    headerBrand: {
        flex: 1,
    },
    headerProvider: {
        flex: 1,
    },
    headerUnitPrice: {
        flex: 2,
    },
    headerTotalPrice: {
        flex: 2,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableData: {
        flex: 1,
        padding: 8,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    dataName: {
        flex: 3,
    },
    dataQuantity: {
        flex: 1,
    },
    dataBrand: {
        flex: 1,
    },
    dataProvider: {
        flex: 1,
    },
    dataUnitPrice: {
        flex: 2,
    },
    dataTotalPrice: {
        flex: 2,
    },
    tableFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    tableFooter: {
        backgroundColor: '#f00',
        color: '#fff',
        padding: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    footerTotalLabel: {
        flex: 1,
        marginRight: 10,
    },
    footerTotalValue: {
        flex: 1,
    },
});


const GeneradorInforme = ({ data, totalPeriodo, nombre, texto, fechaInicio, fechaCierre }) => {


    function calcularPrecioTotal(producto, cantidad) {
        return formatearDinero(cantidad * producto.precioVenta);
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>PeluSys - {nombre}</Text>
                    <Text style={styles.subtitle}>Periodo: {fechaInicio} - {fechaCierre}</Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.table}>
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.tableHeader, styles.headerName]}>Nombre</Text>
                            <Text style={[styles.tableHeader, styles.headerQuantity]}>Cantidad</Text>
                            <Text style={[styles.tableHeader, styles.headerBrand]}>Marca</Text>
                            <Text style={[styles.tableHeader, styles.headerProvider]}>Proveedor</Text>
                            <Text style={[styles.tableHeader, styles.headerUnitPrice]}>Precio Unitario</Text>
                            <Text style={[styles.tableHeader, styles.headerTotalPrice]}>Precio Total Venta</Text>
                        </View>
                        {data.map((producto, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableData, styles.dataName]}>{producto.productos.nombre}</Text>
                                <Text style={[styles.tableData, styles.dataQuantity]}>{producto.cantidad}</Text>
                                <Text style={[styles.tableData, styles.dataBrand]}>{producto.marca}</Text>
                                <Text style={[styles.tableData, styles.dataProvider]}>{producto.proveedor}</Text>
                                <Text style={[styles.tableData, styles.dataUnitPrice]}>{formatearDinero(producto.productos.precioVenta)}</Text>
                                <Text style={[styles.tableData, styles.dataTotalPrice]}>{calcularPrecioTotal(producto.productos, producto.cantidad)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.tableFooterRow}>
                    <Text style={[styles.tableFooter, styles.footerTotalLabel]}>{texto}</Text>
                    <Text style={[styles.tableFooter, styles.footerTotalValue]}>{formatearDinero(totalPeriodo)}</Text>
                </View>
            </Page>
        </Document>

    );
};

export default GeneradorInforme;
