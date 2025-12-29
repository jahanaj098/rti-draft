"use client";

import { useFormContext } from "react-hook-form";
import { DISTRICTS, LOCAL_BODY_TYPES, LOCAL_BODIES_MOCK } from "@/lib/kerala-data";
import { useEffect, useState } from "react";

export default function AuthoritySelector() {
    const { register, watch, setValue, formState: { errors } } = useFormContext();
    const district = watch("district");
    const localBodyType = watch("localBodyType");
    const [localBodyOptions, setLocalBodyOptions] = useState<string[]>([]);

    useEffect(() => {
        if (district && localBodyType) {
            const key = `${district}-${localBodyType}`;
            setLocalBodyOptions(LOCAL_BODIES_MOCK[key] || ["Sample Local Body 1", "Sample Local Body 2"]);
        } else {
            setLocalBodyOptions([]);
        }
    }, [district, localBodyType]);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">Authority Selection</h2>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District *</label>
                <select {...register("district")} className="w-full p-2 border rounded-md">
                    <option value="">Select District</option>
                    {DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message as string}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Local Body Type *</label>
                <select {...register("localBodyType")} className="w-full p-2 border rounded-md">
                    <option value="">Select Local Body Type</option>
                    {LOCAL_BODY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                {errors.localBodyType && <p className="text-red-500 text-xs mt-1">{errors.localBodyType.message as string}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Local Body Name *</label>
                <select {...register("localBodyName")} className="w-full p-2 border rounded-md" disabled={!localBodyOptions.length}>
                    <option value="">Select Local Body Name</option>
                    {localBodyOptions.map((n) => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
                {errors.localBodyName && <p className="text-red-500 text-xs mt-1">{errors.localBodyName.message as string}</p>}
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mt-6">
                <p className="text-xs text-amber-800">
                    <strong>Note:</strong> The RTI will be addressed to the <strong>Public Information Officer</strong> of the selected local body.
                </p>
            </div>
        </div>
    );
}
