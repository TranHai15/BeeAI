from flask import Flask, Response, request
from flask_cors import CORS
import time
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from transformers import TextIteratorStreamer
from threading import Thread

# Khởi tạo model và tokenizer
model_name = "checkpoint-740"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)

# Di chuyển model sang GPU nếu có
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)

# Hàm xử lý luồng phản hồi từ model
def askModel(messages):
    chat_template = tokenizer.apply_chat_template(messages, tokenize=False)
    inputs = tokenizer(chat_template, return_tensors="pt").to(device)
    streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
    generation_kwargs = dict(
        **inputs,
        max_new_tokens=1024,
        do_sample=True,
        temperature=0.3,
        top_k=75,
        top_p=0.85,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.pad_token_id,
        streamer=streamer
    )
    # Generate in a separate thread to avoid blocking
    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()
    yield "data: [START]\n\n"
    print("\n\n")
    for new_text in streamer:
        print(new_text, end="", flush=True)
        yield f"data: {new_text}\n\n"
    thread.join()
    print("\n\n")
    yield "data: [DONE]\n\n"

# Khởi tạo Flask app
app = Flask(__name__)
CORS(app)  # Cho phép tất cả các nguồn truy cập

@app.route('/', methods=['POST'])
def stream():
    try:
        data = request.get_json()
        if not data:
            return Response("Invalid JSON", status=400, content_type='text/plain')
        
        messages = data.get('messages', [])
        print(messages)
        if not messages:
            return Response("Missing 'messages' in JSON", status=400, content_type='text/plain')
        
        return Response(
            askModel(messages),
            content_type='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'X-Accel-Buffering': 'no'  # Thêm header này
            }
        )
        
    except Exception as e:
        return Response(f"Error: {str(e)}", status=500, content_type='text/plain')

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
