"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { File, SearchIcon, ShoppingCart, FileInput, BarChart3 } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => unknown) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
      >
        <SearchIcon className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/orders"))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/form-submissions"))}>
              <FileInput className="mr-2 h-4 w-4" />
              <span>Form Submissions</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/analytics"))}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => runCommand(() => console.log("Creating new order..."))}>
              <File className="mr-2 h-4 w-4" />
              <span>Create New Order</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
