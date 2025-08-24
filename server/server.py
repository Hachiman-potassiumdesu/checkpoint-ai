from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import logging
import uvicorn

import fitz
import ast

from utils import *
from ai import extract_and_evaluate, reorganize_output, answer_question, generate_context

logging.basicConfig(filename='app.log', level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

frontend_port = 3000
PORT = 8000

origins = [
    f'http://localhost:{frontend_port}'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.post('/generate')
async def generate(
    file: UploadFile = File(...),
    mode: str = Form(...)
):
    logger.info('[POST] /generate')

    try:
        contents = await file.read()

        text = read_pdf_content(contents)

        response = extract_and_evaluate(text)
        output = reorganize_output(response.candidates[0].content.parts[0].text)

        output_text = output.candidates[0].content.parts[0].text
        output_text = output_text[output_text.index('['):output_text.rindex(']')+1].strip()
        output_json = ast.literal_eval(output_text)

        points = [item['claim'] for item in output_json]
        explanations = [item['explanation'] for item in output_json]
        scores = [item['score'] for item in output_json]

        sources_uri = [site.web.uri for site in response.candidates[0].grounding_metadata.grounding_chunks]
        sources_title = [site.web.title for site in response.candidates[0].grounding_metadata.grounding_chunks]

        context = f'{text} \n {response.candidates[0].content.parts[0].text}'
        return {
            'context': text,
            'points': points,
            'scores': scores,
            'explanations': explanations,
            'source_uri': sources_uri,
            'source_title': sources_title,
        }
    except Exception as e:
        logger.error(f'Error: {e}')
        return None
    
@app.post('/answer')
async def answer(
    context: str = Form(...),
    question: str = Form(...)
):
    logger.info('[POST] /answer')

    try:
        answer = answer_question(context, question)
        answer_text = answer.candidates[0].content.parts[0].text

        new_context = generate_context(context, answer_text)
        new_context_text = new_context.candidates[0].content.parts[0].text
        
        if answer.candidates[0].grounding_metadata.grounding_chunks:
            sources_uri = [site.web.uri for site in answer.candidates[0].grounding_metadata.grounding_chunks]
            sources_title = [site.web.title for site in answer.candidates[0].grounding_metadata.grounding_chunks]
        else:
            sources_uri = []
            sources_title = []

        return {
            'answer': answer_text,
            'new_context': new_context_text,
            'source_uri': sources_uri,
            'source_title': sources_title
        }
    except Exception as e:
        logger.error(f'Error: {e}')
        return None

@app.get('/')
async def read_root():
    logger.info('[GET] /')
    return {'message': 'Connected'}


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=PORT)