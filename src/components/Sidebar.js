import styles from "../styles/Side.module.css"

const Sidebar = () => {
  return (
    <div className={`${styles.contenedor} my-32 space-y-96 px-10`}>
      <div className={`${styles.modulo}`}>
        <p>Menú de Modulos</p>
      </div>

      <div className={`${styles.modulo}`}>
        <p>Modulo de Configuración</p>
      </div>
    </div>
  )
}

export default Sidebar
