// „Jak to działa?” — wstęp, 3 zasady i zdjęcia porcji. Ta sama treść na ekranie intro i w zakładce (teksty: config/texts.ts).

import garscPhoto from '../assets/intro/porcja-garsc.jpg'
import owocPhoto from '../assets/intro/porcja-owoc.avif'
import { INTRO } from '../config/texts'
import { InfoTip } from './InfoTip'

const PHOTOS = [
  { src: owocPhoto, position: 'object-[50%_55%]' }, // kadr: owoc na dłoni
  { src: garscPhoto, position: 'object-[50%_42%]' }, // kadr: garść borówek
]

export function HowItWorks() {
  return (
    <div className="space-y-6">
      <p className="relative text-base leading-relaxed">
        {INTRO.lead}
        <InfoTip title={INTRO.research.title} summary={INTRO.research.summary} source={INTRO.research.source} />
      </p>

      <section>
        <h2 className="text-2xl font-extrabold">{INTRO.howTitle}</h2>
        <ul className="mt-3 space-y-3">
          {INTRO.steps.map((step, i) => (
            <li key={step.title} className="flex gap-3 rounded-2xl bg-white p-4 text-stone-800 shadow-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-extrabold text-white">{i + 1}</span>
              <p>
                <strong className="font-extrabold">{step.title}:</strong> {step.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <figure>
        <div className="grid grid-cols-2 gap-3">
          {PHOTOS.map((photo, i) => (
            <div key={photo.src} className="flex flex-col overflow-hidden rounded-2xl">
              <img src={photo.src} alt={INTRO.photos[i].alt} className={`aspect-square w-full object-cover ${photo.position}`} />
              <p className="flex-1 bg-black px-3 py-2 text-center text-white">
                <span className="block text-xs font-extrabold">{INTRO.photos[i].caption}</span>
                <span className="block text-[11px] text-stone-300">{INTRO.photos[i].examples}</span>
              </p>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 text-lg font-extrabold">{INTRO.photoNote}</figcaption>
      </figure>
    </div>
  )
}
