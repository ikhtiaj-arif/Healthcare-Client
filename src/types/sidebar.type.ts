export interface ISidebarItem {
    title: string
    url: string
}

export interface ISidebarGroup {
    title: string
    items: ISidebarItem[]
}

export type SidebarItems = ISidebarGroup[]