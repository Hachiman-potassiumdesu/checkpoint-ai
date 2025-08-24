import fitz
import io

def read_pdf_content(contents):
    contents = io.BytesIO(contents)
    pdf = fitz.open(stream=contents, filetype='pdf')

    text = ''
    for page in pdf:
        text += page.get_text()
    
    return text
