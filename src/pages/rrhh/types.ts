export type Aviso = {
  id: number
  tipo: "Urgente" | "Aviso importante" | "Informe"
  titulo: string
  contenido: string
  tiempo: string
}