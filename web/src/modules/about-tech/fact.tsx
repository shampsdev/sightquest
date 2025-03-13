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
  const factClassName = `flex justify-between py-3 gap-5 items-center ${number % 2 == 0 ? "flex-row-reverse" : ""}`

  return (
    <div className={factClassName}>
      <div>
        <span className="uppercase text-xl">{ props.pretitle }</span>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            <p className="uppercase text-secondary text-sm xs:text-base">{ line }</p>
          </React.Fragment>
        ))}
      </div>

      <h3 className="uppercase text-9xl">0{ number }</h3>
    </div>
  )
}
