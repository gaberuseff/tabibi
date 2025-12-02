import supabase from "./supabase";

export async function getActiveSubscription(clinicId) {
    const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('status', 'active')
        .single();

    if (error) {
        // If no active subscription found, return null
        if (error.code === "PGRST116") {
            return null;
        }
        throw error;
    }

    return data;
}

export async function cancelActiveSubscription(clinicId) {
    // First, get the active subscription
    const activeSubscription = await getActiveSubscription(clinicId);

    if (!activeSubscription) {
        // No active subscription to cancel
        return null;
    }

    // Update the subscription status to cancelled
    const { data, error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', activeSubscription.id)
        .eq('clinic_id', clinicId)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function createSubscription({ clinicId, planId }) {
    // Calculate subscription period (1 month from now)
    const now = new Date();
    const currentPeriodStart = now.toISOString();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

    const { data, error } = await supabase
        .from('subscriptions')
        .insert({
            clinic_id: clinicId,
            plan_id: planId,
            status: 'active',
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd.toISOString()
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}