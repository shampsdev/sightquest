import arrow from "@/assets/arrow.svg";

export type PersonCardProps = {
  university: string;
  amplua: string;
  name: string;
  surname: string;
  photo: string;
  url: string;
};

export const PersonCard = (props: PersonCardProps) => {
  return (
    <label className="text-primary">
      <div className="relative">
        <img
          className="w-full h-full backdrop-brightness-75"
          src={props.photo}
        />
        <p className="absolute top-6 left-6 xs:text-base text-xs">
          Университет
          <br />
          <span className="xs:text-2xl text-base">{props.university}</span>
        </p>

        <p className="absolute top-6 right-6 text-right xs:text-base text-xs">
          Амплуа
          <br />
          <span className="xs:text-2xl text-base">{props.amplua}</span>
        </p>

        <p className="absolute bottom-6 left-6 xs:text-4xl text-md">
          {props.name}
          <br />
          {props.surname}
        </p>

        <a
          href={props.url}
          target="_blank"
          className="absolute right-5 bottom-5 xs:right-10 xs:bottom-10"
        >
          <img className="scale-100 xs:scale-150" src={arrow} />
        </a>
      </div>
    </label>
  );
};
