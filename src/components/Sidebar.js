import styles from "../styles/Side.module.css"

const Sidebar = () => {
  return (
    <div className={`${styles.contenedor} my-32 space-y-96`}>
      <div className={`${styles.modulo} mx-28`}>
        <p>Menú de Modulos</p>
      </div>

      <div className={`${styles.modulo} mx-20`}>
        <p>Modulo de Configuración</p>
      </div>
    </div>
  )
}

export default Sidebar