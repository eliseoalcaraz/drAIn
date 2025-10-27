"use client";

import { useRouter } from "next/navigation";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}) {
  const router = useRouter();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();

  // Close sidebar when navigating to map or simulation pages
  const handleNavClick = (e: React.MouseEvent, url: string) => {
    if (url) {
      // Prevent default navigation
      e.preventDefault();

      // Close sidebar immediately
      if (isMobile) {
        setOpenMobile(false);
      } else {
        setOpen(false);
      }

      // Navigate after a brief delay to ensure sidebar closes
      setTimeout(() => {
        router.push(url);
      }, 200);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="pl-1">
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={(e) => item.url && handleNavClick(e, item.url)}
                >
                  {item.icon && <item.icon className="text-[#b2adab]" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
