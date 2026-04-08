import { useEffect, useState } from "react" // Agregamos useState
import Main from "../../layout/Main"
import { Card } from "../../components/Card"
import { Button } from "../../components/Button"
import { useNavigate } from "react-router-dom"
import useApi from "../../hooks/useApi"
import { Spinner } from "../../components/Spinner"
import { StackContainer } from "../../layout/Containers"
import { Badge } from "../../components/Badge"
import { Alert, launchAlert } from "../../components/Alert" // Agregamos Alert
import { openModal, closeModal, Modal } from "../../components/Modal" // Agregamos Modal

import { announcementService } from "../../services/nexotic"
import { type Announcement } from "../../types/Announcement"

export default function Avisos_RH() {
  const navigate = useNavigate()
  const { data, loading, execute } = useApi<Announcement[]>()
  
  // --- NUEVO: Estado para eliminación ---
  const [selectedAviso, setSelectedAviso] = useState<Announcement | null>(null)
  const deleteModalId = "confirm-delete-announcement"

  useEffect(() => {
    execute(announcementService.getAll())
  }, [])

  const todosLosAvisos = (data || []) as Announcement[]

  // Lógica de filtrado: Anuncios de los últimos 5 días
  const avisosRecientes = todosLosAvisos.filter((aviso) => {
    const fechaAviso = new Date(aviso.date || new Date()) 
    const hoy = new Date()
    const diferenciaMs = hoy.getTime() - fechaAviso.getTime()
    const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24)
    return diferenciaDias <= 5
  })

  // --- NUEVO: Función para eliminar ---
  const handleDelete = async () => {
    if (!selectedAviso) return
    
    try {
      await announcementService.delete(selectedAviso.id)
      launchAlert("main-float-container", <Alert type="success">Aviso eliminado correctamente.</Alert>)
      closeModal(deleteModalId)
      execute(announcementService.getAll()) // Refrescar lista
    } catch (err) {
      launchAlert("main-float-container", <Alert type="danger">Error al eliminar el aviso.</Alert>)
    }
  }

  const getIcono = (prioridad: string) => {
    if (prioridad === "Alta") return "🚨"
    if (prioridad === "Media") return "⚠️"
    if (prioridad === "Baja") return "ℹ️"
    return "📢"
  }

  const badgeTypes: Record<string, string> = {
    Alta: "danger",   // Rojo
    Media: "warning", // Amarillo
    Baja: "primary",  // Azul
  };

  const renderAviso = (aviso: Announcement) => (
    <Card key={aviso.id} padding={3}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="fw-bold mb-2">
            {getIcono(aviso.priority)} {aviso.priority}: {aviso.title}
          </p>
          <p className="mb-2">
            {aviso.content}
          </p>
        </div>
        <Badge 
          type={badgeTypes[aviso.priority] || "primary"} 
          text={aviso.priority} 
        />
      </div>
      
      <div className="d-flex justify-content-between align-items-center mt-2">
        <small className="text-muted">Publicado el: {new Date(aviso.date || "").toLocaleDateString()}</small>
        
        {/* --- NUEVO: Botones de Acción --- */}
        <div className="d-flex gap-2">
          <Button 
            variant="outline-info" 
            small 
            onClick={() => navigate(`/notices/edit/${aviso.id}`)}
          >
            Editar
          </Button>
          <Button 
            variant="outline-danger" 
            small 
            onClick={() => {
              setSelectedAviso(aviso);
              openModal(deleteModalId);
            }}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  )

  return (
    <Main>
      <Card shadow>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Avisos</h3>
          <Button variant="primary" onClick={() => navigate("/notices/new")}>
            Nuevo aviso
          </Button>
        </div>

        {loading ? (
          <StackContainer center padding={5}>
            <Spinner />
          </StackContainer>
        ) : (
          <>
            <div className="mb-4">
              <h5 className="mb-3">Recientes (Últimos 5 días)</h5>
              <div className="d-flex flex-column gap-3">
                {avisosRecientes.length > 0 ? (
                  avisosRecientes.map(renderAviso)
                ) : (
                  <p className="text-muted italic">No hay avisos recientes.</p>
                )}
              </div>
            </div>

            <div>
              <h5 className="mb-3">Todos los anuncios</h5>
              <div className="d-flex flex-column gap-3">
                {todosLosAvisos.length > 0 ? (
                  todosLosAvisos.map(renderAviso)
                ) : (
                  <p className="text-muted">No hay anuncios publicados.</p>
                )}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* --- NUEVO: Modal de Confirmación --- */}
      <Modal id={deleteModalId} header="Eliminar Aviso">
        <StackContainer gap={3}>
          <p>¿Estás seguro de que deseas eliminar el aviso <strong>"{selectedAviso?.title}"</strong>? Esta acción no se puede deshacer.</p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => closeModal(deleteModalId)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirmar Eliminación
            </Button>
          </div>
        </StackContainer>
      </Modal>
    </Main>
  )
}