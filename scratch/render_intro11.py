import os, sys, json, asyncio, subprocess
import edge_tts
from mutagen.mp3 import MP3

manual_dir = os.path.join('public', 'Capacitacion SAP', '10_Intro_11_Overview_IntroSAPB1_ES')
img_dir = os.path.join(manual_dir, 'Imagenes_Diapositivas')
output_video = os.path.join(manual_dir, 'clase_video.mp4')
sync_file = os.path.join(manual_dir, 'clase_sync.json')

with open(os.path.join('scratch', 'intro11_prepared_sync.json'), 'r', encoding='utf-8') as f:
    items = json.load(f)

async def run():
    temp_files = []
    video_clips = []
    current_time = 0.0
    updated_sync = []

    print(f'Comenzando renderizado pedagogico ({len(items)} slides)...', flush=True)
    for item in items:
        idx = item['slide_index']
        img_name = item['image_file']
        script = item['script_text']
        img_path = os.path.join(img_dir, img_name)

        audio_file = f'temp_aud_in11_{idx}.mp3'
        video_clip = f'temp_vid_in11_{idx}.mp4'

        comm = edge_tts.Communicate(script, 'es-MX-JorgeNeural')
        await comm.save(audio_file)
        audio_dur = MP3(audio_file).info.length
        clip_dur = audio_dur + 0.6

        cmd_ffmpeg = [
            'ffmpeg', '-y', '-loop', '1', '-framerate', '25',
            '-i', img_path, '-i', audio_file,
            '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black',
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26',
            '-af', 'apad=pad_dur=0.6', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100', '-pix_fmt', 'yuv420p',
            '-t', str(clip_dur), video_clip
        ]
        subprocess.run(cmd_ffmpeg, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        start_t = round(current_time, 2)
        end_t = round(current_time + clip_dur, 2)
        current_time += clip_dur

        updated_sync.append({
            'slide_index': idx,
            'image_file': img_name,
            'script_text': script,
            'start_time': start_t,
            'end_time': end_t
        })

        temp_files.extend([audio_file, video_clip])
        video_clips.append(video_clip)
        print(f'  [Slide {idx}/19] lista ({audio_dur:.1f}s | {start_t}s -> {end_t}s)', flush=True)

    concat_list = 'concat_in11.txt'
    with open(concat_list, 'w', encoding='utf-8') as f:
        for vc in video_clips:
            f.write(f"file '{vc}'\n")

    print('Concatenando clase_video.mp4...', flush=True)
    cmd_concat = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', concat_list, '-c', 'copy', output_video]
    subprocess.run(cmd_concat, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    with open(sync_file, 'w', encoding='utf-8') as f:
        json.dump(updated_sync, f, ensure_ascii=False, indent=2)

    temp_files.append(concat_list)
    for tf in temp_files:
        if os.path.exists(tf):
            try: os.remove(tf)
            except: pass

    print(f'FINALIZADO! Duracion total: {current_time:.1f}s', flush=True)

if __name__ == '__main__':
    asyncio.run(run())
