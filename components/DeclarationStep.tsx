"use client";

import { useFormContext } from "react-hook-form";
import SignatureComponent from "./SignaturePad";

export default function DeclarationStep() {
    const { register, setValue, watch, formState: { errors } } = useFormContext();
    const signature = watch("signature");

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Declaration & Signature</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Place *</label>
                    <input {...register("declarationPlace")} className="w-full p-2 border rounded-md" />
                    {errors.declarationPlace && <p className="text-red-500 text-xs mt-1">{errors.declarationPlace.message as string}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                    <input {...register("declarationDate")} type="date" className="w-full p-2 border rounded-md" />
                    {errors.declarationDate && <p className="text-red-500 text-xs mt-1">{errors.declarationDate.message as string}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Signature *</label>
                <SignatureComponent
                    onSave={(sig) => setValue("signature", sig, { shouldValidate: true })}
                    defaultValue={signature}
                />
                <input type="hidden" {...register("signature", { required: "Signature is required" })} />
                {errors.signature && <p className="text-red-500 text-xs mt-1">{errors.signature.message as string}</p>}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office.
                </p>
            </div>
        </div>
    );
}
