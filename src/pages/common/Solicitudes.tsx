import Main from "../../layout/Main";
import Progress from "../../components/Progress";
import { Button } from "../../components/Button";
import {
  ColContainer,
  RowContainer,
  StackContainer,
} from "../../layout/Containers";
import { useEffect, useState } from "react";
import { Select, Option } from "../../components/Form";
import { Card } from "../../components/Card";
import { List } from "../../components/List";
import { Accordion } from "../../components/Accordion";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import {
  vacationRequestService,
  vacationDetailService,
  vacationPeriodService,
  employeeService,
} from "../../services/nexotic";
import { getAccessToken } from "../../utils/getters";
import { decodeJWT } from "../../utils/jwt";

import { Alert, launchAlert } from "../../components/Alert"
import Calendar from "react-calendar";
const defaultHorizontalPadding = 5;
const defaultGap = 4;
const defaultMinStep = 0;
const defaultMaxStep = 2;

const asCollection = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (!value || typeof value !== "object") return [];

  const source = value as Record<string, unknown>;
  if (Array.isArray(source.results)) return source.results as T[];
  if (Array.isArray(source.data)) return source.data as T[];

  return [];
};

const defaultState = {
  step: defaultMinStep,
  canContinue: false,
  data: {
    typeRequest: "",
    schedule: [],
  },
};

type RequestData = {
  typeRequest: string;
  schedule: string[];
};

type StepViewProps = {
  onReady: (fields: Partial<RequestData>) => void;
};

