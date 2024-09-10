import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import useQueryString from "~/app/hooks/useQueryString";
import { Button } from "~/components/ui/button";
import { Pencil2Icon, EyeOpenIcon } from "@radix-ui/react-icons";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";

const ToggleMode = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString, deleteQueryString } = useQueryString();

  const isExplorersMode = pathname.includes("/explorersMode");
  const targetQueryName = isExplorersMode ? "compareMode" : "edit";

  const toggle = () => {
    return searchParams.get(targetQueryName)
      ? pathname + "?" + deleteQueryString(targetQueryName)
      : pathname + "?" + createQueryString(targetQueryName, "true");
  };

  return (
    <Link href={toggle()}>
      <Button variant="ghost" size="icon">
        {isExplorersMode ? (
          searchParams?.get(targetQueryName) === "true" ? (
            <SoloMode />
          ) : (
            <DualMode />
          )
        ) : searchParams?.get(targetQueryName) === "true" ? (
          <ViewMode />
        ) : (
          <EditMode />
        )}
      </Button>
    </Link>
  );
};

export default ToggleMode;

const EditMode = () => {
  return <Pencil2Icon className="absolute h-[1.2rem] w-[1.2rem]" />;
};

const ViewMode = () => {
  return <EyeOpenIcon className="absolute h-[1.2rem] w-[1.2rem]" />;
};

const SoloMode = () => {
  return (
    <div className="relative flex h-[1.5rem] w-[1.5rem] items-center justify-center">
      <PersonIcon className="absolute scale-[1.2]" />
    </div>
  );
};

const DualMode = () => {
  return (
    <div className="relative flex h-[1.5rem] w-[1.5rem] items-center justify-center">
      <PeopleIcon className="absolute scale-[1.2]" />
    </div>
  );
};
