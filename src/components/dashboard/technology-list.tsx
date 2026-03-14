"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { deleteTechnology } from "@/lib/actions/technology"
import { TechnologyDialog } from "@/components/dashboard/technology-dialog"

interface Technology {
    id: string
    name: string
    slug: string
    category: string
    icon: string | null
}

interface TechnologyListProps {
  technologies: Technology[]
}

export function TechnologyList({ technologies }: TechnologyListProps) {
  // Group by category
  const grouped = technologies.reduce((acc, tech) => {
    const cat = tech.category || "Other"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(tech)
    return acc
  }, {} as Record<string, Technology[]>)

  const categories = Object.keys(grouped).sort()

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        try {
            const result = await deleteTechnology(id)
            if (result.success) {
                toast.success("Technology deleted")
            } else {
                toast.error("Failed to delete")
            }
        } catch (error) {
            toast.error("Failed to delete")
        }
    }
  }

  if (technologies.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">No technologies found</h3>
            <p className="text-sm text-center max-w-sm mb-4">
                Get started by adding a technology manually or seeding defaults.
            </p>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {grouped[category].map((tech) => (
              <Card key={tech.id} className="relative group overflow-hidden transition-all hover:shadow-md border-muted">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium truncate pr-6" title={tech.name}>
                    {tech.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="text-xs text-muted-foreground font-mono mb-2 truncate">
                        {tech.slug}
                    </div>
                    {tech.icon && (
                        <div className="text-xs text-muted-foreground truncate" title={tech.icon}>
                            Icon: {tech.icon}
                        </div>
                    )}
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <TechnologyDialog technology={tech} />
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleDelete(tech.id, tech.name)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
