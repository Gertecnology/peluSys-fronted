import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Button } from 'react-bootstrap';

const InformeCompra = ({ data, nombre, fecha, proveedores, marcas, isVisible }) => {
    const [proveedoresArray, setProveedoresArray] = useState(proveedores);
    const [marcasArray, setMarcasArray] = useState(marcas);



    const formatearProveedor = (id) => {
        const proveedor = proveedoresArray?.find(p => p.id === id);
        return proveedor?.nombre
    }

    const formatearMarca = (id) => {
        const marca = marcasArray?.find(p => p.id === id);
        return marca?.nombre
    }


    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        const title = `PeluSys - Productos Más Comprados ${fecha}`;
        doc.setFontSize(16);

        // Centrar el título en la cabecera
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2;
        const titleY = 10; // Posición vertical de la cabecera, ajusta según tus necesidades

        // Dibujar el título en la cabecera
        doc.text(title, titleX, titleY);


        let contentY = 30; // Posición vertical del contenido, ajusta según tus necesidades

        // Mostrar el contenido del bucle data.map()
        data.map((item) => {
            doc.text(`Nombre: ${item.productos.nombre}`, 10, contentY);
            doc.text(`Cantidad: ${item.cantidad}`, 10, contentY + 10);
            doc.text(`Descripción: ${item.productos.detalle}`, 10, contentY + 20);
            doc.text(`Precio de Compra: ${item.productos.precioCompra}`, 10, contentY + 30);
            doc.text(`Precio de Venta: ${item.productos.precioVenta}`, 10, contentY + 40);
            doc.text(`Proveedor del Producto: ${formatearProveedor(item.productos.id_proveedor)}`, 10, contentY + 50);
            doc.text(`Marca del Producto: ${formatearMarca(item.productos.id_marca)}`, 10, contentY + 60);
            contentY += 70; // Incrementa la posición vertical para la siguiente entrada

            // Dibuja una línea horizontal debajo del elemento
            doc.setLineWidth(0.5);
            doc.line(10, contentY, pageWidth - 10, contentY);
            contentY += 10; // Incrementa la posición vertical para la línea horizontal
        });

        doc.save(`${nombre}.pdf`);
    };



    return (
        <div className="flex flex-col">
            <h2 className="text-xl mb-4">{`Desea Imprimir un Informe de Compras del Dia ${fecha}? `}</h2>
            <div className="flex justify-end">
                <Button variant='success' onClick={generatePDF}>Imprimir</Button>
            </div>
        </div>


    );
};

export default InformeCompra;
