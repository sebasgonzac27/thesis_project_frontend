import React from "react";
import { Input } from "@/components/ui/input";


function ImageUploader({ onImageChange }) {
  const [previewUrl, setPreviewUrl] = React.useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      onImageChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="imageUpload" className="text-sm font-medium text-gray-700">
        Subir imagen
      </label>
      <Input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
      />
      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Vista previa:</p>
          <img src={previewUrl} alt="Vista previa de imagen" className="w-32 h-32 object-cover mt-2 rounded-md" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;