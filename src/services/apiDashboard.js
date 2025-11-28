import supabase from "./supabase"

export async function getDashboardStats() {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    const clinicId = userData.clinic_id

    // Get today's date range
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    // 1. Get total patients count
    const { count: totalPatients, error: patientsError } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", clinicId)

    if (patientsError) throw patientsError

    // 2. Get today's appointments count
    const { count: todayAppointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", clinicId)
        .gte("date", startOfDay)
        .lte("date", endOfDay)

    if (appointmentsError) throw appointmentsError

    // 3. Get pending appointments count
    const { count: pendingAppointments, error: pendingError } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", clinicId)
        .eq("status", "pending")

    if (pendingError) throw pendingError

    // 4. Get total income from completed appointments using the SQL function
    const { data: incomeData, error: incomeError } = await supabase
        .rpc('get_clinic_completed_revenue', { target_clinic_id: clinicId })

    if (incomeError) throw incomeError

    return {
        totalPatients: totalPatients || 0,
        todayAppointments: todayAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        totalIncome: incomeData || 0
    }
}

// New function to get filtered patient counts
export async function getFilteredPatientStats(filter) {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    const clinicId = userData.clinic_id

    // Calculate date range based on filter
    const today = new Date()
    let startDate

    switch (filter) {
        case "week":
            startDate = new Date(today.setDate(today.getDate() - 7)).toISOString()
            break
        case "month":
            startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString()
            break
        case "threeMonths":
            startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString()
            break
        default:
            startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString()
    }

    // Get filtered patients count (patients with appointments in the date range)
    const { count: filteredPatients, error: filteredPatientsError } = await supabase
        .from("appointments")
        .select("patient_id", { count: "exact", head: true })
        .eq("clinic_id", clinicId)
        .gte("date", startDate)
        .lte("date", new Date().toISOString())

    if (filteredPatientsError) throw filteredPatientsError

    return {
        filteredPatients: filteredPatients || 0
    }
}

export async function getRecentActivity(page = 1, pageSize = 5) {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    const clinicId = userData.clinic_id

    // Calculate range for pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // First get the total count
    const { count: totalCount, error: countError } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", clinicId)

    if (countError) throw countError

    // Get recent appointments with patient info
    const { data: recentAppointments, error } = await supabase
        .from("appointments")
        .select(`
            id,
            date,
            notes,
            status,
            patient:patients(name)
        `)
        .eq("clinic_id", clinicId)
        .order("date", { ascending: false })
        .range(from, to)

    if (error) throw error

    // Transform data for activity feed
    const transformedData = recentAppointments.map(appointment => ({
        id: appointment.id,
        title: `حجز موعد - ${appointment.patient?.name || 'مريض'}`,
        time: new Date(appointment.date).toLocaleDateString('ar-EG', {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        }),
        tag: appointment.status === 'pending' ? 'جديد' : null
    }))

    return {
        data: transformedData,
        count: totalCount
    }
}
