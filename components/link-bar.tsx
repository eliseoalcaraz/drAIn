"use client";

import * as React from "react";
import { IconInfoCircle, IconStar } from "@tabler/icons-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LinkBarProps {
  link?: string;
}

export function LinkBar({ link = "" }: LinkBarProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup className="px-1 [--radius:9999px]">
        <Popover>
          <PopoverTrigger asChild>
            <InputGroupAddon>
              <InputGroupButton variant="ghost" size="icon-xs">
                <IconInfoCircle className="text-[#666666]" />
              </InputGroupButton>
            </InputGroupAddon>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="flex flex-col gap-1 py-4 px-5 rounded-xl text-sm"
          >
            <p className="font-medium mb-1">Jupyter Notebook</p>
            <p className="text-xs text-muted-foreground">
              Refer to the official documentation for details on the machine
              learning model development process
            </p>
          </PopoverContent>
        </Popover>
        <InputGroupAddon className="text-[#666666] font-normal pl-1.5">
          https://
        </InputGroupAddon>
        <span className="flex-1 py-2 text-sm text-[#666666]">
          {link || "your-link-here.com"}
        </span>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setIsFavorite(!isFavorite)}
            size="icon-xs"
          >
            <IconStar
              data-favorite={isFavorite}
              className="data-[favorite=true]:fill-blue-600 data-[favorite=true]:stroke-blue-600"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
