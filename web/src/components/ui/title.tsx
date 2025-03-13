export const Title = ({children}: {
  children: string;
}) => {
  return (
    <h2 className="uppercase text-4xl xs:text-6xl text-primary pb-4">
      { children }
    </h2>
  )
}
