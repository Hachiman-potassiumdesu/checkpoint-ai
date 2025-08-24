from utils import *
from ai import extract_and_evaluate, reorganize_output

import ast
def generate():
    try:
        text = 'The Pythagorean Theorem is x^2+y^2=z^3. This can be proved using geometry or dot products. Pythagorean only believed in "beautiful numbers," so he executed a follower that proposed the 1-1-root(2) triangle'

        response = extract_and_evaluate(text)
        output = reorganize_output(response.candidates[0].content.parts[0].text)

        output_text = output.candidates[0].content.parts[0].text
        output_text = output_text[output_text.index('['):output_text.rindex(']')+1].strip()
        print(output_text)
        output_json = ast.literal_eval(output_text)

        points = [item['claim'] for item in output_json]
        explanations = [item['explanation'] for item in output_json]
        scores = [item['score'] for item in output_json]

        sources_uri = [site.web.uri for site in response.candidates[0].grounding_metadata.grounding_chunks]
        sources_title = [site.web.title for site in response.candidates[0].grounding_metadata.grounding_chunks]

        return {
            'points': points,
            'scores': scores,
            'explanations': explanations,
            'source_uri': sources_uri,
            'source_title': sources_title,
        }
    except Exception as e:
        print(e)
        return None
    
output = generate()
print(output)