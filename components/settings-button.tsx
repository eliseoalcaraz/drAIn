import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MoreOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8.5 h-8.5 bg-[#EBEBEB] border border-[#DCDCDC] rounded-full flex items-center justify-center transition-colors">
          <MoreHorizontal className="w-5 h-5 text-[#8D8D8D] hover:text-black" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => { /* console.log("Edit clicked") */ }}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { /* console.log("Delete clicked") */ }}>
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { /* console.log("Share clicked") */ }}>
          Share
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
