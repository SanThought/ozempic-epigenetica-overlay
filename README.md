# ozempic-epigenetica-overlay

Infografías y texto sobre el espacio blanco de una conversación grabada (3:08, español)
sobre Ozempic, fármacos antiedad y epigenética. Proyecto separado de
[style-exploration-drafts](https://github.com/SanThought/style-exploration-drafts).

## Qué es

El video fuente es un plano fijo de dos personas hablando; la mitad superior del cuadro
es pared vacía. Este proyecto dibuja ahí, en tiempo con la conversación: 14 escenas de
infografía (fichas, diagramas de fases clínicas, contador animado, VS Novo Nordisk vs
Eli Lilly, doble hélice de ADN con genes ON/OFF, molécula de grupo metilo CH₃,
metilación de citosina → gen apagado, recap final).

## Pipeline (determinista por timecode)

1. `overlay.html` — canvas 1280x720 transparente; `window.__renderAtTime(t)` dibuja el
   frame exacto para un tiempo `t` (fuentes IM Fell English + Special Elite, OFL, en `fonts5/`).
2. `render_ov.js` — puppeteer-core headless, captura PNG con `omitBackground:true`.
   Env: `PAGE`, `FPS=24`, `START`, `END`, `TL_JSON`. Escribe `ov/f%04d.png`.
3. `still_ov.js` — stills de prueba puntuales (env `STILLS=5,20.2,...`).
4. Ensamblaje:
   `ffmpeg -i src.mp4 -framerate 24 -i ov/f%04d.png -filter_complex "[0:v]scale=1280:720[s];[s][1:v]overlay=0:0:format=auto,format=yuv420p" -c:v libx264 -crf 21 -c:a copy final.mp4`
5. `timeline.json` — mapa de escenas ↔ beats de la conversación y cómo se derivó el timing
   (silencedetect + mapeo ordinal sobre la transcripción).

## Regla de sincronía

Cada escena entra y sale sobre pausas reales del habla (silencios detectados), y sus
elementos internos caen sobre las frases que nombran. El reveal de OZEMPIC cae cuando
lo nombran (19.0s); el contador −20 kg mientras cuenta lo de la amiga; CH₃ se acopla a
la citosina justo en "apaga la expresión de ese gen".

## Archivos

- `final` render: `part00.mp4` + `part01.mp4` (29MB total, cortados con
  `ffmpeg -f segment -c copy`; unir con el concat demuxer, `-c copy`).
- Los 4502 PNGs del overlay (~transparentes) no se suben: los regenera el paso 2.
- El video fuente no se incluye (material privado de la conversación).
