from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from transformers import TextIteratorStreamer
from threading import Thread
from flask_socketio import emit  # Đảm bảo `emit` từ SocketIO được import để gửi tin nhắn realtime
import time
# Khởi tạo model và tokenizer
model_name = "checkpoint-340"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)

# Di chuyển model sang GPU nếu có
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)


# def send(text, idSocket, socketio):
#     # Sử dụng socketio.emit để đảm bảo an toàn khi gửi qua WebSocket trong môi trường đa luồng
#     socketio.emit('receive_message', {
#         "role": "answer",
#         "content": text,
#         "idSocket": idSocket,
#         "can_answer": True
#     }, room=idSocket)  # Gửi về WebSocket

# def joinText(text, idSocket, socketio):
#     global s  # Declare that we are using the global variable 's'
#     s = s + text  # Use 'join' to join the list of strings
#     print(s)
#     print("\n")
    
#     if len(s) >= 5:
#         print(s)
#         # send(s, idSocket, socketio)
#         s= ""
#     #     print(s)
#     #     print("\n")
    

# def test():
#     for i in range(0,11):
#         # print("Thahf công")
        
#         print(i)
#         # yield i
#     # return 3
#     yield 3

def askModel(messages):  # Thêm socketio vào tham số
# def askModel(messages):    
    try:
        chat_template = tokenizer.apply_chat_template(messages, tokenize=False)
        inputs = tokenizer(chat_template, return_tensors="pt").to(device)
        streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
        generation_kwargs = dict(
            **inputs,
            max_new_tokens=512,
            do_sample=True,
            temperature=0.7,
            top_k=75,
            top_p=0.85,
            eos_token_id=tokenizer.eos_token_id,
            pad_token_id=tokenizer.pad_token_id,
            streamer=streamer
        )
        # Generate in a separate thread to avoid blocking
        thread = Thread(target=model.generate, kwargs=generation_kwargs)
        thread.start()

        # yield streamer
        gen_text = ""
        for new_text in streamer:
            print(new_text, end="", flush=True)
            yield new_text

            # joinText(new_text, idSocket, socketio)
            # # return new_text
            
            # print(new_text, end="", flush=True)
            # yield new_text
              # Log ra từng đoạn văn bản được tạo
    #         socketio.emit('receive_message', {
    #         "role": "answer",
    #         "content": new_text,
    #         "idSocket": idSocket,
    #         "can_answer": True
    # }, room=idSocket)  # Gửi về WebSocket

        thread.join()  # Wait for the generation to complete
        # print(gen_text)
        # return gen_text
        
    except Exception as e:
        print(f"Error during text generation: {e}")
        socketio.emit('receive_message', {
            "role": "answer",
            "content": "Có lỗi xảy ra, vui lòng thử lại sau.",
            "idSocket": idSocket,
            "can_answer": False
        }, room=idSocket)
        return "Có lỗi xảy ra, vui lòng thử lại sau."