type ButtonProps = {
  children?: string;
  onClick?: () => void;
} 

export const Button = (props: ButtonProps) => {
  return (
    <button
      className="bg-primary rounded-full xs:px-6 xs:py-4 px-3 py-2"
      onClick={props.onClick}
    >
      <span className="xs:text-base text-sm">{ props.children }</span>
    </button>
  )
}
