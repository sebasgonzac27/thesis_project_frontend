import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

import Quill from 'quill';
Quill.register('modules/imageResize', ImageResize);


export default function TextEditor({ editorContent, onEditorChange }) {
  const [content, setContent] = useState(editorContent);
  const quillRef = useRef(null);

  const handleChange = (value) => {
    setContent(value);
    onEditorChange(value);
  };

  const handleImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const editor = quillRef.current.getEditor();
        const selection = editor.getSelection();
        const imageUrl = reader.result;

        if (selection && selection.index !== null) {
          editor.insertEmbed(selection.index, 'image', imageUrl, 'user');
          const img = editor.container.querySelector('img');
          const divContainer = img.parentElement;

          divContainer.style.resize = 'none';
          divContainer.style.overflow = 'hidden';
          divContainer.style.maxWidth = '100%';
        } else {
          editor.insertEmbed(editor.getLength(), 'image', imageUrl, 'user');
        }
      };
      if (file) reader.readAsDataURL(file);
    };
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline'],
      ['link'],
      ['image'],
    ],
    imageResize: {
      displaySize: true,
      maxWidth: 500,
    }
  };

  return (
    <div style={{ resize:'none', overflow:'hidden', maxWidth:'100%'}}>
      <ReactQuill
        ref={quillRef}
        value={editorContent}
        onChange={handleChange}
        theme="snow"
        modules={modules}
      />
    </div>
  );
};
