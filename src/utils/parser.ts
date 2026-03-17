import {
	type completeEmploymentHistory,
	type completeEmployee,
	type completeJobPosition,
	type completeVacationApproval,
	type completeVacationDetail,
	type completeVacationRequest,
	type department,
	type employee,
	type jobPosition,
	type user,
	type employmentHistory,
	type vacationApproval,
	type vacationDetail,
	type vacationRequest,
} from "../services/nexotic"

export type EmployeeRecords = [user[], department[], jobPosition[], employee[]]

export function parseEmployee(records?: EmployeeRecords | null): completeEmployee[] {
	if (!records || !Array.isArray(records) || records.length < 4) {
		return []
	}

	const [users, departments, jobPositions, employees] = records

	const usersById = new Map<number, user>(users.map((u) => [u.id, u]))
	const departmentsById = new Map<number, department>(departments.map((d) => [d.id, d]))
	const jobsById = new Map<number, jobPosition>(jobPositions.map((j) => [j.id, j]))

	return employees.reduce<completeEmployee[]>((acc, currentEmployee) => {
		const userRef = usersById.get(currentEmployee.user)
		const jobRef = jobsById.get(currentEmployee.job_position)
		const departmentRef = jobRef ? departmentsById.get(jobRef.department) : undefined

		if (!userRef || !jobRef || !departmentRef) {
			return acc
		}

		const completeJob: completeJobPosition = {
			...jobRef,
			department: departmentRef,
		}

		acc.push({
			...currentEmployee,
			user: userRef,
			job_position: completeJob,
		})

		return acc
	}, [])
}

export function parseEmploymentHistory(
	history: employmentHistory[] | null | undefined,
	records?: EmployeeRecords | null,
): completeEmploymentHistory[] {
	if (!history || !Array.isArray(history) || history.length === 0) {
		return []
	}

	if (!records || !Array.isArray(records) || records.length < 4) {
		return []
	}

	const [_, departments, jobPositions] = records
	const employees = parseEmployee(records)

	const departmentsById = new Map<number, department>(departments.map((d) => [d.id, d]))
	const jobsById = new Map<number, jobPosition>(jobPositions.map((j) => [j.id, j]))
	const employeesById = new Map<number, completeEmployee>(employees.map((e) => [e.id, e]))

	const getCompleteJobPosition = (jobPositionId: number): completeJobPosition | null => {
		const jobRef = jobsById.get(jobPositionId)
		const departmentRef = jobRef ? departmentsById.get(jobRef.department) : undefined

		if (!jobRef || !departmentRef) {
			return null
		}

		return {
			...jobRef,
			department: departmentRef,
		}
	}

	return history.reduce<completeEmploymentHistory[]>((acc, currentHistory) => {
		const employeeRef = employeesById.get(currentHistory.employee)
		const lastJobRef = getCompleteJobPosition(currentHistory.last_job_position)
		const newJobRef = getCompleteJobPosition(currentHistory.new_job_position)

		if (!employeeRef || !lastJobRef || !newJobRef) {
			return acc
		}

		acc.push({
			...currentHistory,
			employee: employeeRef,
			last_job_position: lastJobRef,
			new_job_position: newJobRef,
		})

		return acc
	}, [])
}

type VacationRecords = {
	requests: vacationRequest[]
	details: vacationDetail[]
	approvals: vacationApproval[]
}

type CompleteVacationRecords = {
	requests: completeVacationRequest[]
	details: completeVacationDetail[]
	approvals: completeVacationApproval[]
}

export function parseVacationRecords(
	vacations: VacationRecords,
	records?: EmployeeRecords | null,
	employeeId?: number,
): CompleteVacationRecords {
	if (!records || !Array.isArray(records) || records.length < 4) {
		return {
			requests: [],
			details: [],
			approvals: [],
		}
	}

	const employees = parseEmployee(records)
	const employeesById = new Map<number, completeEmployee>(employees.map((e) => [e.id, e]))

	const completeRequests = vacations.requests.reduce<completeVacationRequest[]>((acc, request) => {
		const employeeRef = employeesById.get(request.employee)

		if (!employeeRef) {
			return acc
		}

		if (employeeId && employeeRef.id !== employeeId) {
			return acc
		}

		acc.push({
			...request,
			employee: employeeRef,
		})

		return acc
	}, [])

	const requestById = new Map<number, completeVacationRequest>(completeRequests.map((r) => [r.id, r]))

	const completeDetails = vacations.details.reduce<completeVacationDetail[]>((acc, detail) => {
		const requestRef = requestById.get(detail.vacation_request)

		if (!requestRef) {
			return acc
		}

		acc.push({
			...detail,
			vacation_request: requestRef,
		})

		return acc
	}, [])

	const completeApprovals = vacations.approvals.reduce<completeVacationApproval[]>((acc, approval) => {
		const requestRef = requestById.get(approval.vacation_request)

		if (!requestRef) {
			return acc
		}

		acc.push({
			...approval,
			vacation_request: requestRef,
		})

		return acc
	}, [])

	return {
		requests: completeRequests,
		details: completeDetails,
		approvals: completeApprovals,
	}
}
