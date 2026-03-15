import {
	type completeEmployee,
	type completeJobPosition,
	type department,
	type employee,
	type jobPosition,
	type user,
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
