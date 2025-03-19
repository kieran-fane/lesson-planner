# transcribe.py
import sys
import whisper

if len(sys.argv) < 2:
    print("No audio file provided")
    sys.exit(1)

audio_file = sys.argv[1]

# Load a pre-trained Whisper model (choose from tiny, base, small, medium, large)
model = whisper.load_model("base")
result = model.transcribe(audio_file)

# Print the transcript so that Node.js can capture it.
print(result.get("text", ""))
