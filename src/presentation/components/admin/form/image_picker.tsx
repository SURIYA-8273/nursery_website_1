import { Upload } from "lucide-react";

export function ImagePicker({handleImageChange,acceptFormat,multiple=false,title="Upload Images"}: {handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,acceptFormat?: string,multiple?: boolean,title?: string}){
    return(
        <div className="border-2 border-dashed border-black/30 rounded-sm p-6 md:p-8 text-center hover:bg-surface/50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept={acceptFormat || "image/*"}
                            multiple={multiple}
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2 text-black">
                            <Upload size={32} />
                            <span>{title}</span>
                        </div>
                    </div>
    )
}