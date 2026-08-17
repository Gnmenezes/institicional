"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

export default function ImageUploader({
  value,
  onChange,
  label = "Fotos",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        try {
          const blob = await upload(`portfolio/${Date.now()}-${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/upload",
            multipart: true,
          });
          uploaded.push(blob.url);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Falha no upload.");
        }
      }
    } finally {
      if (uploaded.length > 0) onChange([...value, ...uploaded]);
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="text-sm font-medium text-brand-navy">{label}</label>

      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url, index) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-brand-navy-light">
              <Image src={url} alt="" fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
          className="text-sm text-brand-navy/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-navy-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-navy hover:file:bg-brand-navy/10"
        />
        {uploading && <p className="mt-2 text-xs text-brand-navy/50">Enviando...</p>}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
