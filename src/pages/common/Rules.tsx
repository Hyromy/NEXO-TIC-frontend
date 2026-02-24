import Main from "../../layout/Main"
import { Button, downloadFile } from "../../components/Button"

export default function Rules () {
  const handleDownload = () => {
    downloadFile(
      "docs/reglamento.pdf",
      "Reglamento.pdf"
    )
  }

  return (
    <Main>
      <h2>Reglamento</h2>
      <p>
        Aquí puedes descargar el reglamento de la empresa en formato PDF. Este documento contiene todas las políticas, normas y procedimientos que debes seguir como empleado. Asegúrate de leerlo detenidamente para conocer tus derechos y responsabilidades dentro de la organización.
      </p>
      <Button onClick={handleDownload}>
        <i className="bi bi-download me-2"></i>
        Descargar PDF
      </Button>
    </Main>
  )
}
