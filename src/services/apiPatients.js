import supabase from "./supabase"

export async function getPatients(search, page, pageSize) {
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
    .from("patients")
    .select("id,name,phone,gender,address,date_of_birth,blood_type", { count: "exact" })
    .eq("clinic_id", userData.clinic_id)
    .order("created_at", { ascending: false })
    .range(from, to)
  if (search && search.trim()) {
    const s = `%${search.trim()}%`
    query = query.or(`name.ilike.${s},phone.ilike.${s}`)
  }
  const { data, error, count } = await query
  if (error) throw error
  return { items: data ?? [], total: count ?? 0 }
}

export async function createPatient(payload) {
  // Get current user's clinic_id
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("Not authenticated")

  const { data: userData } = await supabase
    .from("users")
    .select("clinic_id")
    .eq("user_id", session.user.id)
    .single()

  if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

  // Add clinic_id to the patient data
  const patientData = {
    ...payload,
    clinic_id: payload.clinic_id || userData.clinic_id
  }


  const { data, error } = await supabase
    .from("patients")
    .insert(patientData)
    .select()
    .single()

  if (error) {
    console.error("Error creating patient:", error)
    throw error
  }
  return data
}

export async function getPatientById(id) {
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
    .from("patients")
    .select("id,name,phone,gender,address,date_of_birth,blood_type")
    .eq("id", id)
    .eq("clinic_id", userData.clinic_id)
    .single()
  if (error) throw error
  return data
}

export async function updatePatient(id, payload) {
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
    .from("patients")
    .update(payload)
    .eq("id", id)
    .eq("clinic_id", userData.clinic_id)
    .select()
    .single()
  if (error) throw error
  return data
}