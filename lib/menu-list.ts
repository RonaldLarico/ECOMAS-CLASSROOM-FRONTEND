import {
  Tag,
  Users,
  Settings,
  Bookmark,
  Building,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  ChartArea,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type MenuItem = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

export type MenuGroup = {
  groupLabel: string;
  menus: MenuItem[];
};

export function getMenuList(pathname: string, role: string): MenuGroup[] {
  console.log(role);
  let menuList: MenuGroup[] = [
    {
      groupLabel: "Ajustes",
      menus: [
        {
          href: "/account",
          label: "Mi perfil",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];

  if (role === "SUPER_ADMIN") {
    menuList.unshift({
      groupLabel: "",
      menus: [
        {
          href: "/su-admin-home",
          label: "Inicio",
          active: pathname.includes("/su-admin-home"),
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/corporations",
          label: "Entidades",
          active: pathname.includes("/corporations"),
          icon: Building,
          submenus: [],
        },
        {
          href: "/users",
          label: "Usuarios",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },

      ],
    },
    {
      groupLabel: "Administración",
      menus: [
        {
          href: "/admin-dashboard",
          label: "Inicio",
          active: pathname.includes("/admin-dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/schedule",
          label: "Cronograma",
          active: pathname.includes("/schedule"),
          icon: Building,
          submenus: [
            {
              href: "/schedule/create-schedule",
              label: "Crear cronograma",
              active: pathname.includes("/schedule/create-schedule"),
            },
            {
              href: "/schedule/view-schedule",
              label: "Ver Cronograma",
              active: pathname.includes("/schedule/view-schedule"),
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Asesoría",
      menus: [
        {
          href: "/advice-dashboard",
          label: "Inicio",
          active: pathname.includes("/advice-dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/advice-stadistics",
          label: "Estadísticas",
          active: pathname.includes("/advice-stadistics"),
          icon: Building,
          submenus: [],
        },
      ],
    },

  );
  } else if (role === "ADMIN") {
    menuList.unshift({
      groupLabel: "",
      menus: [
        {
          href: "/advice-dashboard",
          label: "Inicio",
          active: pathname.includes("/advice-dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/advice-dashboard",
          label: "Estadísticas",
          active: pathname.includes("/stadistics"),
          icon: ChartArea,
          submenus: [],
        },
      ],
    });
  }

  return menuList;
}