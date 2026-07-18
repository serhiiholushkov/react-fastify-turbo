import type { PropsWithChildren } from 'react'
import { HomeIcon, ListTodoIcon, TestTubesIcon } from 'lucide-react'
import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar'
import { AppSidebar } from '../nav/app-sidebar'
import type { NavItem } from '../nav/app-sidebar'
import { Header } from './header'

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/', icon: HomeIcon },
  { label: 'Tasks', to: '/tasks', icon: ListTodoIcon },
  {
    label: 'Tests',
    to: '#',
    items: [{ label: 'Memos', to: '/tests/memos', icon: TestTubesIcon }],
  },
]

type Props = PropsWithChildren

export const MainLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar navItems={NAV_ITEMS} />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
