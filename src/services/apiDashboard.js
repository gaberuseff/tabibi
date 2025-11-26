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

    // Get this month's date range
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()

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

    // 3. Get updated patients count (patients with recent appointments)
    const { count: updatedPatients, error: updatedPatientsError } = await supabase
        .from("appointments")
        .select("patient_id", { count: "exact", head: true })
        .eq("clinic_id", clinicId)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth)

    if (updatedPatientsError) throw updatedPatientsError

    // 4. Get pending appointments count
    const { count: pendingAppointments, error: pendingError } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("clinic_id", clinicId)
        .eq("status", "pending")

    if (pendingError) throw pendingError

    return {
        totalPatients: totalPatients || 0,
        todayAppointments: todayAppointments || 0,
        updatedPatients: updatedPatients || 0,
        pendingAppointments: pendingAppointments || 0
    }
}

export async function getRecentActivity() {
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
        .limit(5)

    if (error) throw error

    // Transform data for activity feed
    return recentAppointments.map(appointment => ({
        id: appointment.id,
        title: `حجز موعد - ${appointment.patient?.name || 'مريض'}`,
        time: new Date(appointment.date).toLocaleDateString('ar-EG', {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        }),
        tag: appointment.status === 'pending' ? 'جديد' : null
    }))
}