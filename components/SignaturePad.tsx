"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { Camera, Image as ImageIcon, RotateCcw } from "lucide-react";

interface SignaturePadProps {
    onSave: (signature: string) => void;
    defaultValue?: string;
}

export default function SignatureComponent({ onSave, defaultValue }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        if (canvasRef.current) {
            signaturePadRef.current = new SignaturePad(canvasRef.current, {
                backgroundColor: "rgb(255, 255, 255)",
            });

            signaturePadRef.current.on = () => {
                setIsEmpty(signaturePadRef.current?.isEmpty() ?? true);
                if (!signaturePadRef.current?.isEmpty()) {
                    onSave(signaturePadRef.current?.toDataURL() ?? "");
                }
            };

            if (defaultValue) {
                signaturePadRef.current.fromDataURL(defaultValue);
            }
        }

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
                canvas.getContext("2d")?.scale(ratio, ratio);
                signaturePadRef.current?.clear();
            }
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener("resize", resizeCanvas);
    }, [defaultValue, onSave]);

    const clear = () => {
        signaturePadRef.current?.clear();
        setIsEmpty(true);
        onSave("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                signaturePadRef.current?.fromDataURL(dataUrl);
                onSave(dataUrl);
                setIsEmpty(false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative border-2 border-slate-200 rounded-lg overflow-hidden bg-white h-48">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full touch-none"
                />
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 flex-col">
                        <span className="text-sm">Sign here</span>
                    </div>
                )}
                <button
                    type="button"
                    onClick={clear}
                    className="absolute top-2 right-2 p-1 bg-slate-100 rounded text-slate-500 hover:text-red-500 transition-colors"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">
                    <ImageIcon size={16} /> Gallery
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
                <label className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer">
                    <Camera size={16} /> Capture
                    <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileUpload} />
                </label>
            </div>
        </div>
    );
}
