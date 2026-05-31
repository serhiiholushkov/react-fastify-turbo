import type { LucideIcon } from 'lucide-react'
import { SquarePenIcon } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/sidebar'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
}

type Props = {
  navItems: NavItem[]
}

export const AppSidebar = ({ navItems }: Props) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isTasksRoute = pathname === '/tasks' || pathname.startsWith('/tasks')

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          {isTasksRoute && (
            <SidebarGroupAction asChild title="Create new task">
              <Link to="/tasks" search={{ createTask: true }}>
                <SquarePenIcon />
                <span className="sr-only">Create new task</span>
              </Link>
            </SidebarGroupAction>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
