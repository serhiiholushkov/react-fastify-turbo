import type { LucideIcon } from 'lucide-react'
import { ChevronRightIcon, SquarePenIcon } from 'lucide-react'
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/ui/components/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/ui/components/collapsible'

export type NavItem = {
  label: string
  to: string
  icon?: LucideIcon
  items?: NavItem[]
}

type Props = {
  navItems: NavItem[]
}

const NavMenuItem = ({ item }: { item: NavItem }) => {
  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link to={item.to}>
            {item.icon && <item.icon />}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible asChild className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {item.icon && <item.icon />}
            <span>{item.label}</span>
            <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.to}>
                <SidebarMenuSubButton asChild>
                  <Link to={subItem.to}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export const AppSidebar = ({ navItems }: Props) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isTasksRoute = pathname === '/tasks' || pathname.startsWith('/tasks')

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
                <NavMenuItem key={item.to} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
