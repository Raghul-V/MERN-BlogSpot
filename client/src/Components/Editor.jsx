import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
       [{ "header": [1, 2, 3, 4, false] }],
       ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
       [{"script": "sub"}, {"script": "super"}],
       [{"list": "ordered"}, {"list": "bullet"}, {"indent": "-1"}, {"indent": "+1"}],
       [{"direction": "rtl"}],
       [{"size": ["small", false, "large", "huge"]}],
       [{"color": []}], [{"background": []}],
       [{"font": []}], [{"align": []}],
       ["link", "image"],
       ["clean"]
    ]
};

function Editor({ value, onChange }) {
    return (
        <ReactQuill 
            value={value} 
            onChange={onChange}
            modules={modules}
        />
    );
}

export default Editor;