export default function Solicitudes() {
  const navigate = useNavigate();
  const [step, setStep] = useState(defaultState.step);
  const [canContinue, setCanContinue] = useState(defaultState.canContinue);
  const [data, setData] = useState<RequestData>(defaultState.data);
  const [availableDays, setAvailableDays] = useState(0);
  const [realEmployeeId, setRealEmployeeId] = useState<number | null>(null);

  const { execute: createRequest } = useApi<any>();
  const { execute: createDetail } = useApi<any>();
  const { execute: fetchData } = useApi<any>();
  const token = getAccessToken();
  const decoded: any = token ? decodeJWT(token) : null;
  const userId = decoded?.user_id;
  useEffect(() => {
    const loadInitialData = async () => {
      if (!userId) return;
      try {
        const empRes = await fetchData(employeeService.getAll());
        const employees = asCollection<any>(empRes);
        const employee = employees.find(
          (e: any) => Number(e.user?.id || e.user) === Number(userId),
        );

        if (employee) {
          setRealEmployeeId(employee.id);
          const periodRes = await fetchData(vacationPeriodService.getAll());
          const periods = asCollection<any>(periodRes);

          if (periods.length > 0) {
            const currentPeriod = periods
              .filter((p: any) => Number(p.employee?.id || p.employee) === Number(employee.id))
              .sort((a: any, b: any) => Number(b.year || 0) - Number(a.year || 0))[0];

            setAvailableDays(currentPeriod?.days_remaining || 0);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    loadInitialData();
  }, [userId, fetchData]);

  const updateData = (newData: Partial<RequestData>) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const changeStep = (newStep: boolean) => {
    const convertStep = newStep ? 1 : -1;
    const currentStep = step + convertStep;
    if (defaultMinStep > currentStep || currentStep > defaultMaxStep) return;
    setCanContinue(false);
    setStep(currentStep);
  };
  const handleSend = async () => {
    if (!realEmployeeId) {
      return launchAlert("main-float-container",
        <Alert type="danger" icon="error">
          No se pudo identificar su perfil de empleado.
        </Alert>,
      )
    }

    try {
      const requestRes = await createRequest(
        vacationRequestService.create({
          status: "pending",
          employee_id: realEmployeeId,
        }),
      );

      if (!requestRes || requestRes.error) {
        return launchAlert("main-float-container",
          <Alert type="danger" icon="error">
            Error al crear la solicitud: {requestRes?.message || "Servidor no responde"}
          </Alert>,
        )
      }

      for (const day of data.schedule) {
        // Formatear a YYYY-MM-DD
        const dateObj = new Date(day);
        const formattedDate = dateObj.toISOString().split("T")[0];

        await createDetail(
          vacationDetailService.create({
            selected_day: formattedDate,
            vacation_request_id: requestRes.id,
          }),
        );
      }

      launchAlert("main-float-container",
        <Alert type="success" icon="success">
          Solicitud enviada correctamente.
        </Alert>,
      )
      setData(defaultState.data)
      setCanContinue(defaultState.canContinue)
      setStep(defaultMinStep)
      navigate("/holidays");
    } catch (e) {
      console.error(e);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <RequestType
            typeRequest={data.typeRequest}
            onReady={(fields) => {
              updateData(fields);
              setCanContinue(fields.typeRequest !== "");
            }}
          />
        );
      case 1:
        return (
          <Schedule
            schedule={data.schedule}
            availableDays={availableDays}
            onReady={(fields) => {
              updateData(fields);
              setCanContinue((fields.schedule?.length ?? 0) > 0);
            }}
          />
        );
      case 2:
        return (
          <Summary
            typeRequest={data.typeRequest}
            schedule={data.schedule}
            onReady={(fields) => {
              updateData(fields);
              setCanContinue(
                (data.schedule?.length ?? 0) > 0 && data.typeRequest !== "",
              );
            }}
          />
        );
    }
  };

  const isStart = step <= defaultMinStep;
  const isEnd = step >= defaultMaxStep;

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
                    void handleSend()
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
    </Main>
  );
}

type RequestTypeProps = StepViewProps & {
  typeRequest: string;
};
function RequestType({ typeRequest, onReady }: RequestTypeProps) {
  const [localType, setLocalType] = useState(typeRequest);

  useEffect(() => {
    if (localType) onReady({ typeRequest: localType });
  }, []);

  const options = [
    <Option key="1" text="Seleccione un tipo de solicitud" value="" disabled />,
    <Option key="2" text="Vacaciones" value="holidays" />,
    <Option key="3" text="Entrada tardía" value="lateEntry" />,
    <Option key="4" text="Dia económico" value="economicDay" />,
    <Option key="5" text="Salida anticipada" value="earlyExit" />,
    <Option key="6" text="Incapacidad medica" value="medicalIncapacity" />,
    <Option
      key="7"
      text="Permiso por maternidad / paternidad"
      value="parentalLeave"
    />,
  ];
  const handleTypeChange = (value: string) => {
    setLocalType(value);
    if (value) onReady({ typeRequest: value });
  };
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
  );
}

type ScheduleProps = StepViewProps & {
  schedule: string[];
  availableDays?: number;
};
function Schedule({ schedule, onReady, availableDays = 0 }: ScheduleProps) {
  const [localSchedule, setLocalSchedule] = useState(schedule);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  useEffect(() => {
    if (localSchedule.length > 0) onReady({ schedule: localSchedule });
  }, []);
  const canAddMore = localSchedule.length < availableDays;
  const canRemove = localSchedule.length > 0;

  const addDay = (day: string) => {
    if (!canAddMore) return;
    const newSchedule = [...localSchedule, day];
    setLocalSchedule(newSchedule);
    onReady({ schedule: newSchedule });
  };

  const removeDay = (day: string) => {
    if (!canRemove) return;
    const newSchedule = localSchedule.filter((d) => d != day);
    setLocalSchedule(newSchedule);
    onReady({ schedule: newSchedule });
  };
  return (
    <>
      <h2>Horario</h2>
      <RowContainer gap={defaultGap}>
        <ColContainer defaultSize={12} md={6} xl={4}>
          <Card header={"Dias seleccionados"}>{localSchedule.length}</Card>
        </ColContainer>
        <ColContainer defaultSize={12} md={6} xl={4}>
          <Card header={"Dias restantes"}>
            {availableDays - localSchedule.length}
          </Card>
        </ColContainer>
        <ColContainer defaultSize={12} xl={4}>
          <Card>
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setSelectedDate(value);
                }
              }}
              value={selectedDate}
              minDate={new Date()}
              tileDisabled={({ date }) => {
                const day = date.getDay();
                return day === 0 || day === 6;
              }}
              tileClassName={({ date }) => {
                const formatted = date.toISOString().split("T")[0];
                return localSchedule.includes(formatted) ? "selected-day" : "";
              }}
            />
            <Button
              onClick={() => {
                if (!selectedDate) return;
                const formatted = selectedDate.toISOString().split("T")[0];
                if (!localSchedule.includes(formatted)) {
                  addDay(formatted);
                }
              }}
              isLoading={!canAddMore}
            >
              Agregar día
            </Button>
            <Button
              onClick={() => {
                if (!selectedDate) return;
                const formatted = selectedDate.toISOString().split("T")[0];
                removeDay(formatted);
              }}
              isLoading={!canRemove}
            >
            Eliminar día
            </Button>
            {localSchedule.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </Card>
        </ColContainer>
      </RowContainer>
    </>
  );
}

type SummaryProps = StepViewProps & {
  typeRequest: string;
  schedule: string[];
};
function Summary({ typeRequest, schedule, onReady }: SummaryProps) {
  useEffect(() => {
    onReady({ typeRequest, schedule });
  }, []);
  const items = [
    `Tipo de solicitud: ${typeRequest}`,
    <Accordion
      key="acc"
      items={[
        {
          header: `Dias seleccionados: ${schedule.length}`,
          body: <List flush items={schedule} />,
        },
      ]}
    />,
  ];
  return (
    <>
      <h2>Resumen de solicitud</h2>
      <List flush items={items} />
    </>
  );
}