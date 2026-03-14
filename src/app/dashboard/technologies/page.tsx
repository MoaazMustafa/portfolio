import { prisma } from "@/lib/prisma"
import { TechnologyList } from "@/components/dashboard/technology-list"
import { TechnologyDialog } from "@/components/dashboard/technology-dialog"
import { SeedTechnologiesButton } from "@/components/dashboard/seed-technologies-button"

export default async function TechnologiesPage() {
  const technologies = await prisma.technology.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Technologies</h1>
            <p className="text-muted-foreground">
                Manage your technology stack and skills categorization.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <SeedTechnologiesButton />
            <TechnologyDialog />
        </div>
      </div>
      
      <TechnologyList technologies={technologies} />
    </div>
  )
}
