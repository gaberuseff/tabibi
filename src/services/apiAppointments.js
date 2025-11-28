import supabase from "./supabase"

export async function getAppointments(search, page, pageSize, filters = {}) {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    const from = Math.max(0, (page - 1) * pageSize)
    const to = from + pageSize - 1

    let query = supabase
        .from("appointments")
        .select(`
      id,
      date,
      notes,
      price,
      status,
      patient:patients(id, name, phone)
    `, { count: "exact" })
        .eq("clinic_id", userData.clinic_id)
        .range(from, to)

    // Apply time filter - by default show all appointments
    if (filters.time === "upcoming") {
        const now = new Date().toISOString()
        query = query.gte('date', now)
    }
    // If filters.time is "all" or not set, don't apply any time filter

    // Sort by appointment date ascending (closest first)
    query = query.order("date", { ascending: true })

    // Apply date filter if provided
    if (filters.date) {
        // Filter appointments for the specific date
        const startDate = new Date(filters.date)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)

        query = query
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString())
    }

    // Apply status filter if provided
    if (filters.status) {
        query = query.eq('status', filters.status)
    }

    const { data, error, count } = await query

    if (error) throw error
    return { items: data ?? [], total: count ?? 0 }
}

// New function to create appointment for public booking (no authentication required)
export async function createAppointmentPublic(payload, clinicId) {
    console.log("Creating appointment with clinicId:", clinicId);
    console.log("Clinic ID type:", typeof clinicId);

    // Convert clinicId to BigInt for database operations
    const clinicIdBigInt = BigInt(clinicId);

    // Add clinic_id to the appointment data
    const appointmentData = {
        ...payload,
        clinic_id: clinicIdBigInt,
        status: "pending"
    }

    console.log("Appointment data to insert:", appointmentData);

    const { data, error } = await supabase
        .from("appointments")
        .insert(appointmentData)
        .select()
        .single()

    if (error) {
        console.error("Error creating appointment:", error);
        throw error
    }
    return data
}

export async function createAppointment(payload) {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    // Add clinic_id to the appointment data
    const appointmentData = {
        ...payload,
        clinic_id: userData.clinic_id,
        status: "pending"
    }

    const { data, error } = await supabase
        .from("appointments")
        .insert(appointmentData)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateAppointment(id, payload) {
    // Get current user's clinic_id for security
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    const { data, error } = await supabase
        .from("appointments")
        .update(payload)
        .eq("id", id)
        .eq("clinic_id", userData.clinic_id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteAppointment(id) {
    // Get current user's clinic_id for security
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id)
        .eq("clinic_id", userData.clinic_id)

    if (error) throw error
}

export async function searchPatients(searchTerm) {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    const s = `%${searchTerm.trim()}%`
    const { data, error } = await supabase
        .from("patients")
        .select("id, name, phone")
        .eq("clinic_id", userData.clinic_id)
        .or(`name.ilike.${s},phone.ilike.${s}`)
        .limit(5)

    if (error) throw error
    return data ?? []
}

// New function for public booking - search patients by phone only
export async function searchPatientsPublic(searchTerm, clinicId) {
    console.log("Searching patients with clinicId:", clinicId);
    console.log("Clinic ID type:", typeof clinicId);

    // Convert clinicId to BigInt for database operations
    const clinicIdBigInt = BigInt(clinicId);

    // Only search by phone number for public booking
    const s = `%${searchTerm.trim()}%`
    const { data, error } = await supabase
        .from("patients")
        .select("id, name, phone")
        .eq("clinic_id", clinicIdBigInt)
        .ilike("phone", s)
        .limit(5)

    if (error) {
        console.error("Error searching patients:", error);
        throw error
    }
    return data ?? []
}

// New function to get appointments for a specific patient
export async function getAppointmentsByPatientId(patientId) {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    const { data, error } = await supabase
        .from("appointments")
        .select(`
      id,
      date,
      notes,
      price,
      status
    `)
        .eq("clinic_id", userData.clinic_id)
        .eq("patient_id", patientId)
        // Show all appointments for the patient, sorted by date descending (newest first)
        .order("date", { ascending: false })

    if (error) throw error
    return data ?? []
}