import Main from "../../layout/Main"

import { Button, downloadFile } from "../../components/Button"

export default function Terms () {
  const handleDownload = () => {
    downloadFile(
      "docs/terminos.pdf",
      "Términos y Condiciones del Sistema.pdf"
    )
  }

  return (
    <Main>
      <h2>Términos y Condiciones del sistema</h2>
      <p>
        Aquí puedes descargar los términos y condiciones del sistema en formato PDF. Este documento contiene todas las políticas, normas y procedimientos que debes seguir como usuario del sistema. Asegúrate de leerlo detenidamente para conocer tus derechos y responsabilidades dentro de la organización.
      </p>
      <Button onClick={handleDownload}>
        <i className="bi bi-download me-2"></i>
        Descargar PDF
      </Button>
    </Main>
  )
}
