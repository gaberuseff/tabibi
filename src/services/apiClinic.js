import supabase from "./supabase"

export async function getCurrentClinic() {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    // Get clinic data
    const { data, error } = await supabase
        .from("clinics")
        .select("name, address")
        .eq("clinic_id", userData.clinic_id)
        .single()

    if (error) throw error
    return data
}

export async function updateClinic({ name, address }) {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id, role")
        .eq("user_id", session.user.id)
        .single()

    console.log(userData);

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    // Only doctors can update clinic info
    if (userData.role !== "doctor") {
        throw new Error("فقط الطبيب يمكنه تعديل بيانات العيادة")
    }

    // Update clinic data
    const { data, error } = await supabase
        .from("clinics")
        .update({
            name,
            address
        })
        .eq("clinic_id", userData.clinic_id)
        .select()
        .single()

    if (error) throw error
    return data
}