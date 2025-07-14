// components/RichTextEditor.tsx
import  { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const RichTextEditor = () => {
  const [value, setValue] = useState<string>('')

       const formats= [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'indent', 'link', 'image', 'code-block', 'script'
    ];

    const modules ={
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    }

  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        className="min-h-[200px]"
        modules={modules}
        formats={formats}
      />
    </div>
  )
}



export default RichTextEditor



