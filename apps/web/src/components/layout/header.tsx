import { SidebarTrigger } from '@repo/ui/components/sidebar'

export const Header = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
    </header>
  )
}
