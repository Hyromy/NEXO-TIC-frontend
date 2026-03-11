import Main from "../../layout/Main"
import Progress from "../../components/Progress"
import { Button } from "../../components/Button"
import { ColContainer, FloatContainer, RowContainer, StackContainer } from "../../layout/Containers"
import { useEffect, useState } from "react"
import { Select, Option } from "../../components/Form"
import { Card } from "../../components/Card"
import { List } from "../../components/List"
import { Accordion } from "../../components/Accordion"
import { Alert, launchAlert } from "../../components/Alert"

const defaultHorizontalPadding = 5
const defaultGap = 4
const defaultMinStep = 0
const defaultMaxStep = 2

const floatContainerId = "request-float-container"

const defaultState = {
  step: defaultMinStep,
  canContinue: false,
  data: {
    typeRequest: "",
    schedule: [],
  }
}

type RequestData = {
  typeRequest: string
  schedule: string[]
}

type StepViewProps = {
  onReady: (fields: Partial<RequestData>) => void
}

export default function Solicitudes() {
  const [step, setStep] = useState(defaultState.step)
  const [canContinue, setCanContinue] = useState(defaultState.canContinue)
  const [data, setData] = useState<RequestData>(defaultState.data)

  const updateData = (newData: Partial<RequestData>) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }))
  }

  const changeStep = (newStep: boolean) => {
    const convertStep = newStep ? 1 : -1
    const currentStep = step + convertStep
    if (defaultMinStep > currentStep || currentStep > defaultMaxStep) return
    setCanContinue(false)
    setStep(currentStep)
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <RequestType
            typeRequest={data.typeRequest}
            onReady={(fields) => {
              updateData(fields)
              setCanContinue(fields.typeRequest != "")
            }}
          />
        )
      case 1:
        return (
          <Schedule 
            schedule={data.schedule}
            onReady={(fields) => {
              updateData(fields)
              setCanContinue((fields.schedule?.length ?? 0) > 0)
            }}
          />
        )
      case 2:
        return (
          <Summary
            typeRequest={data.typeRequest}
            schedule={data.schedule}
            onReady={() => {
              setCanContinue(
                (data.schedule?.length ?? 0) > 0
                && data.typeRequest != ""
              )
            }}
          />
        )
    }
  }

  const isStart = step <= defaultMinStep
  const isEnd = step >= defaultMaxStep

  return (
    <Main>
      <StackContainer gap={defaultGap}>
        {renderStep()}
        <RowContainer>
          <ColContainer>
            <StackContainer center>
              <Button
                variant="secondary"
                size="lg"
                h_padding={defaultHorizontalPadding}
                onClick={() => changeStep(false)}
                isLoading={isStart}
              >
                Regresar
              </Button>
            </StackContainer>
          </ColContainer>
          <ColContainer>
            <StackContainer center>
              <Button
                size="lg"
                h_padding={defaultHorizontalPadding}
                onClick={() => {
                  if (isEnd) {
                    launchAlert(floatContainerId,
                      <Alert type="success" icon="success">
                        Solicitud enviada correctamente.
                      </Alert>,
                      true
                    )
                    setData(defaultState.data)
                    setCanContinue(defaultState.canContinue)
                    setStep(defaultMinStep)
                    return  
                  }
                  changeStep(true)
                }}
                variant={isEnd ? "success" : "primary"}
                isLoading={!canContinue}
              >
                {isEnd ? "Enviar" : "Siguiente"}
              </Button>
            </StackContainer>
          </ColContainer>
        </RowContainer>
        <StackContainer center>
          Paso {step + 1} de {defaultMaxStep + 1}
        </StackContainer>
        <Progress
          variant={step >= defaultMaxStep ? "success" : "primary"}
          value={step}
          max={defaultMaxStep}
        />
      </StackContainer>
      <FloatContainer id={floatContainerId} />
    </Main>
  )
}

type RequestTypeProps = StepViewProps & {
  typeRequest: string
}
function RequestType({
  typeRequest,
  onReady
}: RequestTypeProps) {
  const [localType, setLocalType] = useState(typeRequest)

  useEffect(() => {
    if (localType) onReady({ typeRequest: localType })
  }, [])

  const options = [
    <Option key="1" text="Seleccione un tipo de solicitud" value="" disabled />,
    <Option key="2" text="Vacaciones" value="holidays" />,
    <Option key="3" text="Entrada tardía" value="lateEntry" />,
    <Option key="4" text="Dia económico" value="economicDay" />,
    <Option key="5" text="Salida anticipada" value="earlyExit" />,
    <Option key="6" text="Incapacidad medica" value="medicalIncapacity" />,
    <Option key="7" text="Permiso por maternidad / paternidad" value="parentalLeave" />,
  ]

  const handleTypeChange = (value: string) => {
    setLocalType(value)
    if (value) onReady({ typeRequest: value })
  }

  return (
    <>
      <h2>Registro de tipo de solicitud</h2>
      <Select
        name="typeRequest"
        size="lg"
        options={options}
        value={localType}
        onChange={handleTypeChange}
      />
    </>
  )
}

type ScheduleProps = StepViewProps & {
  schedule: string[]
}
function Schedule({
  schedule,
  onReady
}: ScheduleProps) {
  const [localSchedule, setLocalSchedule] = useState(schedule)

  useEffect(() => {
    if (localSchedule.length > 0) onReady({ schedule: localSchedule })
  }, [])

  const availableDays = 4

  const canAddMore = localSchedule.length < availableDays
  const canRemove = localSchedule.length > 0

  const addDay = (day: string) => {
    if (!canAddMore) return
    const newSchedule = [...localSchedule, day]
    setLocalSchedule(newSchedule)
    onReady({ schedule: newSchedule })
  }

  const removeDay = (day: string) => {
    if (!canRemove) return
    const newSchedule = localSchedule.filter(d => d != day)
    setLocalSchedule(newSchedule)
    onReady({ schedule: newSchedule })
  }

  return (
    <>
      <h2>Horario</h2>
      <RowContainer gap={defaultGap}>
        <ColContainer defaultSize={12} md={6} xl={4}>
          <Card header={"Dias seleccionados"}>
            {localSchedule.length}
          </Card>
        </ColContainer>
        <ColContainer defaultSize={12} md={6} xl={4}>
          <Card header={"Dias restantes"}>
            {availableDays - localSchedule.length}
          </Card>
        </ColContainer>
        <ColContainer defaultSize={12} xl={4}>
          <Card>
            {"{{ Calendar here }}"}
            <Button
              onClick={() => addDay(new Date().toDateString())}
              isLoading={!canAddMore}
            >
              add()
            </Button>
            <Button
              onClick={() => removeDay(new Date().toDateString())}
              isLoading={!canRemove}
            >
              clear()
            </Button>
            {localSchedule.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </Card>
        </ColContainer>
      </RowContainer>
    </>
  )
}

type SummaryProps = StepViewProps & {
  typeRequest: string
  schedule: string[]
}
function Summary({
  typeRequest,
  schedule,
  onReady
}: SummaryProps) {
  useEffect(() => {
    onReady({ typeRequest, schedule })
  }, [])

  const items = [
    `Tipo de solicitud: ${typeRequest}`,
    <Accordion items={[{
      header: `Dias seleccionados: ${schedule.length}`,
      body: <List flush items={schedule} />
    }]} />,
  ]

  return (
    <>
      <h2>Resumen de solicitud</h2>
      <List flush items={items} />
    </>
  )
}
