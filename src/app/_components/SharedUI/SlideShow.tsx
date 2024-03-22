import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useQueryString from "~/app/hooks/useQueryString";
import Link from "next/link";
import { useThemeContext } from "~/app/context/ThemeContext";
import { GifType } from "~/app/types";

export default function SlideShow({ gif }: { gif: GifType[] }) {
  const { theme } = useThemeContext();
  const searchParams = useSearchParams();
  const slideShowVal = searchParams && searchParams.get("slideShow") === "true";
  const [slideNumber, setSlideNumber] = useState<number>(0);
  const { deleteQueryString } = useQueryString();
  const pathname = usePathname();
  const isLeftArrow = slideNumber > 0;
  const isRightArrow = slideNumber < gif.length - 1;
  const graphContent = gif[slideNumber];

  const targetQueryName = "slideShow";
  const deleteQuery = () => {
    if (targetQueryName && searchParams.get(targetQueryName)) {
      return pathname + "?" + deleteQueryString(targetQueryName);
    } else {
      return pathname;
    }
  };

  const incremenet = () => {
    setSlideNumber(slideNumber + 1);
  };

  const decrement = () => {
    setSlideNumber(slideNumber - 1);
  };

  return (
    <div className="absolute z-50 flex h-full w-full items-center justify-center bg-slate-600 opacity-95">
      <div
        className="relative my-2 rounded-2xl opacity-95 lg:mx-32"
        style={{
          height: "calc(100% - 4rem)",
          width: "calc(100% - 3rem)",
          background: theme.background.primary,
        }}
      >
        {isLeftArrow && (
          <div
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform "
            onClick={decrement}
          >
            <IconButton
              color="primary"
              size="small"
              style={{ color: theme.background.quaternary, fontSize: "20px" }}
            >
              <ArrowLeftIcon />
            </IconButton>
          </div>
        )}
        <div className="absolute inset-y-0 left-0 right-0 mx-2 flex flex-col ">
          <div className="flex justify-end ">
            <Link href={deleteQuery()}>
              <IconButton color="primary" size="small" style={{ color: "red" }}>
                <CloseIcon />
              </IconButton>
            </Link>
          </div>
          {/* Slideshow content */}
          <div
            className="mx-8 flex flex-1 flex-col items-center"
            style={{ color: theme.text.title }}
          >
            <h1 className="mb-2 text-xl">{graphContent?.title}</h1>
            <p className="mb-1" style={{ color: theme.text.tertiary }}>
              {graphContent?.text}
            </p>
            <img src={graphContent?.img} alt="test" />
          </div>
        </div>
        {isRightArrow && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 transform "
            onClick={incremenet}
          >
            <IconButton
              color="primary"
              size="small"
              style={{ color: theme.background.quaternary, fontSize: "24px" }}
            >
              <ArrowRightIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}
