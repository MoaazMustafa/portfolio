import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
        <Button>Add Project</Button>
      </div>
      <div className="text-muted-foreground flex items-center justify-center rounded-lg border border-dashed p-8 shadow-sm">
        List of projects will appear here.
      </div>
    </div>
  );
}
