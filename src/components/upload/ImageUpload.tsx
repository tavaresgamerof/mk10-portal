"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className = "", label = "Imagem" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem muito grande. Maximo 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {value ? (
        <div className="relative w-full h-48 bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full h-48 bg-dark-surface border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive ? "border-primary bg-primary/5" : "border-dark-border hover:border-primary/50"
          }`}
        >
          <Upload size={32} className="text-text-muted mb-2" />
          <p className="text-text-muted text-sm">Arraste ou clique para enviar</p>
          <p className="text-text-muted/60 text-xs mt-1">PNG, JPG, WebP (max 5MB)</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
