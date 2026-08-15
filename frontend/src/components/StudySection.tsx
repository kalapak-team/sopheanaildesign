import Image from "next/image";
import type { SiteSettings } from "@/lib/api";
import { settingImage, shouldUnoptimize } from "@/lib/media";
import {
  RichPlainText,
  studyBenefitsFromSettings,
  type StudyBenefit,
} from "@/lib/content";

const defaultBenefits: StudyBenefit[] = [
  {
    title: "Professionelle Pflege:",
    text: "In einem Nagelstudio arbeiten erfahrene Nageltechniker, die über das notwendige Know-how und die Fähigkeiten verfügen, um eine professionelle Nagelpflege anzubieten.",
  },
  {
    title: "Entspannung und Wohlbefinden:",
    text: "Ein Besuch im Nagelstudio kann eine entspannende Erfahrung sein. Die Behandlungen bieten oft auch eine kurze Auszeit vom Alltagsstress und tragen zum allgemeinen Wohlbefinden bei.",
  },
  {
    title: "Selbstwertgefühl:",
    text: "Gepflegte Nägel können das Selbstwertgefühl steigern und ein Gefühl der Zufriedenheit und Selbstfürsorge fördern.",
  },
  {
    title: "Spezialisierte Behandlungen:",
    text: "Ein Nagelstudio bietet oft spezialisierte Behandlungen wie Nagelverlängerungen, Gel- oder Acrylnägel an, die zu Hause schwer umzusetzen sind.",
  },
];

const defaultStudyBody =
  "Diejenigen, die regelmäßig eine Maniküre genießen, sind sich des Effekts bewusst: **Ein Besuch im Nagelstudio** kann selbst den schlechtesten Tag aufhellen und zu einem positiven Erlebnis machen. Eine kürzlich durchgeführte Studie hat nun wissenschaftlich bestätigt, dass dieser Effekt real ist. Atsushi Kawakubo, der Verfasser der Studie, betonte gegenüber dem Wissenschaftsmagazin \"Psypost\": \"Es war längst überfällig. Es gibt zahlreiche Forschungsergebnisse, die auf die Wechselwirkung von Selbstfürsorge und deren Auswirkungen auf das psychische Wohlbefinden hinweisen. Die Vorstellung, dass etwas so Einfaches wie eine Maniküre einen Einfluss auf die psychische Gesundheit haben könnte, hat mich fasziniert.\"";

export function StudySection({ settings }: { settings: SiteSettings }) {
  const studyImage = settingImage(
    settings,
    "study_image",
    "/images/about/nails-study.jpg"
  );
  const benefits = studyBenefitsFromSettings(settings);
  const rows = benefits.length ? benefits : defaultBenefits;
  const body = settings.study_body?.trim() || defaultStudyBody;
  const linkUrl =
    settings.study_link_url ||
    "https://www.frontiersin.org/articles/10.3389/fpsyg.2023.1112110/full";
  const benefitsHeading =
    settings.study_benefits_heading ||
    "Ein Nagelstudio bietet zahlreiche Vorteile, darunter:";

  return (
    <section
      className="relative bg-[#1d1d1d] py-[80px] text-white"
      style={{
        backgroundImage: "linear-gradient(#141414, transparent 10%)",
      }}
    >
      <div className="mx-auto w-[90%] max-w-[1280px]">
        <h2 className="pb-[25px] text-center text-[37px] font-bold uppercase leading-[75%] text-white">
          {settings.study_label}
        </h2>
        <h1 className="pb-[25px] text-center text-[45px] font-bold uppercase leading-[100%] tracking-[-1.5px] text-white min-[768px]:text-[65px] min-[992px]:text-[96px]">
          {settings.study_title}
        </h1>
        <p className="text-center text-[16px] leading-relaxed text-white min-[768px]:text-left">
          <RichPlainText text={body} linkUrl={linkUrl} linkLabel="Studie" />
        </p>

        <h4 className="pb-[25px] pt-10 text-center text-2xl font-bold uppercase tracking-[0.25px] text-white min-[768px]:text-[34px]">
          {benefitsHeading}
        </h4>

        <div className="mt-8 grid grid-cols-1 gap-4 min-[768px]:grid-cols-[2fr_1fr] min-[768px]:gap-8">
          <div className="overflow-hidden rounded-xl border border-brand-pink bg-[#161616]">
            {rows.map((item, i) => (
              <div
                key={`${item.title}-${i}`}
                className={`grid grid-cols-1 gap-4 p-6 min-[768px]:grid-cols-[1fr_1.8fr] min-[768px]:p-8 ${
                  i % 2 === 0 ? "bg-[#202020]" : "bg-transparent"
                }`}
              >
                <h4 className="whitespace-pre-line text-center text-2xl font-bold uppercase leading-[100%] text-white min-[768px]:text-[34px]">
                  {item.title}
                </h4>
                <ul className="list-disc pl-5 text-left">
                  <li className="text-left text-[#eee]">{item.text}</li>
                </ul>
              </div>
            ))}
          </div>

          <div className="relative min-h-[240px] overflow-hidden rounded-xl border border-brand-pink min-[768px]:min-h-0">
            <Image
              src={studyImage}
              alt="Nail art"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 33vw"
              unoptimized={shouldUnoptimize(studyImage)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
