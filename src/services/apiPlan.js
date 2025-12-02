import supabase from "./supabase"

export async function getCurrentPlan() {
    // Get current user's clinic_id
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const { data: userData } = await supabase
        .from("users")
        .select("clinic_id")
        .eq("user_id", session.user.id)
        .single()

    if (!userData?.clinic_id) throw new Error("User has no clinic assigned")

    // Get active subscription plan for the clinic
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('clinic_id', userData.clinic_id)
        .eq('status', 'active')
        .single()

    if (error) {
        // If no active subscription found, return null
        if (error.code === "PGRST116") {
            return null
        }
        throw error
    }

    return data
}