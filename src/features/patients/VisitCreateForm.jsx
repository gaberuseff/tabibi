import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import useCreateVisit from "./useCreateVisit"
import SpeechButton from "../../components/ui/SpeechButton"

export default function VisitCreateForm({ patientId, onVisitCreated }) {
    const [diagnosis, setDiagnosis] = useState("")
    const [notes, setNotes] = useState("")
    const [medications, setMedications] = useState([])
    const [newMedication, setNewMedication] = useState({ name: "", using: "" })
    
    const { mutate: createVisit, isPending: isCreating } = useCreateVisit()

    const handleAddMedicationField = () => {
        if (newMedication.name.trim() !== "" && newMedication.using.trim() !== "") {
            setMedications([...medications, { ...newMedication }])
            setNewMedication({ name: "", using: "" })
        }
    }

    const handleRemoveMedication = (index) => {
        setMedications(medications.filter((_, i) => i !== index))
    }

    const handleSpeechTranscript = (newTranscript) => {
        // Append new transcript to existing notes with proper spacing
        setNotes(prevNotes => {
            if (!prevNotes) return newTranscript;
            if (!newTranscript) return prevNotes;
            
            // Add space if previous notes don't end with space or punctuation
            const shouldAddSpace = !/[\s.،,؟!؛]$/u.test(prevNotes.trim());
            return prevNotes + (shouldAddSpace ? " " : "") + newTranscript;
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!diagnosis.trim()) {
            // Show error message
            const errorMessage = document.createElement("div")
            errorMessage.className = "text-destructive text-sm mt-1"
            errorMessage.textContent = "الرجاء إدخال التشخيص المبدئي"
            
            // Remove any existing error message
            const existingError = document.querySelector("#diagnosis-error")
            if (existingError) existingError.remove()
            
            // Add new error message
            const diagnosisInput = document.getElementById("diagnosis")
            diagnosisInput.parentNode.appendChild(errorMessage)
            errorMessage.id = "diagnosis-error"
            
            // Remove error after 3 seconds
            setTimeout(() => {
                if (errorMessage.parentNode) {
                    errorMessage.parentNode.removeChild(errorMessage)
                }
            }, 3000)
            
            return
        }

        // Prepare medications array - only include medications with both name and using
        const validMedications = medications.filter(
            med => med.name.trim() !== "" && med.using.trim() !== ""
        )

        const visitData = {
            patient_id: patientId,
            diagnosis,
            notes,
            medications: validMedications.length > 0 ? validMedications : null
        }

        createVisit(visitData, {
            onSuccess: () => {
                // Reset form
                setDiagnosis("")
                setNotes("")
                setMedications([])
                setNewMedication({ name: "", using: "" })
                
                // Notify parent component
                if (onVisitCreated) onVisitCreated()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="diagnosis">التشخيص المبدئي *</Label>
                    <Input
                        id="diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="أدخل التشخيص المبدئي"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">الملاحظات</Label>
                    <div className="relative">
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="اكتب الملاحظات أو استخدم الميكروفون للتحدث"
                            rows={4}
                        />
                        <div className="absolute left-2 bottom-2">
                            <SpeechButton 
                                onTranscriptChange={handleSpeechTranscript}
                                isDisabled={isCreating}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>الأدوية</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddMedicationField}
                            disabled={!newMedication.name.trim() || !newMedication.using.trim()}
                        >
                            إضافة دواء
                        </Button>
                    </div>

                    {/* New medication input fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-border rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="medicationName">اسم الدواء</Label>
                            <Input
                                id="medicationName"
                                value={newMedication.name}
                                onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                                placeholder="أدخل اسم الدواء"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="medicationUsing">استخدام الدواء</Label>
                            <Input
                                id="medicationUsing"
                                value={newMedication.using}
                                onChange={(e) => setNewMedication({ ...newMedication, using: e.target.value })}
                                placeholder="أدخل طريقة الاستخدام"
                            />
                        </div>
                    </div>

                    {/* Added medications list */}
                    {medications.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">الأدوية المضافة:</h4>
                            {medications.map((med, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-muted-foreground">اسم الدواء</Label>
                                            <div className="font-medium">{med.name}</div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground">استخدام الدواء</Label>
                                            <div className="text-muted-foreground">{med.using}</div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveMedication(index)}
                                        className="mr-2"
                                    >
                                        إزالة
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        // Reset form when closing
                        setDiagnosis("")
                        setNotes("")
                        setMedications([])
                        setNewMedication({ name: "", using: "" })
                        
                        // Notify parent component to close the form
                        if (onVisitCreated) onVisitCreated()
                    }}
                >
                    إلغاء
                </Button>
                <Button type="submit" disabled={isCreating}>
                    {isCreating ? "جاري الإضافة..." : "إضافة الكشف"}
                </Button>
            </div>
        </form>
    )
}