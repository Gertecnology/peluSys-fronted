import { Document, Page, Text, View, PDFViewer } from '@react-pdf/renderer';

const Informe = ({ data }) => {
    return (
        <PDFViewer width="800" height="600">
            <Document>
                {data.map((item, index) => (
                    <Page key={index}>
                        <View>
                            <Text>{`Nombre: ${item.nombre}`}</Text>
                            <Text>{`Edad: ${item.edad}`}</Text>
                            <Text>{`Ocupación: ${item.ocupacion}`}</Text>
                        </View>
                    </Page>
                ))}
            </Document>
        </PDFViewer>
    );
};

export default Informe;