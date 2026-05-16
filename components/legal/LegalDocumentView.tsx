import { Badge } from "@/components/ui/Badge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { LegalDocument } from "@/data/legal";

export function LegalDocumentView({
  document,
  updatedLabel
}: {
  document: LegalDocument;
  updatedLabel: string;
}) {
  return (
    <div className="w-full space-y-6">
      <SurfaceCard className="relative overflow-hidden p-6 sm:p-8">
        <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative max-w-4xl">
          <Badge variant="amber">
            {updatedLabel}: {document.updatedAt}
          </Badge>
          <h1 className="page-title mt-5">{document.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
            {document.intro}
          </p>
        </div>
      </SurfaceCard>

      <div className="grid gap-4">
        {document.sections.map((section) => (
          <SurfaceCard key={section.title} className="p-5 sm:p-6">
            <h2 className="text-xl font-black text-white">{section.title}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300 sm:text-base">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
