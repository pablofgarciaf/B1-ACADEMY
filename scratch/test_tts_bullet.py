import subprocess
import os

test_text = "Al finalizar este tema, podrá: \uf0a7 Crear y asignar rangos"

# 1. Shell=True
cmd_str = f'edge-tts --text "{test_text}" --voice es-MX-JorgeNeural --write-media test_shell.mp3'
res_shell = subprocess.run(cmd_str, shell=True, capture_output=True, text=True)
print("Shell=True returncode:", res_shell.returncode)
print("Shell=True stderr:", res_shell.stderr)

# 2. Shell=False with list
cmd_list = ["edge-tts", "--text", test_text.replace("\uf0a7", ""), "--voice", "es-MX-JorgeNeural", "--write-media", "test_list.mp3"]
res_list = subprocess.run(cmd_list, shell=False, capture_output=True, text=True)
print("Shell=False without \uf0a7 returncode:", res_list.returncode)
print("Shell=False stderr:", res_list.stderr)

for f in ["test_shell.mp3", "test_list.mp3"]:
    if os.path.exists(f): os.remove(f)
