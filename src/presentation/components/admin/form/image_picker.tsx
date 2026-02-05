import { Upload } from "lucide-react";

interface ImagePickerProps {
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    acceptFormat?: string;
    multiple?: boolean;
    title?: string;
    error?: string;
}

export function ImagePicker({ handleImageChange, acceptFormat, multiple = false, title = "Upload Images", error }: ImagePickerProps) {
    return (
        <div className="space-y-1">
            <div className={`border-2 border-dashed ${error ? 'border-red-500 bg-red-50' : 'border-black/30 hover:bg-surface/50'} rounded-sm p-6 md:p-8 text-center transition-colors cursor-pointer relative`}>
                <input
                    type="file"
                    accept={acceptFormat || "image/*"}
                    multiple={multiple}
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`flex flex-col items-center gap-2 ${error ? 'text-red-500' : 'text-black'}`}>
                    <Upload size={32} />
                    <span>{title}</span>
                </div>
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        </div>
    )
}