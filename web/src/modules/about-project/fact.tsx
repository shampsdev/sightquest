import React from "react";

export type FactProps = {
  pretitle?: string;
  text: string;
}

export const Fact = ({ props, number }: {
  props: FactProps,
  number: number
}) => {
  const lines = props.text.split('\n');
  const factClassName = `flex justify-between py-3 items-center border-b-4 border-primary ${number % 2 == 0 ? "flex-row-reverse" : ""}`

  return (
    <div className={factClassName}>
      <div>
        <span className="uppercase">{ props.pretitle }</span>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            <p className="uppercase xs:text-xl">{ line }</p>
          </React.Fragment>
        ))}
      </div>

      <h3 className="uppercase text-5xl xs:text-9xl">0{ number }</h3>
    </div>
  )
}
