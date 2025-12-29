"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthoritySelector from "@/components/AuthoritySelector";
import QuestionFields from "@/components/QuestionFields";
import DeclarationStep from "@/components/DeclarationStep";
import { generateRTI } from "@/lib/pdf-generator";
import { Download, FileText, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
    applicantName: z.string().min(2, "Name is required"),
    address: z.string().min(5, "Address is required"),
    place: z.string().min(2, "Place is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    district: z.string().min(1, "District is required"),
    localBodyType: z.string().min(1, "Local body type is required"),
    localBodyName: z.string().min(1, "Local body name is required"),
    subject: z.string().max(100, "Subject must be under 100 characters").min(5, "Subject is too short"),
    questions: z.array(z.string().min(5, "Question is too short")).min(1, "At least one question is required"),
    declarationDate: z.string(),
    declarationPlace: z.string(),
    signature: z.string().min(1, "Signature is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function RTIForm() {
    const [step, setStep] = useState(1);
    const [isFinishing, setIsFinishing] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            questions: [""],
            declarationDate: new Date().toISOString().split("T")[0],
            localBodyType: "",
            district: "",
            localBodyName: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsFinishing(true);
        try {
            await generateRTI(data);
            setIsCompleted(true);
        } catch (error) {
            console.error("PDF Generation failed", error);
        } finally {
            setIsFinishing(false);
        }
    };

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (step === 1) fieldsToValidate = ["applicantName", "address", "place"];
        if (step === 2) fieldsToValidate = ["district", "localBodyType", "localBodyName"];
        if (step === 3) fieldsToValidate = ["subject", "questions"];

        const isValid = await methods.trigger(fieldsToValidate as any);
        if (isValid) setStep(step + 1);
    };

    const currentStepTitle = [
        "Applicant Details",
        "Authority Selection",
        "RTI Questions",
        "Finalize & Sign"
    ][step - 1];

    if (isCompleted) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-12 rounded-3xl shadow-2xl border border-green-100"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Generated!</h2>
                    <p className="text-slate-600 mb-8">
                        Your RTI application has been drafted and downloaded as a PDF.
                        Follow the instructions below to submit it.
                    </p>
                    <div className="text-left space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <FileText size={18} className="text-primary-600" /> Next Steps:
                        </h4>
                        <ol className="text-sm text-slate-600 space-y-3 list-decimal ml-4">
                            <li>Print the downloaded PDF document.</li>
                            <li>Affix a <strong>₹10 Court Fee Stamp</strong> on the top right corner.</li>
                            <li>Put it in an envelope and write <strong>"RTI Application"</strong> on top.</li>
                            <li>Send it via <strong>Registered Post (AD)</strong> to the address shown in the PDF.</li>
                        </ol>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-primary-600 font-semibold hover:underline"
                    >
                        Draft Another Application
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === s
                                        ? "bg-primary-600 text-white ring-4 ring-primary-100 scale-110"
                                        : step > s
                                            ? "bg-green-500 text-white"
                                            : "bg-slate-200 text-slate-500"
                                    }`}
                            >
                                {step > s ? <CheckCircle2 size={20} /> : s}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary-600 transition-all duration-500 ease-out"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                    ></div>
                </div>
                <p className="text-center mt-4 font-semibold text-primary-900">{currentStepTitle}</p>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                key="step1"
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-bold text-slate-800 mb-6 font-primary">Applicant Details</h2>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                    <input {...methods.register("applicantName")} placeholder="Enter your full name" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                                    {methods.formState.errors.applicantName && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.applicantName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mailing Address *</label>
                                    <textarea {...methods.register("address")} placeholder="Door No, Street, Landmark" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" rows={3} />
                                    {methods.formState.errors.address && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.address.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Place *</label>
                                        <input {...methods.register("place")} placeholder="Village/Town" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                                        {methods.formState.errors.place && <p className="text-red-500 text-xs mt-1">{methods.formState.errors.place.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                                        <input {...methods.register("phone")} placeholder="10-digit mobile number" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                key="step2"
                            >
                                <AuthoritySelector />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                key="step3"
                            >
                                <QuestionFields />
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                key="step4"
                            >
                                <DeclarationStep />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 flex justify-between gap-4">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                disabled={isFinishing}
                            >
                                Back
                            </button>
                        )}

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex-[2] px-6 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isFinishing}
                                className="flex-[2] px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isFinishing ? (
                                    <span className="animate-pulse">Generating PDF...</span>
                                ) : (
                                    <>
                                        <Download size={20} /> Download PDF
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </FormProvider>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex gap-4 items-start shadow-sm">
                    <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">How to Submit?</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Print the PDF, attach a ₹10 court fee stamp, and send it via Registered Post or submit in person.</p>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex gap-4 items-start shadow-sm">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">100% Secure</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Your data is processed only in your browser and is not stored on our servers.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
