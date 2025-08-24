from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client()
MODEL_ID = 'gemini-2.5-flash'

with open('lib/extract_and_check.txt', 'r') as f:
    EXTRACT_CHECK_PROMPT = f.read()

with open('lib/reorganize_output.txt', 'r') as f:
    REORGANIZE_OUTPUT_PROMPT = f.read()

with open('lib/generate_context.txt', 'r') as f:
    GENERATE_CONTEXT_PROMPT = f.read()

def extract_and_evaluate(text):
    prompt = f"""
    {EXTRACT_CHECK_PROMPT}
    {text}
    """

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config={
            "tools": [{"google_search": {}}],
        }
    )

    return response

def reorganize_output(text):
    prompt = f"""
    {REORGANIZE_OUTPUT_PROMPT}
    {text}
    """

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt
    )

    return response

def answer_question(context, question):
    prompt = f"""
    You are a Professional at answering questions.
    Given this context:
    {context}

    answer the following question:
    {question}
    """

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt,
        config={
            "tools": [{"google_search": {}}],
        }
    )

    return response

def generate_context(prev_context, text):
    prompt = f"""
    {GENERATE_CONTEXT_PROMPT}

    The following is the previous context:
    {prev_context}

    The following is the new response:
    {text}
    """

    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt
    )

    return response

if __name__ == '__main__':
    prompt = 'The Pythagorean Theorem is x^2+y^2=z^3. This can be proved using geometry or dot products. Pythagorean only believed in "beautiful numbers," so he executed a follower that proposed the 1-1-root(2) triangle'

    response = extract_and_evaluate(prompt)

    response2 = reorganize_output(response.candidates[0].content.parts[0].text)

    print(response2.candidates[0].content.parts[0].text)
    print(', '.join([site.web.uri for site in response.candidates[0].grounding_metadata.grounding_chunks]))
    print(', '.join([site.web.title for site in response.candidates[0].grounding_metadata.grounding_chunks]))

# display(HTML(response.candidates[0].grounding_metadata.search_entry_point.rendered_content))