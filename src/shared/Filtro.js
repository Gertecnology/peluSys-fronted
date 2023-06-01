

const Filtro = ({ titulo, opciones, texto, sTexto }) => {
    return (
        <div className="mx-10 shadow-md rounded-md bg-white p-4">
            <h2 className="text-4xl font-bold mb-7">
                {titulo}
            </h2>
            <div className="flex my-10 justify-between">
                <div className="flex">
                    <select className="text-black text-sm block border dark:border-black p-2.5 rounded-l-lg">
                        <option>{opciones}</option>
                    </select>
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="search" id="default-search" class="block w-96 p-4 pl-10 text-sm text-black border border-gray-300 rounded-r-lg bg-gray-50  dark:bg-white dark:border-black dark:placeholder-dark dark:text-dark  " placeholder="Has tu busqueda" />
                        <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blueEdition dark:hover:bg-blue-950 dark:focus:ring-blue-800">{texto}</button>
                    </div>
                </div>
                <div>
                    <button className="bg-blueEdition hover:bg-blue-950 text-white font-medium rounded-lg text-sm px-4 py-4">{sTexto}</button>
                </div>
            </div>
        </div>

    )
}

export default Filtro
