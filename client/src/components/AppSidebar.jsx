import { Home, Settings, User, LayoutDashboard, LogOut, Users, FolderOpen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser, selectIsAdmin, logout } from "@/store/slices/authSlice"

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isAdmin = useSelector(selectIsAdmin)

  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    ...(isAdmin ? [{
      title: "Users",
      url: "/users",
      icon: Users,
    }] : []),
    {
      title: "Categories",
      url: "/categories",
      icon: FolderOpen,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const handleProfile = () => {
    navigate("/profile")
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleProfile} className="w-full justify-start gap-2 py-6 px-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col items-start text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-semibold truncate w-32 text-left">{user?.username || "User"}</span>
                <span className="text-xs text-muted-foreground truncate w-32 text-left">{user?.email || ""}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
