interface Props {
  text: string;
  status: "active" | "disabled";
}

export default function Button({ text, status }: Props) {
  if (status === "active") {
    return (
      <button className="flex justify-center items-center bg-">{text}</button>
    );
  }
  return null;
}
