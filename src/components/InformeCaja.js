import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Button } from 'react-bootstrap';


const InformeCaja = ({ data, fecha }) => {
    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const title = `PeluSys - Informe de Caja dia ${fecha}`;
        doc.setFontSize(16);

        // Centrar el título en la cabecera
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2;
        const titleY = 10; // Posición vertical de la cabecera, ajusta según tus necesidades

        // Dibujar el título en la cabecera
        doc.text(title, titleX, titleY);

        let contentY = 30; // Posición vertical del contenido, ajusta según tus necesidades

        // Crear un arreglo temporal para manejar el caso de un solo elemento
        const dataArray = Array.isArray(data) ? data : [data];

        // Generar el contenido del PDF utilizando map
        dataArray.map((item, index) => {
            const aperturaCaja = item.aperturaCaja;
            const arqueoCaja = item.arqueoCaja;

            doc.text(`Monto de Apertura de Caja: ${aperturaCaja.monto}`, 10, contentY);
            doc.text(`Monto Teórico de Arqueo de Caja: ${arqueoCaja.montoTeorico}`, 10, contentY + 10);
            doc.text(`Monto Real de Arqueo de Caja: ${arqueoCaja.montoReal}`, 10, contentY + 20);
            contentY += 40; // Incrementa la posición vertical para los datos adicionales

            // Dibuja una línea horizontal debajo de los datos adicionales
            doc.setLineWidth(0.5);
            doc.line(10, contentY, pageWidth - 10, contentY);
            contentY += 10; // Incrementa la posición vertical para la línea horizontal
        });

        doc.save(`InformeCaja.pdf`);
    };


    return (
        <div className="flex flex-col">
            <h2 className="text-xl mb-4">{`Desea Imprimir un Informe de los moviemientos de la caja del dia ${fecha}? `}</h2>
            <div className="flex justify-end">
                <Button variant='success' onClick={generatePDF}>Imprimir</Button>
            </div>
        </div>


    );
};

export default InformeCaja;
