"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

export default function QuestionFields() {
    const { register, control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
    });

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">RTI Subject & Questions</h2>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Line *</label>
                <input
                    {...register("subject")}
                    placeholder="Briefly describe the information requested"
                    className="w-full p-2 border rounded-md"
                    maxLength={100}
                />
                <p className="text-slate-400 text-[10px] mt-1 text-right">
                    {register("subject").name?.length || 0}/100 characters
                </p>
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message as string}</p>}
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Information Requested (Questions) *</label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-primary-700 uppercase">Q{index + 1}</span>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <textarea
                                {...register(`questions.${index}`)}
                                className="w-full p-2 border rounded-md text-sm"
                                rows={2}
                                placeholder="Ask a specific question..."
                            />
                            {errors.questions?.[index] && (
                                <p className="text-red-500 text-xs mt-1">{errors.questions[index].message as string}</p>
                            )}
                        </div>
                    </div>
                ))}

                {fields.length < 10 && (
                    <button
                        type="button"
                        onClick={() => append("")}
                        className="w-full py-2 border-2 border-dashed border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        <Plus size={16} /> Add Another Question
                    </button>
                )}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-bold text-blue-800 mb-1">Tips for effective questions:</h4>
                <ul className="text-xs text-blue-700 list-disc ml-4 space-y-1">
                    <li>Be specific about dates, locations, or document titles.</li>
                    <li>Avoid asking "why?" or asking for opinions.</li>
                    <li>Ask for facts and copies of documents.</li>
                </ul>
            </div>
        </div>
    );
}
