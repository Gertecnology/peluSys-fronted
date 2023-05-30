const convertidorIva = (value) => {
    if (value === 0.1 || value === 1) {
        return 10;
    }
    else {
        return 5;
    }
}

const covnertidorMarca = (marcas, id) => {
    const marca = marcas.find(m => m.id === id);
    return marca?.nombre
}

const convertidorProveedor = (proveedores, id) => {
    const proveedor = proveedores.find(p => p.id === id);
    return proveedor?.nombre
}

export {
    convertidorIva,
    covnertidorMarca,
    convertidorProveedor
}